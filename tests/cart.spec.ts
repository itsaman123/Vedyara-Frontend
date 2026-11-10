import { test, expect } from "@playwright/test";
import { mockAllApis, waitForPageLoad } from "./fixtures/helpers";
import { mockCart, mockEmptyCart } from "./fixtures/mockData";

const API = "https://vedyara-backend.onrender.com";

// Helper: populate guest cart in localStorage (CartContext reads this when no token)
async function setGuestCart(page: import("@playwright/test").Page, cart = mockCart.data) {
  await page.addInitScript((c) => {
    localStorage.setItem("guest_cart", JSON.stringify(c));
  }, cart);
}

test.describe("Cart — empty state", () => {
  test("shows empty cart message and shop link", async ({ page }) => {
    await mockAllApis(page);
    await page.goto("/cart");
    await waitForPageLoad(page);

    await expect(page.getByText(/Your Cart is Empty/i)).toBeVisible({ timeout: 6000 });
    await expect(page.getByRole("link", { name: /Start Shopping|Shop|Products/i }).first()).toBeVisible();
  });
});

test.describe("Cart — with items", () => {
  test.beforeEach(async ({ page }) => {
    // Populate guest cart via localStorage so CartContext shows items without a token
    await setGuestCart(page);
    await mockAllApis(page);
  });

  test("cart page shows item name and price", async ({ page }) => {
    await page.goto("/cart");
    await waitForPageLoad(page);

    await expect(page.getByText("Pure Natural Honey")).toBeVisible({ timeout: 6000 });
    await expect(page.getByText(/449/).first()).toBeVisible();
  });

  test("cart total is displayed", async ({ page }) => {
    await page.goto("/cart");
    await waitForPageLoad(page);

    // Total amount should appear somewhere on the page
    await expect(page.getByText(/449|Total/i).first()).toBeVisible({ timeout: 6000 });
  });

  test("checkout button exists when cart has items", async ({ page }) => {
    await page.goto("/cart");
    await waitForPageLoad(page);

    const checkoutBtn = page.getByRole("button", { name: /Proceed to Checkout/i });
    await expect(checkoutBtn.first()).toBeVisible({ timeout: 6000 });
    await checkoutBtn.first().click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("remove item empties the cart", async ({ page }) => {
    await page.goto("/cart");
    await waitForPageLoad(page);

    await page.getByRole("button", { name: /Remove .* from cart/i }).first().click();
    await expect(page.getByText(/Your Cart is Empty/i)).toBeVisible({ timeout: 6000 });
    const guestCart = await page.evaluate(() => JSON.parse(localStorage.getItem("guest_cart") || "{}"));
    expect(guestCart.items).toHaveLength(0);
  });

  test("quantity stepper updates the line total", async ({ page }) => {
    await page.goto("/cart");
    await waitForPageLoad(page);

    await page.getByRole("button", { name: "Increase quantity" }).first().click();
    await expect(page.getByText("₹898").first()).toBeVisible({ timeout: 6000 });
  });
});

test.describe("Cart — guest cart interactions", () => {
  test("add to cart button is clickable without auth (no crash)", async ({ page }) => {
    await mockAllApis(page);
    await page.goto("/products");
    await waitForPageLoad(page);

    const addBtn = page.getByRole("button", { name: /to cart/i }).first();
    await expect(addBtn).toBeVisible({ timeout: 8000 });
    // Adding from a card shouldn't open the product page
    await addBtn.click();
    await page.waitForTimeout(600);
    expect(page.url()).toContain("/products");
    const guestCart = await page.evaluate(() => JSON.parse(localStorage.getItem("guest_cart") || "{}"));
    expect(guestCart.items?.[0]?.price).toBe(449); // discounted price, not MRP
  });
});

test.describe("Checkout", () => {
  test("empty cart checkout points back to the shop", async ({ page }) => {
    await mockAllApis(page);
    await page.goto("/checkout");
    await waitForPageLoad(page);

    await expect(page.getByText(/Your cart is empty/i)).toBeVisible({ timeout: 6000 });
    await expect(page.getByRole("link", { name: /Browse products/i })).toBeVisible();
  });

  test("guest checkout asks for contact and address details", async ({ page }) => {
    await setGuestCart(page);
    await mockAllApis(page);
    await page.goto("/checkout");
    await waitForPageLoad(page);

    await expect(page.getByLabel("Email")).toBeVisible({ timeout: 6000 });
    await expect(page.getByLabel("Pincode")).toBeVisible();
    await expect(page.getByText("Pure Natural Honey").first()).toBeVisible();
  });
});
