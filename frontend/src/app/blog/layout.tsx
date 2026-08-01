import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Blog | Roman Aviation & Travel Chronicles",
  description: "Read travel logs, high-altitude pilgrimage guides, and helicopter safety details on our official travel blog.",
  keywords: "Kedarnath helicopter booking 2026, Char Dham yatra cost breakdown, Vaishno Devi helicopter guide, private helicopter charters",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
