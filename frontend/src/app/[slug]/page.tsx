import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// The interface is simple and flat, matching your API's reality.
interface Page {
  id: number;
  Title: string;
  Slug: string;
  Content: string;
}

// =================================================================================
// DATA FETCHING FUNCTION - FINAL CORRECTED VERSION
// =================================================================================
async function getPageBySlug(slug: string): Promise<Page | null> {
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  // 1. We fetch the unfiltered list of ALL pages.
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

    // --- THE FIX ---
    // 2. We find the page by looking for the 'Slug' property directly on the page object.
    const page = allPages.find((p) => p.Slug === slug);

    // If no page is found, return null.
    return page || null;
  } catch (error) {
    console.error("Error fetching or processing pages:", error);
    return null;
  }
}

// =================================================================================
// PAGE COMPONENT (No changes needed)
// =================================================================================
export default async function StaticPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getPageBySlug(params.slug);

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
