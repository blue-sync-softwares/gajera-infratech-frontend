"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import SocialSignIn from "../social-button/SocialSignIn";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Logo from "../../layout/header/logo";
import { apiPost } from "@/utils/api";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  }); //login data state
  const [error, setError] = useState<string | null>(null);

  // form handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const toastId = toast.loading("Signing in...");

    try {
      const response = await apiPost('/api/v1/auth/login', {
        userId: loginData.userId,
        password: loginData.password,
      });

      if (response.success && response.data && response.data.data) {
        const { user, token } = response.data.data;
        
        // Token will be stored in cookies by backend
        // Store user data in localStorage for quick access
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(response.data.message || "Signed in successfully", { id: toastId });
        
        // Small delay so toast is visible before navigation
        setTimeout(() => router.push("/admin"), 300);
      } else {
        const errorMsg = response.error || response.data?.message || "Sign in failed. Please check your credentials.";
        setError(errorMsg);
        toast.error(errorMsg, { id: toastId });
      }
    } catch (error) {
      const errorMsg = "Unable to connect to the server. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-32 bg-light dark:bg-darkmode">
      {/* Toaster - keeps global position for this component */}
      <Toaster position="top-right" />

      <div className="pt-9 flex justify-center items-center text-center ">
        <div className="max-w-lg w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
          <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
            <Logo />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-[22px]">
              <input
                required
                type="text"
                placeholder="User ID"
                value={loginData.userId}
                onChange={(e) => setLoginData({ ...loginData, userId: e.target.value })}
                className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-[22px]">
              <input
                required
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-9">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/80 dark:hover:!bg-darkprimary px-5 py-3 text-base text-white transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;