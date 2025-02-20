"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

function Pagination({
  children,
  pages,
}: {
  children: React.ReactNode;
  pages: number;
}) {
  const pathname = usePathname();
  const paramsData = useSearchParams();
  const params = Object.fromEntries(paramsData);
  const router = useRouter();
  const [search, setSearch] = React.useState<string>(params.search || "");
  const [page, setPage] = React.useState<string>(params.page || "1");
  const handleSearch = (
    path: string = pathname,
    field?: string,
    value?: string,
  ) => {
    const searchParams = new URLSearchParams(params);

    search !== "" && searchParams.set("search", search);
    page !== "1" && searchParams.set("page", page);

    if (field) {
      if (value && value !== "") {
        searchParams.set(field, value);
      } else {
        searchParams.delete(field);
      }
    }
    router.push(`${path == "/" ? "tutors" : path}?${searchParams.toString()}`);
  };

  return (
    <div className="w-full">
      <div className=" mb-4 flex flex-row gap-4">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="search"
          className="w-full rounded border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        />
        <button
          onClick={() => handleSearch(pathname, "search", search)}
          className="flex items-center justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
        >
          Search
        </button>
      </div>
      {children}
      <div className="mt-4 flex flex-row gap-4">
        <button
          onClick={() => {
            if (Number(page) > 1) {
              handleSearch(pathname, "page", (Number(page) - 1).toString());
            }
          }}
          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
        >
          Previous
        </button>
        <p>
          Page {page} of {pages}
        </p>
        <button
          onClick={() => {
            if (Number(page) < pages) {
              handleSearch(pathname, "page", (Number(page) + 1).toString());
            }
          }}
          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
