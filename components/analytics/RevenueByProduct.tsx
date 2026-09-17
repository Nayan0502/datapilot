"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { product: "Laptop", revenue: 165000 },
  { product: "Monitor", revenue: 97000 },
  { product: "Keyboard", revenue: 30000 },
  { product: "Mouse", revenue: 23000 },
];

export default function RevenueByProduct() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="font-semibold">
          Revenue by Product
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Product-level revenue performance
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="product" />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString()}`
              }
            />

            <Bar
              dataKey="revenue"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}