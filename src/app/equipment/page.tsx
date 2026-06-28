import { PageHeading } from "@/components/page-heading";
import { Card } from "@/components/ui/card";

export default function EquipmentPage() {
  return (
    <>
      <PageHeading title="Equipment" subtitle="Track balls, bibs, water, accessories, and match-day essentials." />
      <div className="grid gap-5 md:grid-cols-3">
        {["Match balls", "Training bibs", "Water pack", "First-aid kit", "Cones", "Pump"].map((item, index) => (
          <Card key={item}>
            <p className="text-sm font-black uppercase text-white/60">Item</p>
            <h2 className="mt-3 text-2xl font-black">{item}</h2>
            <p className="mt-5 text-lime-300">{index % 3 === 0 ? "Needs review" : "Ready"}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
