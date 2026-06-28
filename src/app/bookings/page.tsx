import { PageHeading } from "@/components/page-heading";
import { ReservationAdmin } from "@/components/reservation-admin";

export default function BookingsPage() {
  return (
    <>
      <PageHeading title="Scheduling" subtitle="Reservations, calendar updates, and match attendance planning in one place." />
      <ReservationAdmin />
    </>
  );
}
