import { PageHeading } from "@/components/page-heading";
import { ReservationCalendar } from "@/components/reservation-calendar";

export default function CalendarPage() {
  return (
    <>
      <PageHeading title="Calendar" subtitle="Confirmed football reservations and weekly booking timeline." />
      <ReservationCalendar />
    </>
  );
}
