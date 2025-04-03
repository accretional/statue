// Client side file - for navigation
// All data processing is done in the +page.server.js file

/** @type {import('./$types').PageLoad} */
export function load({ data }) {
  // Pass data loaded from server directly
  return data;
} 