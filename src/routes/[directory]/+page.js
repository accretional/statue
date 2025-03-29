// Client-side file - for navigation purposes
// All data processing operations will be done in the +page.server.js file

/** @type {import('./$types').PageLoad} */
export function load({ data }) {
  // Directly pass the data loaded from the server side
  return data;
} 