"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { readRequiredField } from "./auth-utils";
import type { AuthActionState } from "./schema";

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password.", success: false };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");
  const confirmPassword = readRequiredField(formData, "confirmPassword");

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required.", success: false };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: "Unable to create account. Please try again.", success: false };
  }

  return { error: null, success: true };
}

export async function resetPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");

  if (!email) {
    return { error: "Email is required.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: "Unable to send reset email. Please try again.", success: false };
  }

  return { error: null, success: true };
}
