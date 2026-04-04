/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { jwtDecode } from "jwt-decode";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie"; // npm i js-cookie
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      const decoded: any = jwtDecode(result.data.accessToken);
      const userRole = decoded.role;

      // Set token in cookie (expires in 7 days)
      Cookies.set("access_token", result.data.accessToken, {
        expires: 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      Cookies.set("role", userRole, {
        expires: 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.log("error occurred");
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill demo credentials
  const handleQuickLogin = (role: "admin" | "manager") => {
    if (role === "admin") {
      setValue("email", "admin@example.com");
      setValue("password", "admin123");
    } else if (role === "manager") {
      setValue("email", "manager@example.com");
      setValue("password", "manager123");
    }
    handleSubmit(onSubmit)(); // auto-submit
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Login
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Please enter your details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700 ml-1"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-PrimaryColor transition-colors" />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                id="email"
                autoComplete="email"
                placeholder="ariful@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-PrimaryColor/10 focus:border-PrimaryColor placeholder:text-slate-400 text-slate-900"
              />
            </div>
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors?.email?.message as string}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700 ml-1"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-PrimaryColor transition-colors" />
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-PrimaryColor/10 focus:border-PrimaryColor placeholder:text-slate-400 text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors?.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors?.password?.message as string}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-PrimaryColor text-white font-semibold py-3 rounded-xl shadow-lg shadow-PrimaryColor/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Quick Login Buttons */}
          <div className="flex gap-4 mt-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
            >
              Login as Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("manager")}
              className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
            >
              Login as Manager
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} Developed by{" "}
            <a href="#">Md. Ariful Islam</a>
          </p>
        </form>
      </div>
    </div>
  );
}
