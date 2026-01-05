import { z } from "zod";


export const wizardSchema = z
  .object({
    status: z.literal("new").default("new"),
    languagePref: z.enum(["en", "fr"]).default("en"),


    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6, "Phone number is too short"),
    countryCode: z.string().default("+237"),

    companyName: z.string().optional(),
    businessType: z.enum(["ets", "sarl", "sa", "ngo", "gie", "none"]),

    intentPrimary: z.enum([
      "registration_fix",
      "tax_records",
      "merchant_account",
      "guidance",
    ]),

    sector: z.string().min(1, "Sector is required"),
    sectorOther: z.string().default(""),

    locationRegion: z.enum([
      "adamawa",
      "centre",
      "east",
      "far_north",
      "littoral",
      "north",
      "northwest",
      "south",
      "southwest",
      "west",
    ]),
    locationCity: z.string().min(1, "City is required"),
    locationNeighborhood: z.string().optional(),

    message: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.sector === "other") {
        return (
          typeof data.sectorOther === "string" &&
          data.sectorOther.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please specify your sector",
      path: ["sectorOther"],
    }
  );

export type WizardFormInput = z.input<typeof wizardSchema>;
export type WizardFormData = z.infer<typeof wizardSchema>;
