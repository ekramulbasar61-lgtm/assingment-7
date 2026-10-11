export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-8">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse flex flex-col justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                <div className="w-full space-y-2 pt-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-2 w-1/2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
