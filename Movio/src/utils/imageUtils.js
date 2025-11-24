/**
 * Get a placeholder image URL or data URI for movies without posters
 * @returns {string} Placeholder image URL or data URI
 */
export const getPlaceholderPoster = () => {
  // You can replace this with an actual placeholder image URL
  // or use a data URI for a simple placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkMWI0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5YjliOWIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBQb3N0ZXI8L3RleHQ+PC9zdmc+';
};

/**
 * Handle image load error by replacing with placeholder
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  event.target.src = getPlaceholderPoster();
  event.target.onerror = null; // Prevent infinite loop
};

