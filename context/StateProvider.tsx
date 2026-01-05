"use client";

import { useState, createContext, ReactNode, useEffect } from "react";

interface Goal {
  value: string;
  title: string;
  description: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  email: string;
  lang: string;
}

interface Location {
  region: string;
  city: string;
  neighborhood?: string;
}

export interface OnboardingProps {
  goal: Goal;
  businessStructure: string;
  sector: string;
  location: Location;
  contact: Contact;
  leadSource?: {
    sourceDetail: string;
    intentPrimary?: "merchant_account" | "tax_records" | "registration_fix";
  };
}

interface StateContextProps {
  onboardingData: OnboardingProps;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingProps>>;
}

const STORAGE_KEY = "onboardingData";

const initialState: OnboardingProps = {
  goal: {
    value: "",
    title: "",
    description: "",
  },
  businessStructure: "",
  sector: "",
  location: {
    region: "",
    city: "",
    neighborhood: "",
  },
  contact: {
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+237",
    email: "",
    lang: "",
  },
  leadSource: {
    sourceDetail: "",
    intentPrimary: "merchant_account",
  },
};

export const stateContext = createContext<StateContextProps | undefined>(
  undefined
);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingProps>(() => {
    if (typeof window === "undefined") return initialState;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
  }, [onboardingData]);

  return (
    <stateContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </stateContext.Provider>
  );
};
