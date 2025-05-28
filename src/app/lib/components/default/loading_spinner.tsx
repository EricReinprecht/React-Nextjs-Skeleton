import "@styles/components/loading_spinner.scss";
import React from "react";

interface LoadingSpinnerProps {
    type: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps>= ({type}) => {
    return (
        <div className={`loading-spinner type-${type}`}>
            <span className="loader"></span>
        </div>
    );
};

export default LoadingSpinner;