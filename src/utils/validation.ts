import type { AddressInput } from "../api/userApi";

// Mirrors the server's rules so most mistakes are caught before submitting

/** Returns the bare 10-digit mobile number, or null if it isn't one */
export const normalizePhone = (value: string) => {
  const match = value.replace(/[\s-]/g, "").match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  return match ? match[1] : null;
};

export const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

export const isPincode = (value: string) => /^[1-9]\d{5}$/.test(value.trim());

export type AddressErrors = Partial<Record<keyof AddressInput, string>>;

export const emptyAddress = (): AddressInput => ({
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});

export const validateAddress = (a: AddressInput): AddressErrors => {
  const errors: AddressErrors = {};
  if (a.name.trim().length < 2) errors.name = "Enter the recipient's name";
  if (!normalizePhone(a.phone)) errors.phone = "Enter a valid 10-digit mobile number";
  if (a.address.trim().length < 5) errors.address = "Enter house number, street and area";
  if (a.city.trim().length < 2) errors.city = "Enter a city";
  if (!a.state?.trim()) errors.state = "Choose a state";
  if (!isPincode(a.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
};

export const trimAddress = (a: AddressInput): AddressInput => ({
  name: a.name.trim(),
  phone: normalizePhone(a.phone) ?? a.phone.trim(),
  address: a.address.trim(),
  city: a.city.trim(),
  state: a.state?.trim() ?? "",
  pincode: a.pincode.trim(),
});
