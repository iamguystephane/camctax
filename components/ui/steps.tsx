import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Step = {
  id: string;
  title: string;
};

export function Steps({
  steps,
  currentStep,
  className,
}: {
  steps: Step[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-between items-center mx-auto w-full p-4 gap-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border text-sm font-medium transition",
                  isCompleted && "bg-primary text-white border-primary",
                  isActive && "border-primary text-primary",
                  !isCompleted &&
                    !isActive &&
                    "border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs text-center",
                  isActive && "text-primary font-medium",
                  !isActive && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 transition",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
