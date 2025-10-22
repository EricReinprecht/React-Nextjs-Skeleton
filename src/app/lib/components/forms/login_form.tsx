"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DefautButton from "../default/default_button";
import "@styles/forms/login_form.scss";


const LoginForm: React.FC = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | "">("");
    const [password, setPassword] = useState<string | "">("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
          
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
          
            const data = await res.json();
          
            if (!res.ok) throw new Error(data.message || "Login failed");
          
            // Save session token from backend (JWT or session id)
            Cookies.set("authToken", data.token, { expires: 1 }); // expires in 1 day
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="button-container">
                    <DefautButton label="login" type="submit"/>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;



