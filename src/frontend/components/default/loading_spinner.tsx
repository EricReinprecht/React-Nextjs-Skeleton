import React from "react";

import "@styles/components/loading_spinner.scss";

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
