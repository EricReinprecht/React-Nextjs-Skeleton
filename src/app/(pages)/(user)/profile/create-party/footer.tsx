"use client";

import DefautButton from "@components/default/default_button";
import "@styles/components/default_button.scss"

type PartyFormFooterProps = {
  step: number;
  navigateToStep: (step: number) => void;
  onSubmit: () => void;
};

const Footer: React.FC<PartyFormFooterProps> = ({
  step,
  navigateToStep,
  onSubmit,
}) => {
    return (
        <div className="footer">
            <DefautButton
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

            {step !== 5 && (
                <DefautButton
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

            {step === 5 && (
                <DefautButton
                    label="Submit"
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