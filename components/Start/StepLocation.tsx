import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type RegionType =
  | "adamawa"
  | "centre"
  | "east"
  | "far_north"
  | "littoral"
  | "north"
  | "northwest"
  | "south"
  | "southwest"
  | "west";

export default function StepLocation({
  form,
}: {
  form: UseFormReturn<WizardFormInput>;
}) {
  const { register, setValue, watch, formState } = form;
  const { setOnboardingData, onboardingData } = useState();

  const locationRegion = watch("locationRegion");
  const locationCity = watch("locationCity");

  const regions = [
    { region: "Adamawa", value: "adamawa" },
    { region: "Centre", value: "centre" },
    { region: "East", value: "east" },
    { region: "Far North", value: "far_north" },
    { region: "Littoral", value: "littoral" },
    { region: "North", value: "north" },
    { region: "NorthWest", value: "northwest" },
    { region: "South", value: "south" },
    { region: "Southwest", value: "southwest" },
    { region: "West", value: "west" },
  ];

  // Map regions to their major cities
  const regionCitiesMap: Record<RegionType, string[]> = {
    adamawa: ["Ngaoundéré", "Tibati", "Meiganga", "Banyo", "Dir"],
    centre: ["Yaoundé", "Bafia", "Mbalmayo", "Edea", "Obala", "Mfou"],
    east: ["Bertoua", "Batouri", "Abong-Mbang", "Doumé", "Yokadouma"],
    far_north: ["Maroua", "Kousséri", "Mokolo", "Yagoua", "Mora"],
    littoral: ["Douala", "Edea", "Kribi", "Nkongsamba", "Manjo"],
    north: ["Garoua", "Guider", "Tcholliré", "Poli", "Lagdo"],
    northwest: ["Bamenda", "Kumbo", "Nkambe", "Mbengwi", "Wum"],
    south: ["Ebolowa", "Kribi", "Sangmélima", "Mvangué", "Akonolinga"],
    southwest: ["Buea", "Limbe", "Tiko", "Muyuka", "Kumba"],
    west: ["Bafoussam", "Dschang", "Mbouda", "Foumban", "Koutaba"],
  };

  // Pre-select from onboarding data on mount (only once)
  useEffect(() => {
    const { region, city } = onboardingData.location;

    if (region) {
      setValue("locationRegion", region as RegionType, {
        shouldValidate: false,
      });
    }

    if (city) {
      setValue("locationCity", city, {
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
        location: {
          region: locationRegion || "",
          city: locationCity || "",
        },
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [locationRegion, locationCity, setOnboardingData]);

  const handleRegionChange = (value: RegionType) => {
    setValue("locationRegion", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Reset city when region changes
    setValue("locationCity", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">
          Where are you located?
        </h1>
        <p className="text-slate-500">
          Currently serving business only in these cities and surrounding areas.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Select the region that is closest to you.</Label>
          <Select value={locationRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="bg-white w-full py-7 mt-2">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((reg) => (
                <SelectItem value={reg.value} key={reg.value}>
                  {reg.region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formState.errors.locationRegion && (
            <p className="text-destructive text-xs">Required</p>
          )}
        </div>

        {locationRegion && (
          <div>
            <Label>Select your city</Label>
            <Select value={locationCity} onValueChange={(value: string) => {
              setValue("locationCity", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}>
              <SelectTrigger className="bg-white w-full py-7 mt-2">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {regionCitiesMap[locationRegion]?.map((city: string) => (
                  <SelectItem value={city} key={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.locationCity && (
              <p className="text-destructive text-xs">Required</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
