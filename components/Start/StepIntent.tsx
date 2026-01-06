import { UseFormReturn } from "react-hook-form";
import { WizardFormInput } from "./Wizard.schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "@/hooks/useState";
import { useEffect } from "react";

type Props = {
  form: UseFormReturn<WizardFormInput>;
};

const OPTIONS = [
  {
    value: "registration_fix",
    title: "Business Registration",
    description: "Register a new business or update existing registration.",
  },
  {
    value: "tax_records",
    title: "Tax Declarations",
    description: "File your monthly and quarterly taxes.",
  },
  {
    value: "guidance",
    title: "Tax Assistance",
    description: "Technical advice on paying your taxes in Cameroon, and understanding tax regimes.",
  },
  {
    value: "merchant_account",
    title: "Bank Merchants",
    description: "Get your business ready for bank/merchant account approval.",
  },
] as const;

export default function StepIntent({ form }: Props) {
  const { onboardingData, setOnboardingData } = useState();
  const { setValue, formState, watch } = form;

  const selected = watch("intentPrimary");

  // Pre-select from onboarding data on mount
  useEffect(() => {
    if (onboardingData.goal.value && !selected) {
      setValue(
        "intentPrimary",
        onboardingData.goal.value as WizardFormInput["intentPrimary"],
        {
          shouldValidate: false,
        }
      );
    }
  }, [onboardingData.goal.value, selected, setValue]);

  const handleSelect = (value: WizardFormInput["intentPrimary"]) => {
    const selectedOption = OPTIONS.find((o) => o.value === value);
    if (!selectedOption) return;

    // Update RHF
    setValue("intentPrimary", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Update global onboarding state
    setOnboardingData((prev) => ({
      ...prev,
      goal: {
        value: selectedOption.value,
        title: selectedOption.title,
        description: selectedOption.description,
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">
          How can we help you?
        </h1>
        <p className="text-slate-500 mt-1">
          Choose the primary reason you are here today.
        </p>
      </div>

      {/* Options */}
      <RadioGroup
        value={selected}
        onValueChange={(val) =>
          handleSelect(val as WizardFormInput["intentPrimary"])
        }
        className="space-y-4"
      >
        {OPTIONS.map((opt) => (
          <div key={opt.value}>
            <RadioGroupItem
              value={opt.value}
              id={opt.value}
              className="peer sr-only"
            />

            <Label
              htmlFor={opt.value}
              className="
                block cursor-pointer rounded-xl border p-5 transition
                hover:border-primary
                peer-data-[state=checked]:border-primary
                peer-data-[state=checked]:ring-1
                peer-data-[state=checked]:ring-primary
              "
            >
              <div className="font-semibold text-base">{opt.title}</div>
              <div className="text-sm text-slate-500 mt-1">
                {opt.description}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Error */}
      {formState.errors.intentPrimary && (
        <p className="text-destructive text-sm">Please select an option</p>
      )}
    </div>
  );
}
