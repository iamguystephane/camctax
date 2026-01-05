import Login from "./login";
import ForgotPass from "./forgotpass/forgotpass";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Cameroon Tax Consultant",
  description: "Enter your credentials to access our platform either as an accountant or as an admin"
}
export default function AuthPage() {
  return   <Login />
}
