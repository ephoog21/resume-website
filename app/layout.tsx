// app/layout.tsx
// Root layout: typography, metadata, and structured data.
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

// Distinctive serif (variable, optical-size aware) for headlines.
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

// Warm grotesque body — IBM Plex Sans reads as professional/exec without
// being the overused Inter.
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

// Mono for data/terminal voice — eyebrows, metric chips, tags.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

const SITE_URL = "https://edhoogasian.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.profile.name} — ${profile.profile.headline}`,
    template: `%s — ${profile.profile.name}`,
  },
  description: profile.profile.summary,
  keywords: [
    "Analytics Leader",
    "AI Strategy",
    "Business Intelligence",
    "GTM Analytics",
    "RevOps",
    "Tableau",
    "Snowflake",
    "SQL",
    "LLM Workflows",
    "Executive Reporting",
    "Boston Analytics",
  ],
  authors: [{ name: profile.profile.name }],
  creator: profile.profile.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.profile.name} — ${profile.profile.headline}`,
    description: profile.profile.summary,
    siteName: profile.profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.profile.name} — ${profile.profile.headline}`,
    description: profile.profile.summary,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  width: "device-width",
  initialScale: 1,
};

// Person structured data so search engines understand who this is.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.profile.name,
  jobTitle: profile.profile.headline,
  description: profile.profile.summary,
  email: `mailto:${profile.profile.email}`,
  url: SITE_URL,
  sameAs: [`https://${profile.profile.linkedin}`],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Boston",
    addressRegion: "MA",
    addressCountry: "US",
  },
  worksFor: profile.experience.slice(0, 1).map((e) => ({
    "@type": "Organization",
    name: e.company,
  })),
  knowsAbout: profile.skillClusters.map((c) => c.cluster),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="font-sans bg-ink text-parchment min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
