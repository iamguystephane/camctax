export const STEPS = [
  {
    id: "contact",
    title: "Contact",
    validationFields: ["firstName", "lastName", "email", "phone"],
  },
  { id: "intent", title: "Goal", validationFields: ["intentPrimary"] },
  { id: "business", title: "Business", validationFields: ["businessType"] },
  { id: "sector", title: "Sector", validationFields: ["sector", "sectorOther"] },
  {
    id: "location",
    title: "Location",
    validationFields: ["locationRegion", "locationCity"],
  },
  { id: "success", title: "Done" },
];
