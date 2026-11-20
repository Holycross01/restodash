"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/api/auth/login", {
                email, password
            });
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-stone-100 text-stone-900 lg:grid lg:grid-cols-2">
            {/* Brand panel (hidden on small screens) */}
            <aside className="hidden flex-col justify-between bg-emerald-900 p-12 text-white lg:flex">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base font-bold text-emerald-900">
                        R
                    </div>
                    <span className="text-lg font-semibold tracking-tight">RestoDash</span>
                </div>

                <div>
                    <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
                        Keep your menu fresh, from one place.
                    </h2>
                    <p className="mt-4 max-w-sm text-emerald-100/80">
                        Add new dishes, update prices and take items off the menu in seconds.
                    </p>
                </div>

                <p className="text-sm text-emerald-100/60">Restaurant staff access only.</p>
            </aside>

            {/* Form panel */}
            <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:min-h-0">
                <div className="w-full max-w-sm">
                    {/* Small-screen brand */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-sm font-bold text-white">
                            R
                        </div>
                        <span className="text-base font-semibold tracking-tight">RestoDash</span>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-stone-500">
                        Log in to manage your restaurant menu.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <label className="block text-sm font-medium text-stone-700">
                            Email
                            <input
                                type="email"
                                placeholder="you@restaurant.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-stone-700">
                            Password
                            <div className="relative mt-1.5">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 pr-10 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}