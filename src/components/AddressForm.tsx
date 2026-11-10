import type { AddressInput } from "../api/userApi";
import { INDIAN_STATES } from "../data/indianStates";
import type { AddressErrors } from "../utils/validation";
import { Field, SelectField } from "./FormField";

export default function AddressForm({
  value,
  onChange,
  errors = {},
}: {
  value: AddressInput;
  onChange: (next: AddressInput) => void;
  errors?: AddressErrors;
}) {
  const set = (key: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field
        label="Full name"
        autoComplete="shipping name"
        value={value.name}
        onChange={set("name")}
        error={errors.name}
      />
      <Field
        label="Mobile number"
        type="tel"
        inputMode="tel"
        autoComplete="shipping tel"
        placeholder="10-digit mobile"
        value={value.phone}
        onChange={set("phone")}
        error={errors.phone}
        hint="For delivery updates"
      />
      <Field
        label="Address"
        className="sm:col-span-2"
        autoComplete="shipping street-address"
        placeholder="House no., building, street, area"
        value={value.address}
        onChange={set("address")}
        error={errors.address}
      />
      <Field
        label="City"
        autoComplete="shipping address-level2"
        value={value.city}
        onChange={set("city")}
        error={errors.city}
      />
      <Field
        label="Pincode"
        inputMode="numeric"
        autoComplete="shipping postal-code"
        maxLength={6}
        value={value.pincode}
        onChange={set("pincode")}
        error={errors.pincode}
      />
      <SelectField
        label="State"
        className="sm:col-span-2"
        autoComplete="shipping address-level1"
        value={value.state ?? ""}
        onChange={set("state")}
        error={errors.state}
      >
        <option value="" disabled>
          Choose a state
        </option>
        {INDIAN_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </SelectField>
    </div>
  );
}
