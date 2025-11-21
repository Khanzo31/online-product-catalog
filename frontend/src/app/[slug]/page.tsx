// frontend/src/app/[slug]/page.tsx

import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import Link from "next/link";

interface Page {
  id: number;
  Title: string;
  Slug: string;
  Content: string;
}

const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

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

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol
          role="list"
          className="flex items-center space-x-2 text-sm text-gray-500"
        >
          <li>
            <Link href="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="text-gray-300">/</span>
          </li>
          <li>
            <span
              aria-current="page"
              className="font-medium text-gray-900 dark:text-gray-100 capitalize"
            >
              {page.Title}
            </span>
          </li>
        </ol>
      </nav>

      <header className="mb-10 text-center border-b border-stone-200 dark:border-gray-700 pb-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
          {page.Title}
        </h1>
        <div className="h-1 w-20 bg-amber-700 mx-auto rounded-full"></div>
      </header>

      <article className="prose prose-lg prose-stone dark:prose-invert max-w-none animate-fade-in-up font-light leading-relaxed">
        {/* 
           Note: Ensure your Strapi content uses clean Markdown headers (##, ###) 
           The 'prose-stone' class will automatically style them with warm gray tones.
        */}
        <ReactMarkdown>{page.Content}</ReactMarkdown>
      </article>
    </div>
  );
}
