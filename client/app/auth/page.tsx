import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/UI/LoginForm";
import { SignInForm } from "@/UI/SignInForm";

type AuthTab = "signin" | "login";
type PageProps = {
  searchParams: Promise<{ tab?: string | string[] }>;
};

function getAuthTab(tab: string | string[] | undefined): AuthTab {
  return tab === "login" ? "login" : "signin";
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { tab } = await searchParams;

  const tabName = getAuthTab(tab) === "signin" ? "Sign In" : "Log In";

  return { title: tabName };
}

export default async function Page({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab = getAuthTab(tab);
  const isLogin = activeTab === "login";

  return (
    <main className="flex min-h-[calc(100svh-7rem)] flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-md flex-1 items-center px-5 py-8 sm:px-8 sm:py-10">
        <div className="w-full">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {isLogin ? "Welcome back" : "Get started"}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.07em] sm:text-5xl">
            {isLogin ? "Log in" : "Create account"}
          </h1>

          {isLogin ? <LoginForm /> : <SignInForm />}

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <Link
              className="font-semibold text-foreground underline underline-offset-4"
              href={isLogin ? "/auth?tab=signin" : "/auth?tab=login"}
            >
              {isLogin ? "Create one" : "Log in"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
