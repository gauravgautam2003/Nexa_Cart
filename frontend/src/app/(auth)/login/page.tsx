"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthError, loginThunk } from "@/redux/slices/authSlice";
import { Spinner } from "@/components/ui/Feedback";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { user, status, error, hydrated } = useAppSelector((state) => state.auth);
    const [redirecting, setRedirecting] = useState(false);

    const nextParam = searchParams.get("next");
    // Admins who arrive at the plain sign-in page go straight to the console.
    const next = nextParam ?? (user?.role === "admin" ? "/admin" : "/");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (user && hydrated) {
            setRedirecting(true);
            router.replace(next);
        }
    }, [user, hydrated, router, next]);

    const onSubmit = (values: FormValues) => {
        void dispatch(loginThunk(values));
    };

    const busy = status === "loading" || redirecting;

    return (
        <div className="page-shell flex min-h-[70vh] items-center justify-center py-10">
            <div className="card w-full max-w-md p-6 sm:p-8">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                        <Sparkles size={17} />
                    </span>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Welcome back</h1>
                        <p className="text-xs text-gray-500">
                            Sign in to your NexaCart account
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                        <label className="label" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={`input ${errors.email ? "input-error" : ""}`}
                            {...register("email")}
                        />
                        {errors.email && <p className="field-error">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`input ${errors.password ? "input-error" : ""}`}
                            {...register("password")}
                        />
                        {errors.password && <p className="field-error">{errors.password.message}</p>}
                    </div>

                    {error && (
                        <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-100">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={busy} className="btn btn-primary btn-lg btn-block">
                        {busy ? <Spinner /> : "Sign in"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                    New to NexaCart?{" "}
                    <Link
                        href={
                            nextParam
                                ? `/register?next=${encodeURIComponent(nextParam)}`
                                : "/register"
                        }
                        className="font-semibold text-brand hover:underline"
                    >
                        Create an account
                    </Link>
                </p>

                <p className="mt-3 text-center text-[11px] text-gray-500">
                    Admin?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-brand hover:underline"
                    >
                        Create an admin account
                    </Link>{" "}
                    or sign in with your admin credentials.
                </p>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <ShieldCheck size={12} /> Sessions use httpOnly cookies — no tokens in
                    localStorage.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="page-shell py-16"><div className="skeleton mx-auto h-96 max-w-md" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
