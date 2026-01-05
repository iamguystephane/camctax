import { Metadata } from "next";
import Wizard from "@/components/Start/Wizard";

export const metadata: Metadata = {
  title: "Get Started | Cameroon Tax Assistant",
  description: "Take a few minutes of your time to complete our onboarding process.",
};

const StartPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <Wizard searchParams={searchParams} />;
};

export default StartPage;
