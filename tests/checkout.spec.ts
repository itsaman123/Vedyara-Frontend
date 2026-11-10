import { test, expect, type Page, type Request } from "@playwright/test";
import { mockAllApis, waitForPageLoad } from "./fixtures/helpers";
import { mockCart } from "./fixtures/mockData";

const API = "https://vedyara-backend.onrender.com";

const user = {
  _id: "user_1",
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "9876543210",
  role: "user",
  emailVerified: false,
  addresses: [],
};

const shippingAddress = {
  name: "Asha Rao",
  phone: "9876543210",
  address: "12 MG Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

const order = {
  _id: "order_1",
  orderNumber: "ORD-1730000000000-123",
  customerName: user.name,
  customerEmail: user.email,
  status: "processing",
  paymentStatus: "awaiting",
  paymentMethod: "cod",
  amount: 449,
  itemsCount: 1,
  shippingAddress,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  items: [{ productId: "prod_honey_500", name: "Pure Natural Honey", image: "", slug: "pure-natural-honey-500g", quantity: 1, price: 449 }],
};

const ok = (data: unknown) => ({ json: { success: true, message: "ok", data } });

async function setUpCheckout(page: Page) {
  await page.addInitScript((c) => localStorage.setItem("guest_cart", JSON.stringify(c)), mockCart.data);
  await mockAllApis(page);
  await page.route(`${API}/api/v1/orders/payment-config`, (r) =>
    r.fulfill(ok({ razorpayEnabled: false, razorpayKeyId: null, codEnabled: true })),
  );
  await page.route(`${API}/api/v1/users/profile`, (r) => r.fulfill(ok({ user })));
  await page.route(`${API}/api/v1/cart/merge`, (r) => r.fulfill(mockCart));

  const placed: Request[] = [];
  await page.route(`${API}/api/v1/orders/create-cod`, (r) => {
    placed.push(r.request());
    return r.fulfill({ status: 201, ...ok({ order }) });
  });
  return placed;
}

async function fillDetails(page: Page) {
  // Contact fields come first; the address copies name and phone from them
  await page.getByLabel("Full name").first().fill("Asha Rao");
  await page.getByLabel("Mobile number").first().fill("+91 98765 43210");
  await page.getByLabel("Email").fill("Asha@Example.com");
  await page.getByLabel("Address", { exact: true }).fill("12 MG Road, Indiranagar");
  await page.getByLabel("City").fill("Bengaluru");
  await page.getByLabel("Pincode").fill("560038");
  await page.getByLabel("State").selectOption("Karnataka");
  await page.getByLabel("Cash on delivery").check();
}

const placeOrderButton = (page: Page) => page.locator("button:visible", { hasText: /Place order/ });

test.describe("Checkout — guest", () => {
  test("new customer: account is created and a COD order is placed", async ({ page }) => {
    const placed = await setUpCheckout(page);
    let authBody: unknown;
    await page.route(`${API}/api/v1/users/checkout-auth`, (r) => {
      authBody = r.request().postDataJSON();
      return r.fulfill({ status: 201, ...ok({ otpRequired: false, token: "token_new", user }) });
    });

    await page.goto("/checkout");
    await waitForPageLoad(page);
    await fillDetails(page);
    await placeOrderButton(page).click();

    await expect(page).toHaveURL(/\/order-confirmation/, { timeout: 10_000 });
    await expect(page.getByText("Order Confirmed!")).toBeVisible();
    await expect(page.getByText(order.orderNumber)).toBeVisible();
    await expect(page.getByText(/Cash on Delivery · ₹449/)).toBeVisible();

    expect(authBody).toEqual({ name: "Asha Rao", email: "asha@example.com", phone: "9876543210" });
    expect(placed).toHaveLength(1);
    expect(placed[0].postDataJSON()).toEqual({
      items: [{ productId: "prod_honey_500", quantity: 1 }],
      shippingAddress,
      saveAddress: true,
    });
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBe("token_new");
  });

  test("returning customer: verifies the emailed code, then the order is placed", async ({ page }) => {
    const placed = await setUpCheckout(page);
    await page.route(`${API}/api/v1/users/checkout-auth`, (r) =>
      r.fulfill(ok({ otpRequired: true, email: "asha@example.com" })),
    );
    await page.route(`${API}/api/v1/users/otp/verify`, (r) => {
      const { otp } = r.request().postDataJSON();
      return otp === "482913"
        ? r.fulfill(ok({ otpRequired: false, token: "token_back", user: { ...user, emailVerified: true } }))
        : r.fulfill({ status: 400, json: { success: false, message: "Incorrect code. Please check and try again" } });
    });

    await page.goto("/checkout");
    await waitForPageLoad(page);
    await fillDetails(page);
    await placeOrderButton(page).click();

    await expect(page.getByText(/Welcome back/)).toBeVisible({ timeout: 8000 });
    expect(placed).toHaveLength(0);

    await page.getByLabel("Verification code").fill("111111");
    await page.getByRole("button", { name: /Verify & place order/ }).click();
    await expect(page.getByText(/Incorrect code/)).toBeVisible();

    await page.getByLabel("Verification code").fill("482913");
    await page.getByRole("button", { name: /Verify & place order/ }).click();

    await expect(page).toHaveURL(/\/order-confirmation/, { timeout: 10_000 });
    expect(placed).toHaveLength(1);
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBe("token_back");
  });

  test("missing details are flagged and nothing is submitted", async ({ page }) => {
    const placed = await setUpCheckout(page);
    let authCalls = 0;
    await page.route(`${API}/api/v1/users/checkout-auth`, (r) => {
      authCalls++;
      return r.fulfill(ok({ otpRequired: true, email: "x@example.com" }));
    });

    await page.goto("/checkout");
    await waitForPageLoad(page);
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Pincode").fill("12345");
    await placeOrderButton(page).click();

    await expect(page.getByText("Enter a valid email address")).toBeVisible();
    await expect(page.getByText("Enter a valid 6-digit pincode")).toBeVisible();
    // "Choose a state" is also the dropdown's placeholder, so check the field itself
    await expect(page.getByLabel("State")).toHaveAttribute("aria-invalid", "true");
    expect(authCalls).toBe(0);
    expect(placed).toHaveLength(0);
  });
});

test.describe("Account", () => {
  test("profile sends signed-out visitors to sign in", async ({ page }) => {
    await mockAllApis(page);
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login\?next=%2Fprofile/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("sign in with an unknown email explains how accounts are created", async ({ page }) => {
    await mockAllApis(page);
    await page.route(`${API}/api/v1/users/otp/request`, (r) =>
      r.fulfill({ status: 404, json: { success: false, message: "No account found" } }),
    );
    await page.goto("/login");
    await page.getByLabel("Email").fill("new@example.com");
    await page.getByRole("button", { name: /Send code/ }).click();
    await expect(page.getByText(/created automatically when you\s+place your first order/)).toBeVisible();
  });

  test("signing in with a code opens the requested page", async ({ page }) => {
    await mockAllApis(page);
    await page.route(`${API}/api/v1/users/otp/request`, (r) => r.fulfill(ok({ otpRequired: true, email: user.email })));
    await page.route(`${API}/api/v1/users/otp/verify`, (r) => r.fulfill(ok({ otpRequired: false, token: "t", user })));
    await page.route(`${API}/api/v1/users/profile`, (r) => r.fulfill(ok({ user })));

    await page.goto("/login?next=/orders");
    await page.getByLabel("Email").fill(user.email);
    await page.getByRole("button", { name: /Send code/ }).click();
    await page.getByLabel("Verification code").fill("123456");
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByRole("heading", { name: "Order History" })).toBeVisible();
  });
});
