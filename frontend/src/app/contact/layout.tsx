import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Premium Flight Concierge | Roman Aviation & Tourism",
  description: "Get in touch with Roman Aviation's support team. Call or email our flight coordinator desk for emergency evacuations, Premium charters, or package bookings.",
  keywords: "contact Roman aviation, helicopter booking number, flight support desk, airport lounge access help",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
