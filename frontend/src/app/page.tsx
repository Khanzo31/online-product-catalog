// frontend/src/app/page.tsx
import Image from "next/image";
import Link from "next/link"; // <-- Import Link

export default function HomePage() {
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
        <h1 className="font-serif text-5xl font-bold text-gray-800">
          Welcome to AlpialCanada
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Discover a curated collection of unique antiques, vintage toys, and
          rare collectibles. Browse our catalog to find your next treasure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-xl border border-gray-200"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center"
              priority={index < 2} // Prioritize loading the first two images
            />
          </div>
        ))}
      </div>

      {/* --- NEW CALL-TO-ACTION SECTION --- */}
      <div className="text-center mt-16">
        <Link
          href="/search"
          className="bg-red-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Browse All Products
        </Link>
      </div>
      {/* --- END OF NEW SECTION --- */}
    </main>
  );
}
