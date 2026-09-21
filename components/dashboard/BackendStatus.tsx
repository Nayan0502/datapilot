
"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";

export default function BackendStatus() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const result = await checkBackendHealth();

        setStatus(result.status);
        setError(false);
      } catch {
        setStatus("Backend unavailable");
        setError(true);
      }
    }

    checkStatus();
  }, []);

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${
            error ? "bg-red-500" : "bg-green-500"
          }`}
        />

        <div>
          <p className="font-semibold">
            Backend Status
          </p>

          <p className="text-sm text-gray-500">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}