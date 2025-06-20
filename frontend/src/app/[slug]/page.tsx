// frontend/src/app/[slug]/page.tsx

import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// Interface (no change)
interface Page {
  id: number;
  Title: string;
  Slug: string;
  Content: string;
}

// Data fetching function (no change)
async function getPageBySlug(slug: string): Promise<Page | null> {
  // ... (your existing data fetching logic is correct)
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
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

// =================================================================================
// PAGE COMPONENT - DEFINITIVE FIX
// =================================================================================
export default async function StaticPage({
  params,
}: {
  // 1. Destructure `params` directly in the signature
  // 2. Type `params` as a Promise
  params: Promise<{ slug: string }>;
}) {
  // 3. Await the `params` promise to get the resolved object
  const { slug } = await params;

  // 4. Now, `slug` is a string and can be safely used
  const page = await getPageBySlug(slug);

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
