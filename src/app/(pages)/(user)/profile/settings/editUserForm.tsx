"use client";

import { useState, useEffect } from "react";
import withAuth from "@hoc/withAuth";
import { User } from "@prisma/client";

import "@styles/pages/create-party.scss";

interface EditUserFormProps {
    authUser: User;
}

const EditUserForm = ({ authUser }: EditUserFormProps) => {
    const [formData, setFormData] = useState<User | null>(null);
    const [isChanged, setIsChanged] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (authUser) setFormData(authUser);
    }, [authUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : prev));
        setIsChanged(true);
        setMessage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (!isChanged) {
            setMessageType("info");
            return setMessage("Es gibt keine Änderungen zu speichern.");
        }

        try {
            setSaving(true);
            const form = new FormData();
            for (const [key, val] of Object.entries(formData)) {
                form.append(key, String(val ?? ""));
            }

            const res = await fetch(`/api/user/edit/${authUser.id}`, {
                method: "PUT",
                body: form,
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setMessageType("success");
            setMessage("Deine Einstellungen wurden gespeichert.");
            setIsChanged(false);
        } catch (err) {
            console.error(err);
            setMessageType("error");
            setMessage("Die Einstellungen konnten nicht gespeichert werden.");
        } finally {
            setSaving(false);
        }
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div className="settings-page">
            <header className="settings-header">
                <div className="settings-avatar" aria-hidden="true">
                    {formData.firstname?.charAt(0)}{formData.lastname?.charAt(0)}
                </div>
                <div>
                    <span className="settings-kicker">Mein Konto</span>
                    <h1>Persönliche Einstellungen</h1>
                    <p>Verwalte deine Kontaktdaten und Rechnungsadresse.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="profile-form">
                <section className="settings-section">
                    <div className="settings-section-heading">
                        <span>01</span>
                        <div><h2>Persönliche Daten</h2><p>Diese Angaben werden für dein Profil verwendet.</p></div>
                    </div>
                    <div className="settings-field-grid">
                        <div className="settings-field">
                                <label htmlFor="settings-username">Benutzername</label>
                                <input
                                    id="settings-username"
                                    name="username"
                                    value={formData.username || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="username"
                                />
                        </div>
                        <div className="settings-field">
                                <label htmlFor="settings-firstname">Vorname</label>
                                <input
                                    id="settings-firstname"
                                    name="firstname"
                                    value={formData.firstname || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="given-name"
                                />
                        </div>
                        <div className="settings-field">
                                <label htmlFor="settings-lastname">Nachname</label>
                                <input
                                    id="settings-lastname"
                                    name="lastname"
                                    value={formData.lastname || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="family-name"
                                />
                        </div>
                        <div className="settings-field settings-field-wide is-readonly">
                            <label htmlFor="settings-email">E-Mail-Adresse</label>
                            <input id="settings-email" value={formData.email || ""} type="email" readOnly />
                            <small>Die E-Mail-Adresse kann hier nicht geändert werden.</small>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <div className="settings-section-heading">
                        <span>02</span>
                        <div><h2>Adresse</h2><p>Wird für Bestellungen und Rechnungen verwendet.</p></div>
                    </div>
                    <div className="settings-field-grid">
                            <div className="settings-field">
                                <label htmlFor="settings-country">Land</label>
                                <input
                                    id="settings-country"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="country-name"
                                />
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-city">Ort</label>
                                <input
                                    id="settings-city"
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="address-level2"
                                />
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-zip">Postleitzahl</label>
                                <input
                                    id="settings-zip"
                                    name="zip"
                                    value={formData.zip || ""}
                                    onChange={handleChange}
                                    type="number"
                                    autoComplete="postal-code"
                                />
                            </div>
                            <div className="settings-field settings-field-street">
                                <label htmlFor="settings-street">Straße</label>
                                <input
                                    id="settings-street"
                                    name="street"
                                    value={formData.street || ""}
                                    onChange={handleChange}
                                    type="text"
                                    autoComplete="address-line1"
                                />
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-house">Hausnummer</label>
                                <input
                                    id="settings-house"
                                    name="housenumber"
                                    value={formData.housenumber || ""}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-unit">Tür / Top</label>
                                <input
                                    id="settings-unit"
                                    name="unit"
                                    value={formData.unit || ""}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                    </div>
                </section>

                <footer className="settings-form-footer">
                    <div aria-live="polite">
                        {message && <p className={`settings-message ${messageType}`}>{message}</p>}
                    </div>
                    <button className="settings-save-button" type="submit" disabled={!isChanged || saving}>
                        {saving ? "Wird gespeichert …" : "Änderungen speichern"}
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default withAuth(EditUserForm);
