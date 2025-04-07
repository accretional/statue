// Client-side file - for navigation
// All data processing operations will be done in +page.server.js

/** @type {import('./$types').PageLoad} */
export function load({ data }) {
  // Directly pass the data loaded from server
  return data;
} 