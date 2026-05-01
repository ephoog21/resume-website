// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://edhoogasian.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/#highlights`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/#experience`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/#skills`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/#case-studies`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/#role-fit`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/#contact`, lastModified: new Date(), priority: 0.7 },
  ];
}
