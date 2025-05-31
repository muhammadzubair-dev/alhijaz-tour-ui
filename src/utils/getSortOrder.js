function getSortOrder(currentSortBy, columnKey, currentSortOrder) {
  if (currentSortBy !== columnKey) return null;

  if (currentSortOrder === 'asc') return 'ascend';
  if (currentSortOrder === 'desc') return 'descend';

  return null;
}

export default getSortOrder