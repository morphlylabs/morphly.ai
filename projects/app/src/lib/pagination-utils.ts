/**
 * Utility functions for handling pagination logic
 */

export interface PaginationRedirectOptions {
  currentOffset: number;
  currentLimit: number;
  totalItemsAfterDeletion: number;
  remainingItemsOnCurrentPage: number;
}

export interface PaginationRedirectResult {
  shouldRedirect: boolean;
  newOffset?: number;
  targetPage?: number;
}

/**
 * Determines if a redirect is needed after deleting an item and calculates the target page
 *
 * @param options - Pagination parameters and deletion context
 * @returns Object indicating whether to redirect and the new offset/page
 */
export function calculatePaginationRedirect({
  currentOffset,
  currentLimit,
  totalItemsAfterDeletion,
  remainingItemsOnCurrentPage,
}: PaginationRedirectOptions): PaginationRedirectResult {
  const currentPage = Math.floor(currentOffset / currentLimit) + 1;
  const totalPages = Math.ceil(totalItemsAfterDeletion / currentLimit);
  const isLastItemOnPage = remainingItemsOnCurrentPage === 0;
  const isNotFirstPage = currentPage > 1;
  const hasItemsRemaining = totalItemsAfterDeletion > 0;

  // If this page becomes empty and it's not the first page and there are items remaining
  if (isLastItemOnPage && isNotFirstPage && hasItemsRemaining) {
    // Calculate the appropriate page to redirect to
    const targetPage = Math.min(currentPage - 1, totalPages);
    const newOffset = Math.max(0, (targetPage - 1) * currentLimit);

    return {
      shouldRedirect: true,
      newOffset,
      targetPage,
    };
  }

  return {
    shouldRedirect: false,
  };
}

/**
 * Creates URL search params for pagination
 *
 * @param searchParams - Current URLSearchParams
 * @param offset - New offset value
 * @param limit - New limit value
 * @returns Updated URLSearchParams string
 */
export function createPaginationSearchParams(
  searchParams: URLSearchParams,
  offset: number,
  limit: number,
): string {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set('offset', offset.toString());
  newSearchParams.set('limit', limit.toString());
  return newSearchParams.toString();
}
