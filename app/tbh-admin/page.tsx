"use client";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

// Matches your backend data exactly
interface Reporter {
  user: {
    userId: string;
    name: string;
  };
  reason: string;
  createdAt: string;
}

interface Report {
  _id: string;
  yourStoryTitle: string;
  status: number;
  reportedBy: Reporter[];
}

export default function Page() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/api/reports`, { method: "GET" });
        const data = await res.json();
        console.log("API data:", data);
        setReports(data.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Reported Posts</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((item) => (
            <li key={item._id} className="border p-3 rounded-md">
              <h3 className="font-bold text-lg">{item.yourStoryTitle}</h3>
              <p>Status: {item.status === 1 ? "Active" : "Reported/Hidden"}</p>
              <p>Reports: {item.reportedBy.length}</p>
              <ul className="ml-4 list-disc">
                {item.reportedBy.map((r, idx) => (
                  <li key={idx}>
                    <strong>{r.user?.name || "Unknown User"}</strong> — {r.reason}
                    <span className="text-sm text-gray-500 ml-2">
                      ({new Date(r.createdAt).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
