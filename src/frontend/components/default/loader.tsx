import React from "react";

import "@styles/components/loader.scss";

interface LoadingSpinnerProps {
    type: string;
    content?: string;
}

const Loader: React.FC<LoadingSpinnerProps>= ({type, content}) => {
    return (
        <div className={`loader-container`}>
            <span className={`loader ${type}`} data-label={content}></span>
        </div>
    );
};

export default Loader;
