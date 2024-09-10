import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useNavigate } from "react-router-dom";

interface PaginationProps {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
}

const ONPAGE: number = parseInt(process.env.REACT_APP_ON_PAGE || "25", 10);



export function PaginationComponent({
  count,
  next,
  previous,
  page,
}: PaginationProps) {
  const navigate = useNavigate();

  const onPageChange = (page: number) => {
    navigate(`?page=${page}`);
  };

  const totalPages = Math.floor(count / ONPAGE);
  if (totalPages === 1) {
    return null;
  }
  const urlNext = next || "";
  const matchNext = urlNext.match(/[?&]page=(\d+)/);
  const pageNumberNext = matchNext ? matchNext[1] : null;

  const urlPrevious = previous || "";
  const matchPrevious = urlPrevious.match(/[?&]page=(\d+)/);
  const pageNumberPrevious = matchPrevious ? matchPrevious[1] : null;

  return (
    <Pagination>
      <PaginationContent>
        {previous && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Number(pageNumberPrevious))}
            />
          </PaginationItem>
        )}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={page === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {totalPages > ONPAGE && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {next && (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Number(pageNumberNext))}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
