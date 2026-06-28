import { ExternalLink } from "lucide-react";
import { getReservationMapUrl, type Reservation } from "@/lib/reservations";
import { cn } from "@/lib/utils";

type ReservationMapLinkProps = {
  reservation: Pick<Reservation, "venue" | "field">;
  className?: string;
  compact?: boolean;
};

export function ReservationMapLink({ reservation, className, compact = false }: ReservationMapLinkProps) {
  return (
    <a
      href={getReservationMapUrl(reservation)}
      target="_blank"
      rel="noreferrer"
      className={cn("inline-flex items-center gap-1.5 text-lime-200 underline-offset-4 hover:text-lime-300 hover:underline", className)}
      title="Open field location in maps"
    >
      <span>{compact ? reservation.field : `${reservation.venue} / ${reservation.field}`}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}
