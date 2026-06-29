import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/proposal/", "/top_icp/", "/ebb-list/", "/onboarding/"],
      },
    ],
    host: "https://stackleaps.com",
  };
}
