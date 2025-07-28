import "@styles/components/loader.scss";
import React from "react";

interface LoadingSpinnerProps {
    type: string;
}

const Loader: React.FC<LoadingSpinnerProps>= ({type}) => {
    return (
        <div className={`loader-container`}>
            <span className={`loader ${type}`}></span>
        </div>
    );
};

export default Loader;