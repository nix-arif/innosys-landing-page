"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next, disabled }: { next: string; disabled: boolean }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="text-sm font-medium text-deep-blue">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={disabled}
          autoFocus
          className="mt-1 w-full rounded-lg border border-deep-blue/20 px-3 py-2 text-sm outline-none focus:border-sky-blue disabled:bg-black/5"
        />
      </div>
      {state.error && <p className="text-sm text-coral">{state.error}</p>}
      <button
        type="submit"
        disabled={disabled || pending}
        className="rounded-full bg-deep-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deep-blue/90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
