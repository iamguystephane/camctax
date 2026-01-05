import type { Category } from "./learning";

export function categoryToIntent(category: Category): "registration_fix" | "tax_records" | "merchant_account" {
  if (category === "merchant-accounts") return "merchant_account";
  if (category === "taxes") return "tax_records";
  if (category === "compliance") return "tax_records";
  return "registration_fix";
}

