"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, LogIn, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/API";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import logo from '../../public/images/logo.png';
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success)
        return toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });

      const user = data?.data?.user;

      // Update auth context with logged in user
      setUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        coverage: user.coverage || [],
      });

      toast({
        variant: "success",
        title: "Success",
        description: data.message,
      });

      // If user must change password, redirect to change-password page
      if (user?.mustChangePassword) {
        router.push("/auth/change-password");
        return;
      }

      // Redirect based on role
      if (user.role === "consultant") {
        router.push("/consultant/dashboard");
      } else if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to login due to internal server error. Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 " />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <Image src={logo} alt="Tax Assistant" className="h-8 w-8" />
            </div>
            Consultant Portal
          </h1>
          <p className="text-gray-600 mt-2"></p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  placeholder="consultant@example.com"
                  required
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  Forgot password?
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            {/* Support Link */}
            <div className="flex justify-between items-center">
            <Link
              href="/auth/support"
              className="block text-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact system administrator
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to Home <ChevronRight className="w-4 h-4 inline" />
            </Link>
            </div>
          </form>
          {/* <div className="flex justify-center pt-1.5">
            <Link
            href="/admin/dashboard"
            className="block text-center text-2xl text-primary hover:text-blue">
              Admin Dasboard Straight<ChevronRight className="w-4 h-4 inline"/>
            </Link>
          </div> */}
        </motion.div>
      </motion.div>

      {/* Add custom animation styles */}
    </div>
  );
}
