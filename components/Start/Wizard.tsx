"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Steps } from "@/components/ui/steps";
import { useToast } from "@/hooks/useToast";

import { wizardSchema, WizardFormData, WizardFormInput } from "./Wizard.schema";
import { STEPS } from "./Wizard.steps";

import WizardHeader from "./WizardHeader";
import WizardNavigation from "./WizardNavigation";
import { WizardAnimator } from "./WizardAnimator";
import StepIntent from "./StepIntent";
import StepBusiness from "./StepBusiness";
import StepSector from "./StepSector";
import StepLocation from "./StepLocation";
import StepContact from "./StepContact";
import StepSuccess from "./StepSuccess";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Wizard({ searchParams }: Props) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const form = useForm<WizardFormInput>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      status: "new",
      languagePref: "en",
    },
    mode: "onChange",
  });

  // Prefill from query params: intent_primary and lead_source_detail
  useEffect(() => {
    if (!searchParams) return;
    const getFirst = (v: string | string[] | undefined) =>
      Array.isArray(v) ? v[0] : v;

    const lead = getFirst(searchParams["lead_source_detail"]);
    const intent = getFirst(searchParams["intent_primary"]);
    const allowed = new Set([
      "registration_fix",
      "tax_records",
      "merchant_account",
      "guidance",
    ] as const);
    if (intent && allowed.has(intent as any)) {
      form.setValue("intentPrimary", intent as any, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [searchParams]);

  const submit = async (data: WizardFormInput) => {
    try {
      setStep(STEPS.length - 1);
    } catch (e) {
      toast({ title: "Submission failed", variant: "destructive" });
    }
  };

  const next = async () => {
    const fields = STEPS[step]?.validationFields || [];

    // First validate all step fields
    const valid = await form.trigger(fields as (keyof WizardFormInput)[]);

    // Get the current form state
    const sectorValue = form.getValues("sector");
    const sectorOtherValue = form.getValues("sectorOther");

    // If sector is "other", ensure sectorOther is filled
    if (
      sectorValue === "other" &&
      (!sectorOtherValue || sectorOtherValue.trim() === "")
    ) {
      form.setError("sectorOther", {
        type: "manual",
        message: "Please specify your sector",
      });
      return;
    }

    if (!valid) return;

    if (step === STEPS.length - 2) {
      form.handleSubmit(submit)();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <WizardHeader />

      <div className="flex-1 xsm:w-full md:w-3/4 md:mx-auto lg:w-1/2 flex flex-col py-5 px-3 gap-15">
        {step < STEPS.length - 1 && (
          <Steps steps={STEPS.slice(0, -1)} currentStep={step} />
        )}

        <WizardAnimator step={step}>
          {
            {
              0: <StepContact form={form} />,
              1: <StepIntent form={form} />,
              2: <StepBusiness form={form} />,
              3: <StepSector form={form} />,
              4: <StepLocation form={form} />,
              5: (
                <StepSuccess
                  onBack={() => setStep((s) => Math.max(0, s - 1))}
                  form={form}
                />
              ),
            }[step]
          }
        </WizardAnimator>

        <WizardNavigation
          step={step}
          maxStep={STEPS.length - 1}
          loading={form.formState.isSubmitting}
          onBack={() => setStep((s) => Math.max(0, s - 1))}
          onNext={next}
        />
      </div>
    </div>
  );
}
