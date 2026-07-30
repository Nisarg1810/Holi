import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helicopter Booking | Roman Aviation",
  description: "Book exclusive helicopter flights and private air charters. Secure your flight corridors for Kedarnath, Badrinath, and luxury tourist destinations.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
