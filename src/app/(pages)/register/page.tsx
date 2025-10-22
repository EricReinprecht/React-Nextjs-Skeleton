"use client"; 

import BasePage from "@templates/base_page";
import { useState } from "react";

export default function Register(props) {
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

        // Example API call to your backend
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to register");

            alert("Registration successful!");
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
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="main">
            <BasePage>
                <div className="registerform">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                          value={formData.lastname}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="date"
                          name="birthdate"
                          placeholder="Geburtsdatum"
                          value={formData.birthdate}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Land"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="number"
                          name="zip"
                          placeholder="ZIP"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="number"
                          name="unit"
                          placeholder="unit"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="street"
                          placeholder="Street"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          name="housenumber"
                          placeholder="Housenumber"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="border p-2 rounded"
                        />
                        <button
                          type="submit"
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                          Register
                        </button>
                    </form>
                </div>    
            </BasePage>
        </div>
    );
}