"use client"

import React, { useState } from "react";
import { DefaultButton } from "@components";

import "@styles/forms/register_form.scss";

const RegisterForm: React.FC = () => {
    
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        country: "",
        zip: "",
        city: "",
        street: "",
        housenumber: "",
        unit: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to register");

            alert("Registration successful!");

            // Reset form
            setFormData({
                username: "",
                firstname: "",
                lastname: "",
                birthdate: "",
                country: "",
                zip: "",
                city: "",
                street: "",
                housenumber: "",
                unit: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            window.location.href = "/profile";

        } catch (err: any) {
            alert(err.message || "Registration failed");
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="register-form">

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="column">

                    </div>
                    <div className="column">

                    </div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="firstname">Firstname:</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="Firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                    </div>
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="lastname">Lastname:</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="birthdate">Birthdate:</label>
                                <input
                                  type="date"
                                  name="birthdate"
                                  placeholder="Birthdate"
                                  value={formData.birthdate}
                                  onChange={handleChange}
                                  required
                                />
                        </div>
                    </div>
                    <div className="column"></div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="country">Country:</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="column"></div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="zip">ZIP:</label>
                                <input
                                    type="number"
                                    name="zip"
                                    placeholder="ZIP"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="street">Street:</label>
                            <input
                                type="text"
                                name="street"
                                placeholder="Street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                    <div className="column"></div>
                </div>

                <div className="form-group">
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="housenumber">Housenumber:</label>
                                <input
                                    type="text"
                                    name="housenumber"
                                    placeholder="Housenumber"
                                    value={formData.housenumber}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                    <div className="column">
                        <div className="input-container">
                            <label htmlFor="unit">Unit:</label>
                                <input
                                    type="text"
                                    name="unit"
                                    placeholder="Unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                    </div>
                </div>


                <div className="button-container">
                    <DefaultButton label="Register" type="submit"/>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;