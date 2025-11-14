// src/app/shorts/page.js
"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import ShortsComponent from "../../components/ShortsComponent";

export default function ShortsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/videos`);
        const data = await res.json();

        setItems(
          data.map((v) => ({
            id: v.id.toString(),
            url: v.youtube_url,
          }))
        );
      } catch (error) {
        console.error("Error loading shorts:", error);
      }
    };

    load();
  }, []);

  return (
    <div className="shorts-container" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>
      <ShortsComponent items={items} />
    </div>
  );
}
