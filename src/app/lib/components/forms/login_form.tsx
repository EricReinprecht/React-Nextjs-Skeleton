"use client"

import { useState } from "react";
import React from 'react';
import { auth } from "@firebase/firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import DefautButton from "../default/default_button";
import "@styles/forms/login_form.scss"

const LoginForm: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | "">("");
    const [password, setPassword] = useState<string | "">("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            location.reload();
        } catch (error) {
            const authError = error as AuthError;
            setError(authError.message);
            handleError();
        }
    };

    const handleError = () => {
        alert(error);
    }

    return (
        <div className="login-form-container">
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



