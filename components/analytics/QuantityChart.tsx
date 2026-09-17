"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { city: "Pune", quantity: 35 },
  { city: "Mumbai", quantity: 35 },
  { city: "Nashik", quantity: 39 },
];

export default function QuantityChart() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="font-semibold">
          Quantity Distribution
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Units sold across locations
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="city" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="quantity"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}