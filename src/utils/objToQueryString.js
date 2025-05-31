function objToQueryString(obj) {
  if (!obj) return '';
  const query = Object.entries(obj)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

  return query ? `?${query}` : '';
}

export default objToQueryString
