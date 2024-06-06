import type { MetaFunction } from "@remix-run/node";
import "../styles/NewsStyles.css";
//import { Link } from "@remix-run/react";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import axios from "axios";
import "../styles/NewsStyles.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Rebase News" },
    { name: "description", content: "Welcome to Rebase News" },
  ];
};

import { fetchAllItems, processItems } from "./apiUtils"; // 确保路径是正确的

export const loader: LoaderFunction = async () => {
  const baseUrl = "https://db.rebase.network/api/v1/geekdailies";

  try {
    // Fetch all items from the API
    let allItems = await fetchAllItems(baseUrl);

    // Process items (filter and sort)
    let processedItems = processItems(allItems);

    // Randomly pick 10 items from the list
    const shuffled = processedItems.sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 10);

    return selectedItems;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to fetch data", { status: 500 });
  }
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div className="newsContainer">
      <h1>Welcome to Rebase News</h1>
      <nav>
        <Link to="/">Random Rebase News</Link> |{" "}
        <Link to="/items">All Rebase News</Link> |{" "}
        <Link to="/latest">Latest Rebase News</Link>
      </nav>
      <h1 className="newsTitle">Random Rebase News</h1>
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
