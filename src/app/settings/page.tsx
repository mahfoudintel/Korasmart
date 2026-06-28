import { PageHeading } from "@/components/page-heading";
import { AccessSettings } from "@/components/access-settings";
import { Card, SectionTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeading title="Settings" subtitle="Group preferences, rating rules, Supabase connection, and notification controls." />
      <div className="mb-5">
        <AccessSettings />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {["Rating categories", "Team generator weights", "Supabase backend", "Notifications"].map((setting) => (
          <Card key={setting}>
            <SectionTitle>{setting}</SectionTitle>
            <p className="mt-4 text-white/65">Configured for the weekly KORASMART flow and ready to connect to real data.</p>
          </Card>
        ))}
      </div>
    </>
  );
}
