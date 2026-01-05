import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { WizardFormInput } from "./Wizard.schema";
import { useState as useStates } from "@/hooks/useState";
import { useState } from "react";
import {
  User,
  Building2,
  Building,
  Handshake,
  Link,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { API_URL } from "@/API";
import { useToast } from "@/hooks/useToast";
import Loading from "../Loading";

type Props = {
  form: UseFormReturn<WizardFormInput>;
  onBack: () => void;
};

const BUSINESS_TYPE_LABELS = {
  ets: "Ets (Sole Proprietorship)",
  sarl: "SARL (LLC)",
  sa: "SA (Corporation)",
  ngo: "Association / NGO",
  gie: "GIE",
  none: "Not Registered Yet",
};

const BUSINESS_TYPE_LABELS_FR = {
  ets: "Ets (Entreprise individuelle)",
  sarl: "SARL",
  sa: "SA (Société Anonyme)",
  ngo: "Association / ONG",
  gie: "GIE",
  none: "Pas encore enregistré",
};

const INTENT_LABELS = {
  registration_fix: "Business Registration",
  tax_records: "Tax Declarations",
  merchant_account: "Merchant Account",
  guidance: "General Guidance",
};

const INTENT_LABELS_FR = {
  registration_fix: "Enregistrement d'entreprise",
  tax_records: "Déclarations fiscales",
  merchant_account: "Compte marchand",
  guidance: "Conseils généraux",
};

const BUSINESS_TYPE_ICONS = {
  ets: User,
  sarl: Building2,
  sa: Building,
  ngo: Handshake,
  gie: Link,
  none: HelpCircle,
};

const REGION_LABELS = {
  adamawa: "Adamawa",
  centre: "Centre",
  east: "East",
  far_north: "Far North",
  littoral: "Littoral",
  north: "North",
  northwest: "Northwest",
  south: "South",
  southwest: "Southwest",
  west: "West",
};

export default function WizardSummary({ form, onBack }: Props) {
  const { onboardingData, setOnboardingData } = useStates();
  const formData = form.getValues();
  const BusinessIcon = BUSINESS_TYPE_ICONS[formData.businessType];
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/leads/store-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: onboardingData.goal,
          businessStructure: onboardingData.businessStructure,
          sector: onboardingData.sector,
          location: onboardingData.location,
          contact: onboardingData.contact,
          status: "In Progress",
          leadSource: onboardingData.leadSource,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Progress stored successfully. Opening Whatsapp...",
          description: data.message,
          variant: "success",
        });

        // Use assigned consultant phone from server response when available
        const assignedConsultant = data.data?.consultantId || null;

        const isEnglish = formData.languagePref === "en";
        const name = `${formData.lastName} ${formData.firstName}`;
        const intent = isEnglish
          ? INTENT_LABELS[formData.intentPrimary]
          : INTENT_LABELS_FR[formData.intentPrimary];
        const businessType = isEnglish
          ? BUSINESS_TYPE_LABELS[formData.businessType]
          : BUSINESS_TYPE_LABELS_FR[formData.businessType];
        const sector = onboardingData.sector;
        const city = formData.locationCity;
        const region = REGION_LABELS[formData.locationRegion as keyof typeof REGION_LABELS] || "Unknown Region";

        let message = "";

        if (isEnglish) {
          message = `Hello. My name is ${name}.
I need help with: ${intent}.
Business type: ${businessType}.
Sector: ${sector}.
Location: ${city}, ${region}.`;
        } else {
          message = `Bonjour. Je m'appelle ${name}.
J'ai besoin d'aide pour : ${intent}.
Type d'activité: ${businessType}.
Secteur: ${sector}.
Localisation: ${city}, ${region}.`;
        }

        const encodedMessage = encodeURIComponent(message);

        // Determine which phone to open WhatsApp with: assigned consultant -> consultant phone, else fallback
        const formatPhoneForWhatsApp = (phone?: string) => {
          if (!phone) return null;
          const digits = phone.replace(/\D/g, "");
          // If the phone already includes country code (starts with 237), use as-is
          if (digits.startsWith("237")) return digits;
          // If 9 digits, assume Cameroon and prepend 237
          if (digits.length === 9) return `237${digits}`;
          return digits || null;
        };

        const consultantPhone = formatPhoneForWhatsApp(
          assignedConsultant?.phone || assignedConsultant?.contact || null
        );

        const targetNumber = consultantPhone || "237699528055"; // backup number

        setTimeout(() => {
          window.open(
            `https://wa.me/${targetNumber}?text=${encodedMessage}`,
            "_blank"
          );
        }, 2500);
      } else {
        toast({
          title: "Failed to save your data",
          description: data.message,
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.log("error saving lead: ", error);
      toast({
        title: "Error",
        description: "Couldn't save your progress due to internal server error",
        variant: "destructive",
      });
      return;
    } finally {
      setLoading(false);
    }

    setOnboardingData({
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
        countryCode: "",
        email: "",
        lang: "",
      },
      leadSource: {
        sourceDetail: "",
        intentPrimary: "merchant_account",
      },
    });

    localStorage.removeItem("onboardingData");
    setTimeout(() => {
      window.location.href = "/";
    }, 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold mb-2">
          Review Your Information
        </h1>
        <p className="text-slate-500">
          Please review your details before submitting your request.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Goal */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-slate-700">
            Your Goal
          </h3>
          <div className="space-y-1">
            <p className="font-medium">{onboardingData.goal.title}</p>
            <p className="text-sm text-slate-500">
              {onboardingData.goal.description}
            </p>
          </div>
        </div>

        {/* Business Structure */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-slate-700">
            Business Structure
          </h3>
          <div className="flex items-center gap-3">
            <BusinessIcon className="w-6 h-6 text-primary" />
            <p className="font-medium">
              {BUSINESS_TYPE_LABELS[formData.businessType]}
            </p>
          </div>
        </div>

        {/* Sector */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-slate-700">
            Industry Sector
          </h3>
          <p className="font-medium">{onboardingData.sector}</p>
        </div>

        {/* Location */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-slate-700">
            Location
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Region</p>
                <p className="font-medium">
                  {REGION_LABELS[formData.locationRegion]}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">City</p>
                <p className="font-medium">{formData.locationCity}</p>
              </div>
            </div>
            {formData.locationNeighborhood && (
              <div>
                <p className="text-sm text-slate-500">Neighborhood</p>
                <p className="font-medium">{formData.locationNeighborhood}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3 text-slate-700">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="font-medium">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Phone / WhatsApp</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium line-clamp-1">{formData.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Preferred Language</p>
              <p className="font-medium">
                {formData.languagePref === "en" ? "English" : "Français"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 sm:flex-none py-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Go Back & Edit
        </Button>
        <Button
          onClick={handleCompleteOnboarding}
          className="flex-1 py-6 bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <CheckCircle className="mr-2 w-4 h-4" />
              <span>Complete request</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
