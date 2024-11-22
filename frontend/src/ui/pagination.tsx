import { Link, useSearch } from "wouter";
import { getPagination } from "../lib/get-pagination";
import { cn } from "../lib/utils";
import classes from "./pagination.module.css";

interface PaginationProps {
  end: number;
  url: string;
}

export default function Pagination({ end, url = "/search" }: PaginationProps) {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const curr = Number(params.get("page"));

  params.set("page", "");
  const pages = getPagination(curr, end);
  return (
    <div className={classes.pagination}>
      <Link
        href={`${url}?${params}${Math.max(curr - 1, 1)}`}
        className={classes.page}
      >
        &lt;&lt;
      </Link>
      {pages.map((page) => (
        <Link
          href={`${url}?${params}${page}`}
          className={cn([classes.page, page === curr && classes.current])}
          key={page}
        >
          {page}
        </Link>
      ))}
      <Link
        href={`${url}?${params}${Math.min(curr + 1, end)}`}
        className={classes.page}
      >
        &gt;&gt;
      </Link>
    </div>
  );
}
