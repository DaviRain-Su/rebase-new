import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
//import styles from "../../stype/styles.module.css";

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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.4",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", fontSize: "18px" }}>
        Welcome to Rebase News
      </h1>
      <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
        {data.map((item) => (
          <li
            key={item.id}
            style={{
              background: "#f9f9f9",
              margin: "5px 0",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#0070f3", fontSize: "16px" }}>
              {item.attributes.title}
            </h2>
            <p style={{ margin: "2px 0", fontSize: "14px" }}>
              <strong>Episode:</strong> {item.attributes.episode}
            </p>
            <p style={{ margin: "2px 0", fontSize: "14px" }}>
              <strong>Author:</strong> {item.attributes.author}
            </p>
            <p style={{ margin: "2px 0", fontSize: "14px" }}>
              <strong>Date:</strong> {item.attributes.time}
            </p>
            <a
              href={item.attributes.url}
              style={{
                color: "#0070f3",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Course Link
            </a>
            <p style={{ marginTop: "5px", fontSize: "14px" }}>
              Introduction: {item.attributes.introduce}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
