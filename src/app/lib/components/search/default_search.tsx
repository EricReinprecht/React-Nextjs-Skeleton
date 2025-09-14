import "@styles/components/default_search.scss"
import React from "react";

interface DeafualtSearchProps {
    id: string;
    placeholder?: string;
}

const DefaultSearch: React.FC<DeafualtSearchProps>= ({id, placeholder}) => {
    return (
        <div className="default-search-container">
            <div className="search-wrapper">
                <div className="search-bar">
                    <div className="icon"></div>
                    <input id={`${id}-search`} className="search-input" placeholder={placeholder}/>
                    <button id={`${id}-button`} className="submit-search-button"></button>
                </div>
            </div>
        </div>
    );
};

export default DefaultSearch;