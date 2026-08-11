"use client";

import { ArrowUpRight } from "lucide-react";
import { useActionState } from "react";
import { logInAction, type AuthActionState } from "../app/auth/actions";
import { AuthField } from "./AuthInput";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, isSubmitting] = useActionState(
    logInAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 grid gap-5" noValidate>
      <AuthField
        autoComplete="email"
        error={state.fieldErrors?.email}
        id="email"
        label="Email address"
        placeholder="alex@example.com"
        type="email"
      />
      <AuthField
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        id="password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />
      <button
        className="mt-1 flex h-12 items-center justify-center gap-2 bg-primary px-4 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Logging in" : "Log in"}{" "}
        <ArrowUpRight aria-hidden="true" size={16} />
      </button>
      {state.formError ? (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      ) : null}
      {state.successMessage ? (
        <p className="text-sm text-emerald-700" role="status">
          {state.successMessage}
        </p>
      ) : null}
    </form>
  );
}
