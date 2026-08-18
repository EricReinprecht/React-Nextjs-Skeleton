"use client";

import { FormEvent, useState } from "react";

import { ExcelPartyList, DefaultSearch } from "@frontend/components";
import { BasePage } from "@frontend/templates";

import "@styles/pages/browse.scss";

export default function BrowsePage() {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchTerm(searchInput.trim());
    };

    const quickSearches = ["Vienna", "Music", "Festival", "Open Air"];

    return (
        <div className="browse-page">
            <BasePage>
                <section className="browse-hero">
                    <div className="browse-burst" aria-hidden="true">✦</div>
                    <span className="browse-kicker">Rausgehen schlägt zuhause bleiben</span>
                    <h1>Find your<br /><em>next night.</em></h1>
                    <p>Konzerte, Clubnächte, Festivals und die Events, von denen morgen alle erzählen.</p>
                    <DefaultSearch
                        id="browse-header"
                        placeholder="Stadt, Event oder Stimmung …"
                        value={searchInput}
                        onChange={setSearchInput}
                        onSubmit={submitSearch}
                    />
                    <div className="browse-quick-searches" aria-label="Schnellsuche">
                        <span>Popular:</span>
                        {quickSearches.map((term) => (
                            <button key={term} type="button" onClick={() => { setSearchInput(term); setSearchTerm(term); }}>
                                {term}
                            </button>
                        ))}
                    </div>
                    {searchTerm && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={() => {
                                setSearchInput("");
                                setSearchTerm("");
                            }}
                        >
                            Suche nach „{searchTerm}“ löschen
                        </button>
                    )}
                </section>
                <ExcelPartyList searchTerm={searchTerm} />
            </BasePage>
        </div>
    );
}
