import { requireUser } from "@/lib/auth";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

/**
 * Landing page after a password-recovery link is verified in
 * /auth/confirm. Requires an active session — there is no other way to
 * reach this page than through that redirect or while already signed in.
 */
export default async function UpdatePasswordPage() {
  await requireUser();

  return <UpdatePasswordForm />;
}
