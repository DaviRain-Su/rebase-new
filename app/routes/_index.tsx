import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import "../styles/NewsStyles.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Rebase News" },
    { name: "description", content: "Welcome to Rebase News" },
  ];
};

export const loader: LoaderFunction = async () => {
  const baseUrl = "https://db.rebase.network/api/v1/geekdailies";
  let allItems = [];
  try {
    // Initial request to get pagination info
    let response = await axios.get(
      `${baseUrl}?pagination[page]=1&pagination[pageSize]=100`,
    );
    allItems = response.data.data;
    const pageCount = response.data.meta.pagination.pageCount;

    // Fetch remaining pages
    const requests = [];
    for (let page = 2; page <= pageCount; page++) {
      requests.push(
        axios.get(
          `${baseUrl}?pagination[page]=${page}&pagination[pageSize]=100`,
        ),
      );
    }
    const responses = await Promise.all(requests);
    responses.forEach((res) => {
      allItems = allItems.concat(res.data.data);
    });

    // Filter items with valid URLs
    const validUrlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.+)?$/;
    allItems = allItems.filter((item) =>
      validUrlRegex.test(item.attributes.url),
    );

    // Sort all items by date
    allItems.sort(
      (a, b) => new Date(b.attributes.time) - new Date(a.attributes.time),
    );

    return allItems;
  } catch (error) {
    throw new Response("Failed to fetch data", { status: 500 });
  }
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div className="newsContainer">
      <h1 className="newsTitle">Welcome to Rebase News</h1>
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
