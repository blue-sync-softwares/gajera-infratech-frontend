
import SignUp from "@/app/components/auth/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign Up | Gajera Group",
};

const SignupPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default SignupPage;
