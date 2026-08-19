'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { DefaultButton } from '@frontend/components';
import '@styles/forms/register_form.scss';

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'de';

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        country: '',
        zip: '',
        city: '',
        street: '',
        housenumber: '',
        unit: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to register');

            // Navigate to profile with locale prefix
            router.push(`/${locale}/profile`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page-wrapper">
            <div className="form-card">
                <div className="form-header">
                    <h2>Create Account</h2>
                    <p>Join Evently to discover events and manage your tickets</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && <div className="error-banner">{error}</div>}

                    {/* --- Account Information --- */}
                    <div className="form-section">
                        <span className="section-title">Account Information</span>
                        <div className="grid-row two-cols">
                            <div className="input-group">
                                <label htmlFor="username">Username *</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-row two-cols">
                            <div className="input-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Personal Information --- */}
                    <div className="form-section">
                        <span className="section-title">Personal Details</span>
                        <div className="grid-row three-cols">
                            <div className="input-group">
                                <label htmlFor="firstname">First Name *</label>
                                <input
                                    id="firstname"
                                    type="text"
                                    name="firstname"
                                    placeholder="John"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="lastname">Last Name *</label>
                                <input
                                    id="lastname"
                                    type="text"
                                    name="lastname"
                                    placeholder="Doe"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="birthdate">Birthdate *</label>
                                <input
                                    id="birthdate"
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Address Information --- */}
                    <div className="form-section">
                        <span className="section-title">Address Details</span>
                        <div className="grid-row three-cols">
                            <div className="input-group">
                                <label htmlFor="country">Country *</label>
                                <input
                                    id="country"
                                    type="text"
                                    name="country"
                                    placeholder="Austria"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="zip">ZIP Code *</label>
                                <input
                                    id="zip"
                                    type="text"
                                    name="zip"
                                    placeholder="1010"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="city">City *</label>
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    placeholder="Vienna"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid-row address-row">
                            <div className="input-group street-col">
                                <label htmlFor="street">Street *</label>
                                <input
                                    id="street"
                                    type="text"
                                    name="street"
                                    placeholder="Hauptstraße"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group number-col">
                                <label htmlFor="housenumber">House No. *</label>
                                <input
                                    id="housenumber"
                                    type="text"
                                    name="housenumber"
                                    placeholder="12A"
                                    value={formData.housenumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group unit-col">
                                <label htmlFor="unit">Unit / Door</label>
                                <input
                                    id="unit"
                                    type="text"
                                    name="unit"
                                    placeholder="Top 4"
                                    value={formData.unit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="button-container">
                        <DefaultButton
                            label={loading ? 'Creating Account...' : 'Complete Registration'}
                            type="submit"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-footer">
                        <span>Already have an account?</span>
                        <Link href={`/${locale}/login`} className="login-link">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
