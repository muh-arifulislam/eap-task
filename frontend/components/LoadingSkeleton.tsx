const LoadingSkeleton = () => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm p-4 border border-slate-200 animate-pulse">
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-3 text-left">
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
            </th>
            <th className="p-3 text-left">
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
            </th>
            <th className="p-3 text-left">
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
            </th>
            <th className="p-3 text-left">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </th>
            <th className="p-3 text-left">
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render 5 skeleton rows */}
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">
                <div className="h-4 w-32 bg-slate-100 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-8 bg-slate-100 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
              </td>
              <td className="p-3 flex gap-2">
                <div className="h-8 w-8 bg-slate-100 rounded"></div>
                <div className="h-8 w-8 bg-slate-100 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Skeleton */}
      <div className="flex justify-end mt-4 gap-2">
        <div className="h-8 w-16 bg-slate-100 rounded"></div>
        <div className="h-8 w-8 bg-slate-100 rounded"></div>
        <div className="h-8 w-8 bg-slate-100 rounded"></div>
        <div className="h-8 w-16 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
