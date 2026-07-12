"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { readRequiredField, resolveOrigin } from "./auth-utils";
import { createNotification } from "@netlium/lib";
import { recordSecurityEvent } from "@/lib/security/events";
import { recordTrustedDevice } from "@/lib/security/deviceCookie";
import type { AuthActionState } from "./schema";

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
      success: false,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: "Invalid email or password.",
      success: false,
    };
  }

  await recordSecurityEvent(supabase, data.user.id, "login");
  await recordTrustedDevice(supabase, data.user.id);

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
    return {
      error: "All fields are required.",
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
      success: false,
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
      success: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await resolveOrigin();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  // An account already existing for this email must not be distinguishable
  // from a fresh signup — otherwise the response becomes an account-
  // enumeration oracle. Both paths return the same "check your email" state.
  if (error && !/already registered/i.test(error.message)) {
    return {
      error: "Unable to create your account. Please try again.",
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}

export async function resetPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");

  if (!email) {
    return {
      error: "Email is required.",
      success: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await resolveOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm`,
  });

  if (error) {
    return {
      error: "Unable to send reset email. Please try again.",
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = readRequiredField(formData, "password");
  const confirmPassword = readRequiredField(formData, "confirmPassword");

  if (!password || !confirmPassword) {
    return {
      error: "All fields are required.",
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
      success: false,
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
      success: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error || !data.user) {
    return {
      error: "Unable to update your password. Please try again.",
      success: false,
    };
  }

  await recordSecurityEvent(supabase, data.user.id, "password_updated");
  await createNotification(
    supabase,
    data.user.id,
    "security",
    "Password changed",
    "Your account password was updated."
  );

  redirect("/dashboard");
}
