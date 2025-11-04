import React from "react";
import Chain from "../../svgs/chain";
import "@styles/components/step_manager.scss";


interface StepManagerProps {
    steps: Step[];
    currentStep: number;
    setStep: (step: number) => void;
}

interface Step {
    name: string;
    // type?: "basic-data" | "exact-location" | "additional-data" | "submit";
}

const StepManager: React.FC<StepManagerProps> = ({ steps, currentStep, setStep }) => {
    const [hoverStep, setHoverStep] = React.useState<number | null>(null);

    const navigateToStep = (nextStep: number) => {
        if (nextStep >= 1 && nextStep <= steps.length) {
            setStep(nextStep);
        }
    };

    return (
        <div className="step-manager">
            {steps.map((stepItem, index) => {
                const stepNumber = index + 1;
                // const stepType = stepItem.type || "submit";

                return (
                    <React.Fragment key={stepNumber}>
                        <div
                            className={`step ${currentStep === stepNumber ? "active" : ""} ${hoverStep === stepNumber ? "hovered" : ""}`}
                        >
                            <div
                                className="number"
                                onClick={() => navigateToStep(stepNumber)}
                                onMouseEnter={() => setHoverStep(stepNumber)}
                                onMouseLeave={() => setHoverStep(null)}
                            >
                                {stepNumber}
                            </div>
                            <div
                                className="name"
                                onClick={() => navigateToStep(stepNumber)}
                                onMouseEnter={() => setHoverStep(stepNumber)}
                                onMouseLeave={() => setHoverStep(null)}
                            >
                                {stepItem.name}
                            </div>
                        </div>
                        {stepNumber < steps.length && (
                            <div className="separator">
                                <Chain />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepManager;
