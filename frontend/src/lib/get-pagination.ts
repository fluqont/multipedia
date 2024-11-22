export function getPagination(curr: number, end: number) {
  const pages: number[] = [1];

  if (curr !== 1 && curr !== end) {
    pages.push(curr);
  }
  if (curr - 1 > 1 && curr - 1 !== end) {
    pages.push(curr - 1);
  }
  if (curr + 1 !== 1 && curr + 1 < end) {
    pages.push(curr + 1);
  }

  pages.sort();
  if (end !== 1 && end >= curr) {
    pages.push(end);
  }

  return pages;
}
