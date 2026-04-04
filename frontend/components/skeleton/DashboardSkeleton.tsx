export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Low Stock Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>

      {/* Product Summary Skeleton */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="h-5 w-40 bg-gray-300 rounded"></div>

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b pb-2"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
