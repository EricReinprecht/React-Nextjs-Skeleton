import type { FormEvent } from "react";

import "@styles/components/default_search.scss"

interface DefaultSearchProps {
    id: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const DefaultSearch = ({ id, placeholder, value, onChange, onSubmit }: DefaultSearchProps) => {
    return (
        <div className="default-search-container">
            <div className="search-wrapper">
                <form className="search-bar" onSubmit={onSubmit} role="search">
                    <div className="icon"></div>
                    <input
                        id={`${id}-search`}
                        className="search-input"
                        type="search"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={placeholder}
                        aria-label={placeholder ?? "Search"}
                    />
                    <button
                        id={`${id}-button`}
                        className="submit-search-button"
                        type="submit"
                        aria-label="Suchen"
                    >
                        Suchen
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DefaultSearch;
