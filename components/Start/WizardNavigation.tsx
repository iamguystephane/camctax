import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";


export default function WizardNavigation({
  step,
  maxStep,
  loading,
  onBack,
  onNext,
}: {
  step: number;
  maxStep: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}) {

  if (step === maxStep) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 0}
        className={step === 0 ? "invisible" : ""}
      >
        Back
      </Button>

      <Button onClick={onNext} disabled={loading} className="">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            {step === maxStep - 1 ? "Submit Request" : "Continue"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
