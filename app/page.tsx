import { LoginCard } from "@/components/login-card";
import { NatureBackdrop } from "@/components/nature-backdrop";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-10">
      <NatureBackdrop />
      <LoginCard />
    </main>
  );
}
