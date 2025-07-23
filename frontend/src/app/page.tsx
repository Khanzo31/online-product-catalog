// frontend/src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import ProductCard, { ProductCardProps } from "@/app/components/ProductCard";

// Define data fetching function
const strapiUrl =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  const apiUrl = `${strapiUrl}/api/products?sort=updatedAt:desc&pagination[limit]=4&populate=Images`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 300 } }); // Revalidate every 5 minutes
    if (!res.ok) return [];
    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// Update the main component to be async and fetch data
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const images = [
    {
      src: "/product-collage-1.png",
      alt: "A collage of collectible die-cast cars, including NASCAR and Volkswagen models.",
    },
    {
      src: "/product-collage-2.png",
      alt: "A collage of various collectibles, including toy trucks, license plates, and themed cars.",
    },
    {
      src: "/product-collage-3.png",
      alt: "A collage featuring NASCAR memorabilia, collectible pipes, and vintage Matchbox cars.",
    },
    {
      src: "/product-collage-4.png",
      alt: "A diverse collage of items including a purple model car, candles, and vintage toy packaging.",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold text-gray-800 dark:text-gray-200">
          Welcome to AlpialCanada
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover a curated collection of unique antiques, vintage toys, and
          rare collectibles. Browse our catalog to find your next treasure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
              priority={index < 2}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link
          href="/search"
          className="bg-red-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Browse All Products
        </Link>
      </div>

      {featuredProducts.length > 0 && (
        <section className="mt-20 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-gray-200">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of the latest items from our collection.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mt-12 py-16 bg-warm-bg dark:bg-gray-900 rounded-lg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-gray-200">
            A Passion for Collecting
          </h2>
          <div className="prose prose-lg mx-auto mt-6 dark:prose-invert">
            <p>
              At AlpialCanada, we believe that every object has a story. Our
              catalog is a reflection of a lifelong passion for uncovering
              unique and interesting items from the past. We specialize in a
              wide array of collectibles, from vintage die-cast cars and classic
              toys to rare antiques and memorabilia that evoke a sense of
              nostalgia and wonder.
            </p>
            <p>
              Our collection is constantly evolving as we discover new
              treasures. Whether you are a seasoned collector searching for a
              specific piece to complete your set, or a newcomer looking for a
              unique item that catches your eye, we invite you to explore what
              we have to offer. Each product is carefully selected and presented
              with the care it deserves. Thank you for visiting, and we hope you
              find something special.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
