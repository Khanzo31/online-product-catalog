// frontend/src/app/[slug]/page.tsx

import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

// Interface (no change)
interface Page {
  id: number;
  Title: string;
  Slug: string;
  Content: string;
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

// Data fetching function (no change)
async function getPageBySlug(slug: string): Promise<Page | null> {
  const apiUrl = `${strapiUrl}/api/pages`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error("Failed to fetch the list of pages.");
      return null;
    }
    const responseData = await res.json();
    const allPages: Page[] = responseData.data;
    if (!allPages) return null;
    const page = allPages.find((p) => p.Slug === slug);
    return page || null;
  } catch (error) {
    console.error("Error fetching or processing pages:", error);
    return null;
  }
}

// --- START OF FIX: UPDATE PROPS TYPE ---
// The generateMetadata function also needs to handle the Promise-based params.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await the promise to get the slug
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  // --- END OF FIX ---

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const description = page.Content
    ? page.Content.substring(0, 155).replace(/\s+/g, " ").trim() + "..."
    : `Learn more about ${page.Title} on AlpialCanada.`;

  return {
    title: `${page.Title} | AlpialCanada`,
    description: description,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: `${page.Title} | AlpialCanada`,
      description: description,
    },
  };
}

// --- START OF FIX: UPDATE PAGE COMPONENT PROPS ---
export default async function StaticPage({
  params,
}: {
  // 1. Type params as a Promise containing the slug object
  params: Promise<{ slug: string }>;
}) {
  // 2. Await the params promise to get the resolved object
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  // --- END OF FIX ---

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{page.Title}</h1>
      <article className="prose lg:prose-lg max-w-none">
        <ReactMarkdown>{page.Content}</ReactMarkdown>
      </article>
    </div>
  );
}
