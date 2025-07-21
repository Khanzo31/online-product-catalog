// frontend/src/app/page.tsx
import Image from "next/image";

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
    // The main tag no longer has container classes, allowing sections to be full-width.
    <main>
      {/* --- 1. Full-Width Image View (Top Section) --- */}
      {/* This div is full-width and uses flexbox to place images side-by-side with no gaps. */}
      {/* On small screens (mobile), it stacks them vertically (flex-col). */}
      <div className="w-full flex flex-col sm:flex-row">
        {images.map((image, index) => (
          // Each image container is relative to position the Next/Image component inside.
          // On small screens, each takes the full width. On larger screens, they each take 1/4 of the width.
          <div
            key={`full-width-${index}`}
            className="relative w-full sm:w-1/4 h-64 sm:h-96"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={true} // Prioritize all images in this view as they are above the fold.
            />
          </div>
        ))}
      </div>

      {/* --- 2. Divider --- */}
      {/* This section is wrapped in a container to align with the content below it. */}
      <div className="container mx-auto px-4 my-16">
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-warm-bg px-4 text-xl font-medium text-gray-600 font-serif">
              Our Collection
            </span>
          </div>
        </div>
      </div>

      {/* --- 3. Centered Grid View (Bottom Section) --- */}
      {/* This is the original layout, now placed below the divider. */}
      {/* It's wrapped in a container to keep it centered with a max-width. */}
      <div className="container mx-auto px-4 pb-16">
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
              key={`grid-${index}`}
              className="overflow-hidden rounded-lg shadow-xl border border-gray-200"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
