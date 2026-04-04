"use client";

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import { UseQueryResult } from "@tanstack/react-query";

interface Props<T> {
  placeholder?: string;
  searchFn: (query: string) => UseQueryResult<T[], Error>;
  labelKey: keyof T;
  idKey: keyof T;
  onSelect?: (item: T) => void;
}
export default function SearchWithSuggestion<T>({
  placeholder,
  searchFn,
  labelKey,
  idKey,
  onSelect,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data = [], isLoading } = searchFn(`search=${debouncedSearch}`);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-[300px]">
      <label className="text-sm mb-1">Search</label>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={search}
        onFocus={() => setOpen(true)}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-md px-3 py-1"
      />

      {open && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
          {isLoading && <p className="p-3 text-sm text-gray-500">Loading...</p>}

          {!isLoading && data?.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No result found</p>
          )}

          {data?.map((item) => (
            <div
              key={String(item[idKey])}
              onClick={() => {
                onSelect?.(item);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {String(item[labelKey])}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useDebounce } from "@/hooks/useDebounce";
// import { useSearchProducts } from "@/hooks/useProduct";

// interface Product {
//   _id: string;
//   name: string;
// }

// interface Props {
//   placeholder?: string;
// }

// export default function SearchWithSuggestion({ placeholder }: Props) {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);

//   const wrapperRef = useRef<HTMLDivElement | null>(null);

//   const debouncedSearch = useDebounce(search, 500);

//   const { data = [], isLoading } = useSearchProducts(
//     `search=${debouncedSearch}`,
//   );

//   // close when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div ref={wrapperRef} className="relative w-[300px]">
//       <input
//         type="text"
//         placeholder={placeholder || "Search product..."}
//         value={search}
//         onFocus={() => setOpen(true)}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full border rounded-md px-3 py-2"
//       />

//       {open && (
//         <div className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
//           {isLoading && <p className="p-3 text-sm text-gray-500">Loading...</p>}

//           {!isLoading && data?.length === 0 && (
//             <p className="p-3 text-sm text-gray-500">No result found</p>
//           )}

//           {data?.map((item: Product) => (
//             <div
//               key={item._id}
//               onClick={() => {
//                 console.log(item._id);
//                 setOpen(false);
//               }}
//               className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
