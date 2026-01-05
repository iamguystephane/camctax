import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { WizardFormInput } from "./Wizard.schema";
import { useState } from "@/hooks/useState";
import { useEffect } from "react";

export default function StepContact({
  form,
}: {
  form: UseFormReturn<WizardFormInput>;
}) {
  const { register, setValue, watch, formState } = form;
  const { setOnboardingData, onboardingData } = useState();

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const phone = watch("phone");
  const countryCode = watch("countryCode");
  const email = watch("email");
  const languagePref = watch("languagePref");

  const countries = [
    { code: "+237", name: "Cameroon", maxLength: 9 },
    { code: "+1", name: "USA/Canada", maxLength: 10 },
    { code: "+44", name: "UK", maxLength: 10 },
    { code: "+33", name: "France", maxLength: 9 },
    { code: "+49", name: "Germany", maxLength: 10 },
    { code: "+34", name: "Spain", maxLength: 9 },
    { code: "+39", name: "Italy", maxLength: 10 },
    { code: "+31", name: "Netherlands", maxLength: 9 },
    { code: "+41", name: "Switzerland", maxLength: 9 },
    { code: "+43", name: "Austria", maxLength: 10 },
  ];

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  // Pre-select from onboarding data on mount (only once)
  useEffect(() => {
    const contact = onboardingData.contact;

    if (contact.firstName) {
      setValue("firstName", contact.firstName, {
        shouldValidate: false,
      });
    }

    if (contact.lastName) {
      setValue("lastName", contact.lastName, {
        shouldValidate: false,
      });
    }

    if (contact.phone) {
      setValue("phone", contact.phone, {
        shouldValidate: false,
      });
    }

    if (contact.countryCode) {
      setValue("countryCode", contact.countryCode, {
        shouldValidate: false,
      });
    }

    if (contact.email) {
      setValue("email", contact.email, {
        shouldValidate: false,
      });
    }

    if (contact.lang) {
      setValue("languagePref", contact.lang as "en" | "fr", {
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist changes to onboarding data (debounced to avoid interference with typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOnboardingData((prev) => ({
        ...prev,
        contact: {
          firstName: firstName || "",
          lastName: lastName || "",
          phone: phone || "",
          countryCode: countryCode || "+237",
          email: email || "",
          lang: languagePref || "en",
        },
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [firstName, lastName, phone, countryCode, email, languagePref, setOnboardingData]);

  const handleCountryCodeChange = (value: string) => {
    setValue("countryCode", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= selectedCountry.maxLength) {
      setValue("phone", value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleLanguageChange = (value: "en" | "fr") => {
    setValue("languagePref", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          How can we reach you?
        </h1>
        <p className="text-slate-500">A consultant will contact you shortly.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>First Name/Nom</Label>
          <Input className="py-7 mt-2" {...register("firstName")} />
          {formState.errors.firstName && (
            <p className="text-destructive text-xs">Required</p>
          )}
        </div>

        <div>
          <Label>Last Name/Prenom</Label>
          <Input className="py-7 mt-2" {...register("lastName")} />
          {formState.errors.lastName && (
            <p className="text-destructive text-xs">Required</p>
          )}
        </div>

        <div>
          <Label>Tel / WhatsApp</Label>
          <div className="flex gap-2 mt-2">
            <Select value={countryCode} onValueChange={handleCountryCodeChange}>
              <SelectTrigger className="bg-white w-32 py-7">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country: { code: string; name: string; maxLength: number }) => (
                  <SelectItem value={country.code} key={country.code}>
                    {country.code} ({country.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={phone}
              onChange={handlePhoneChange}
              placeholder={`Enter ${selectedCountry.maxLength} digits`}
              className="py-7 flex-1"
              type="tel"
              maxLength={selectedCountry.maxLength}
            />
          </div>
          {formState.errors.phone && (
            <p className="text-destructive text-xs">Required</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {selectedCountry.maxLength} digits max for {selectedCountry.name}
          </p>
        </div>

        <div>
          <Label>Email</Label>
          <Input className="py-7 mt-2" {...register("email")} type="email" />
          {formState.errors.email && (
            <p className="text-destructive text-xs">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-4">Preferred Language</Label>
          <RadioGroup
            value={languagePref}
            onValueChange={(val) => handleLanguageChange(val as "en" | "fr")}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="fr" id="fr" />
              <Label htmlFor="fr">Français</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
