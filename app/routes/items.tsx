import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import "../styles/NewsStyles.css";
import { fetchAllItems, processItems } from "./apiUtils"; // 确保路径是正确的

export const loader: LoaderFunction = async () => {
  const baseUrl = "https://db.rebase.network/api/v1/geekdailies";

  try {
    // Fetch all items from the API
    const allItems = await fetchAllItems(baseUrl);

    // Process items (filter and sort)
    const processedItems = processItems(allItems);

    // Return only the latest 10 items
    return processedItems;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to fetch data", { status: 500 });
  }
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div className="newsContainer">
      <h1 className="newsTitle">All about Rebase News</h1>
      <nav>
        <Link to="/items">All Rebase News</Link> |{" "}
        <Link to="/latest">Latest Rebase News</Link>
      </nav>
      <ul className="newsList">
        {data.map((item) => (
          <li key={item.id} className="newsItem">
            <a href={item.attributes.url} className="newsLink">
              {item.attributes.title}
            </a>
            <p className="newsText">
              <strong>Author:</strong> {item.attributes.author}
            </p>
            <p className="newsText">
              <strong>Date:</strong> {item.attributes.time}
            </p>
            <p className="newsIntroduction">
              <strong>Introduction:</strong> {item.attributes.introduce}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
