import { PageHeading } from "@/components/page-heading";
import { AdminFinancePanel } from "@/components/admin-finance-panel";

export default function FinancesPage() {
  return (
    <>
      <PageHeading title="Finances" subtitle="Situation de la caisse, cotisations recues, reservation terrain, and admin updates." />
      <AdminFinancePanel />
    </>
  );
}
