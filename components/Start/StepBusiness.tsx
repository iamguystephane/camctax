import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { WizardFormInput } from "./Wizard.schema";
import { useState } from "@/hooks/useState";
import { User, Building2, Building, Handshake, HelpCircle } from "lucide-react";
import { useEffect } from "react";

type Props = {
  form: UseFormReturn<WizardFormInput>;
};

const BusinessOptions = [
  {
    id: "ets",
    label: "Ets (Etablissement/Sole-Proprietorship)",
    icon: User,
    description: "Simple owner-run business with minimal formalities",
  },
  {
    id: "sarl",
    label: "SARL/LTD (Societe a Responsabilite Limitée/Limited Liability Company)",
    icon: Building2,
    description: "Limited liability company for small to medium businesses",
  },
  {
    id: "sa",
    label: "SA/PLC (Societe Anonyme/Public Limited Company)",
    icon: Building,
    description:
      "Corporation structure suitable for larger companies and investors",
  },
  {
    id: "ngo",
    label: "Association / NGO",
    icon: Handshake,
    description: "Non-profit or community organization for social impact",
  },
  // { id: "gie", label: "GIE", icon: Link },
  {
    id: "none",
    label: "I am not sure",
    icon: HelpCircle,
    description: "Not sure yet — we'll help you choose the right form",
  },
] as const;

type BusinessType = (typeof BusinessOptions)[number]["id"];

export default function StepBusiness({ form }: Props) {
  const { setValue, formState, watch } = form;
  const { onboardingData, setOnboardingData } = useState();

  const selected = watch("businessType");

  // Pre-select from onboarding data on mount
  useEffect(() => {
    if (onboardingData.businessStructure && !selected) {
      setValue(
        "businessType",
        onboardingData.businessStructure as BusinessType,
        {
          shouldValidate: false,
        }
      );
    }
  }, [onboardingData.businessStructure, selected, setValue]);

  const handleSelect = (value: BusinessType) => {
    // Update RHF
    setValue("businessType", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Update global onboarding state
    setOnboardingData((prev) => ({
      ...prev,
      businessStructure: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          What is your business structure?
        </h1>
        <p className="text-slate-500">
          Select the legal form of your enterprise.
        </p>
      </div>

      {/* Options */}
      <RadioGroup
        value={selected}
        onValueChange={(val) => handleSelect(val as BusinessType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {BusinessOptions.map((o) => {
          const IconComponent = o.icon;
          return (
            <div key={o.id}>
              <RadioGroupItem value={o.id} id={o.id} className="peer sr-only" />
              <Label
                htmlFor={o.id}
                className="
                  flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer
                  transition
                  hover:border-primary
                  peer-data-[state=checked]:border-primary
                  peer-data-[state=checked]:bg-blue-50
                "
              >
                <IconComponent className="w-8 h-8 mb-2" />
                <span className="font-bold text-center">{o.label}</span>
                {o.description && (
                  <span className="text-sm text-slate-500 mt-2 text-center">
                    {o.description}
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {/* Error */}
      {formState.errors.businessType && (
        <p className="text-destructive text-sm">
          Please select a business type
        </p>
      )}
    </div>
  );
}
