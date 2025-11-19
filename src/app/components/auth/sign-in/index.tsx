"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import SocialSignIn from "../social-button/SocialSignIn";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Logo from "../../layout/header/logo";

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  }); //login data state

  // form handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const toastId = toast.loading("Signing in...");

    try {
      // simulate network request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // simulate success
      localStorage.setItem("user", JSON.stringify({ user: loginData.username }));

      toast.success("Signed in successfully", { id: toastId });
      // small delay so toast is visible before navigation
      setTimeout(() => router.push("/"), 300);
    } catch (error) {
      toast.error("Sign in failed. Please check credentials and try again.", { id: toastId });
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

          <form onSubmit={handleSubmit}>
            <div className="mb-[22px]">
              <input
                required
                type="text"
                placeholder="Username"
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full rounded-md border placeholder:text-gray-400  border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-[22px]">
              <input
                required
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full rounded-md border border-border dark:border-dark_border border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition  focus:border-primary focus-visible:shadow-none dark:border-border_color dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-9">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary hover:bg-primary/80 dark:hover:!bg-darkprimary px-5 py-3 text-base text-white transition duration-300 ease-in-out disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;