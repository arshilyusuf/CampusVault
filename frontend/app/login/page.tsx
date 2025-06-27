"use client";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { UserIcon } from "@/components/ui/user";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(()=>{
    if(isAuthenticated){
      router.push("/")
    }
  })

  useEffect(() => {
    setIsFormFilled(email !== "" && password !== "");
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);

      if (success) {
        toast.success("Login successful!");
        router.push("/vault"); // Redirect on success
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-[var(--black)]/30 dark:bg-black/30 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md flex flex-col gap-6 [40px] backdrop-blur-3xl">
        <div className="text-3xl flex flex-col items-center font-bold text-center text-[var(--color-4)] gap-6">
          <UserIcon
            size={50}
          />
          <p>Login</p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[var(--color-4)] dark:text-[var(--color-4)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-2)] bg-[var(--white)]/10 text-[var(--white)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--color-4)] dark:text-[var(--color-4)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-2)] bg-[var(--white)]/10 text-[var(--white)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
          <Button type="submit" buttonClassName="w-full" disabled={!isFormFilled || isLoading}>
            {!isLoading ? 'Sign In' : 'Signing In...'}
          </Button>
        
        <p className="text-sm text-[var(--color-4)] dark:text-[var(--color-4)] text-center">
          Don&apos;t have an account? <a href="/signup" className="text-[var(--color-2)] hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
}
