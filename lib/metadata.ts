import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

export const siteConfig = {
  name: "Studio",
  tagline: "Digital Creative Agency",
  description:
    "A creative studio crafting brands and digital products that leave a lasting impression. We specialize in web development, UI/UX design, brand identity, and digital strategy.",
  url: baseUrl,
  ogImage: `${baseUrl}/og-image.jpg`,
  twitterHandle: "@studio",
};

export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const metaDescription = description ?? siteConfig.description;
  const metaImage = image ?? siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    metadataBase: new URL(siteConfig.url),

    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },

    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  };
}
