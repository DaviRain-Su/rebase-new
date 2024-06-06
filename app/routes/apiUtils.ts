import axios from "axios";

// Function to fetch all items with pagination
export async function fetchAllItems(baseUrl: string, pageSize: number = 100) {
  let allItems = [];

  // Initial request to get pagination info
  let response = await axios.get(
    `${baseUrl}?pagination[page]=1&pagination[pageSize]=${pageSize}`,
  );
  allItems = response.data.data;
  const pageCount = response.data.meta.pagination.pageCount;

  // Fetch remaining pages
  const requests = [];
  for (let page = 2; page <= pageCount; page++) {
    requests.push(
      axios.get(
        `${baseUrl}?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      ),
    );
  }
  const responses = await Promise.all(requests);
  responses.forEach((res) => {
    allItems = allItems.concat(res.data.data);
  });

  return allItems;
}

// Function to process and sort items
export function processItems(items: any[]) {
  // Filter items with valid URLs
  const validUrlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)?$/;
  const validItems = items.filter((item) =>
    validUrlRegex.test(item.attributes.url),
  );

  // Sort items by date
  validItems.sort(
    (a, b) => new Date(b.attributes.time) - new Date(a.attributes.time),
  );

  return validItems;
}
