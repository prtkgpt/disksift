import { signIn } from "@/auth";

async function handleGitHubSignIn() {
  "use server";
  await signIn("github", { redirectTo: "/" });
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="container flex min-h-screen flex-col items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Calendiq Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in to continue</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use your GitHub account to manage availability, payments, and client
            bookings.
          </p>
          <form action={handleGitHubSignIn} className="mt-8">
            <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900">
              Continue with GitHub
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
