export default function ProductCardSkeleton() {
  return (
    <div className="block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="relative h-56 w-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="bg-white dark:bg-gray-900 p-4">
        <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
        <div className="mt-2 h-5 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}
