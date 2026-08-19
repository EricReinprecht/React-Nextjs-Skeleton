'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { DefaultButton } from '@frontend/components';
import '@styles/forms/login_form.scss';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'de';

    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Redirect with locale prefix so router doesn't cause a 404
            router.push(`/${locale}/profile`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="form-card">
                <div className="form-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-banner">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label htmlFor="password">Password</label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="button-container">
                        <DefaultButton
                            label={loading ? 'Logging in...' : 'Sign In'}
                            type="submit"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-footer">
                        <span>Don't have an account?</span>
                        <Link href={`/${locale}/register`} className="register-link">
                            Create an Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
