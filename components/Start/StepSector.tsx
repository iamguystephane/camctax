import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { WizardFormInput } from "./Wizard.schema";
import { useState } from "@/hooks/useState";
import { useEffect } from "react";

const SectorOptions = [
  { value: "retail", label: "Shop / Retail" },
  { value: "food_and_drink", label: "Food & Drinks Processing" },
  { value: "services", label: "Professional Services (Salon, Repairs, Consulting, etc.)" },
  { value: "transport", label: "Transport / Logistics" },
  { value: "agriculture", label: "Agriculture / Farming" },
  // { value: "tech", label: "Technology / IT" },
  { value: "construction", label: "Construction / BTP" },
  { value: "contracts_and_supplies", label: "Contracts and Supplies" },
  { value: "health", label: "Health" },
  { value: "trade", label: "Trade" },
  { value: "non_profit", label: "Non-Profit / NGO" },
  // { value: "hospitality", label: "Hotels / Restaurants" },
  { value: "other", label: "Other" },
] as const;

type SectorType = (typeof SectorOptions)[number]["value"];

export default function StepSector({
  form,
}: {
  form: UseFormReturn<WizardFormInput>;
}) {
  const { setValue, register, watch, formState, trigger, clearErrors } = form;
  const { onboardingData, setOnboardingData } = useState();

  const sector = watch("sector");
  const sectorOther = watch("sectorOther");

  // Pre-select from onboarding data on mount
  useEffect(() => {
    const storedSector = onboardingData.sector;

    // Only pre-select if there's data and the form field is currently empty
    if (storedSector && !sector) {
      // Check if the stored sector matches one of our predefined options
      const matchingOption = SectorOptions.find(
        (opt) => opt.value === storedSector
      );

      if (matchingOption) {
        // It's a predefined option, set it directly
        setValue("sector", matchingOption.value, {
          shouldValidate: false,
        });
      } else {
        // It's a custom value, so the user had selected "other" before
        setValue("sector", "other", {
          shouldValidate: false,
        });
        setValue("sectorOther", storedSector, {
          shouldValidate: false,
        });
      }
    }
  }, [onboardingData.sector, sector, setValue]);

  const handleSectorChange = async (value: SectorType) => {
    setValue("sector", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (value !== "other") {
      setValue("sectorOther", "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      clearErrors("sectorOther");
      setOnboardingData((prev) => ({
        ...prev,
        sector: value,
      }));
    } else {
      // Don't clear the field, just trigger validation
      await trigger("sectorOther");
    }
  };

  // Persist sectorOther changes to onboardingData when sector is "other"
  useEffect(() => {
    if (sector === "other") {
      setOnboardingData((prev) => ({
        ...prev,
        sector: sectorOther || "",
      }));
    }
  }, [sectorOther, sector, setOnboardingData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          What do you do?
        </h1>
        <p className="text-slate-500">Tell us about your industry sector.</p>
      </div>

      {/* Select */}
      <Select value={sector} onValueChange={handleSectorChange}>
        <SelectTrigger className="h-14 bg-white w-full py-7">
          <SelectValue placeholder="Select your industry..." />
        </SelectTrigger>
        <SelectContent>
          {SectorOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Other input */}
      {sector === "other" && (
        <div className="space-y-2">
          <Label>Please specify</Label>
          <Input
            className="py-7"
            placeholder="e.g. Manufacturing"
            {...register("sectorOther", {
              shouldUnregister: false,
            })}
          />
          {formState.errors.sectorOther && (
            <p className="text-destructive text-sm">
              {formState.errors.sectorOther.message}
            </p>
          )}
        </div>
      )}

      {/* Sector error */}
      {formState.errors.sector && (
        <p className="text-destructive text-sm">Please select a sector</p>
      )}
    </div>
  );
}
