"use client";

import { DefaultButton } from "@frontend/components";

import "@styles/components/default_button.scss"

type PartyFormFooterProps = {
    steps: Step[];
    step: number;
    navigateToStep: (step: number) => void;
    onSubmit: () => void;
};
interface Step {
    name: string;
}

const Footer: React.FC<PartyFormFooterProps> = ({
    steps,
    step,
    navigateToStep,
    onSubmit,
}) => {
    return (
        <div className="footer">
            <DefaultButton
                label="Prev"
                type="button"
                onClick={() => navigateToStep(step - 1)}
                disabled={step === 1}
                styles={{
                    bgColor: "black",
                    textColor: "white",
                    borderColor: "black",
                    hoverBgColor: "white",
                    hoverTextColor: "black",
                    hoverBorderColor: "black",
                }}
            />

            {step !== steps.length && (
                <DefaultButton
                    label="Next"
                    type="button"
                    onClick={() => navigateToStep(step + 1)}
                    styles={{
                        bgColor: "black",
                        textColor: "white",
                        borderColor: "black",
                        hoverBgColor: "white",
                        hoverTextColor: "black",
                        hoverBorderColor: "black",
                    }}
                />
            )}

            {step === steps.length && (
                <DefaultButton
                    label="Speichern & ansehen"
                    type="button"
                    onClick={onSubmit}
                    styles={{
                        bgColor: "submit_green",
                        textColor: "white",
                        borderColor: "submit_green",
                        hoverBgColor: "white",
                        hoverTextColor: "submit_green",
                        hoverBorderColor: "submit_green",
                    }}
                />
            )}
        </div>
    );
};

export default Footer;
