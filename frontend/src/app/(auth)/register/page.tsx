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
import { clearAuthError, registerThunk } from "@/redux/slices/authSlice";
import { Spinner } from "@/components/ui/Feedback";

const schema = z
    .object({
        name: z.string().min(2, "Enter your full name"),
        email: z.string().email("Enter a valid email"),
        password: z.string().min(6, "Use at least 6 characters"),
        confirm: z.string(),
    })
    .refine((values) => values.password === values.confirm, {
        path: ["confirm"],
        message: "Passwords do not match",
    });

type FormValues = z.infer<typeof schema>;

function RegisterForm() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { user, status, error, hydrated } = useAppSelector((state) => state.auth);
    const [redirecting, setRedirecting] = useState(false);

    const next = searchParams.get("next") ?? "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", confirm: "" },
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
        void dispatch(registerThunk({ name: values.name, email: values.email, password: values.password }));
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
                        <h1 className="text-xl font-extrabold text-gray-900">
                            Create your account
                        </h1>
                        <p className="text-xs text-gray-500">
                            Verified listings, tracked orders, one-click checkout.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                        <label className="label" htmlFor="name">
                            Full name
                        </label>
                        <input
                            id="name"
                            autoComplete="name"
                            placeholder="Ada Lovelace"
                            className={`input ${errors.name ? "input-error" : ""}`}
                            {...register("name")}
                        />
                        {errors.name && <p className="field-error">{errors.name.message}</p>}
                    </div>

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
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            className={`input ${errors.password ? "input-error" : ""}`}
                            {...register("password")}
                        />
                        {errors.password && <p className="field-error">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="label" htmlFor="confirm">
                            Confirm password
                        </label>
                        <input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Repeat your password"
                            className={`input ${errors.confirm ? "input-error" : ""}`}
                            {...register("confirm")}
                        />
                        {errors.confirm && <p className="field-error">{errors.confirm.message}</p>}
                    </div>

                    {error && (
                        <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-100">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={busy} className="btn btn-primary btn-lg btn-block">
                        {busy ? <Spinner /> : "Create account"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        href={`/login?next=${encodeURIComponent(next)}`}
                        className="font-semibold text-brand hover:underline"
                    >
                        Sign in
                    </Link>
                </p>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <ShieldCheck size={12} /> Passwords are hashed with bcrypt before storage.
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="page-shell py-16"><div className="skeleton mx-auto h-96 max-w-md" /></div>}>
            <RegisterForm />
        </Suspense>
    );
}
