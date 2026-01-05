import { stateContext } from "@/context/StateProvider";
import { useContext } from "react";

export const useState = () => {
  const context = useContext(stateContext);
  if (!context)
    throw new Error("State provider must be wrapped around your app");
  return context;
};
