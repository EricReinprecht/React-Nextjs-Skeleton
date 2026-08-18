"use client";

import { useState, useEffect } from 'react';
import { Category } from '@shared/entities/category';

interface Step5CategorySelectorProps {
    allCategories: Category[];
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
}

function Step5CategorySelector({
    allCategories,
    selectedCategories,
    setSelectedCategories,
}: Step5CategorySelectorProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(allCategories);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredCategories(allCategories);
        } else {
            setFilteredCategories(
                allCategories.filter(cat =>
                    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, allCategories]);

    const toggleCategory = (category: Category) => {
        if (selectedCategories.some(c => c.id === category.id)) {
            setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <div className="step-content basic-data">
            <div className="form-intro">
                <span>Schritt 4</span>
                <h2>Passende Kategorien</h2>
                <p>Wähle die Themen, unter denen Besucher dein Event später entdecken sollen.</p>
            </div>
            <form className="party-form">
                <section className="form-section">
                    <div className="form-section-heading">
                        <span className="form-section-index">01</span>
                        <div>
                            <h3>Event einordnen</h3>
                            <p>Mehrere Kategorien sind möglich.</p>
                        </div>
                    </div>
                    <input
                        className="category-search"
                        type="search"
                        placeholder="Zum Beispiel Musik oder Festival"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="category-selection-summary">
                        <strong>{selectedCategories.length}</strong>
                        <span>{selectedCategories.length === 1 ? "Kategorie ausgewählt" : "Kategorien ausgewählt"}</span>
                    </div>
                    <div className="categories-list">
                        {filteredCategories.length === 0 && <p className="categories-empty">Keine Kategorien gefunden.</p>}
                        {filteredCategories.map(category => (
                            <label
                                key={category.id}
                                className={`category-result ${selectedCategories.some(c => c.id === category.id) ? "selected" : ""}`}
                                htmlFor={`category_checkbox-${category.id}`}
                            >
                        <input
                            type="checkbox"
                            checked={selectedCategories.some(c => c.id === category.id)}
                            onChange={() => toggleCategory(category)}
                            id={`category_checkbox-${category.id}`}
                            name={`category_checkbox-${category.id}`}
                        />
                                <span>{category.name}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </form>
        </div>
    );
}

export default Step5CategorySelector;

