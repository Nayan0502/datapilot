import RevenueByCity from "@/components/analytics/RevenueByCity";
import RevenueByProduct from "@/components/analytics/RevenueByProduct";
import QuantityChart from "@/components/analytics/QuantityChart";

export default function AnalyticsPage() {
  return (
    <div>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-2 text-gray-500">
          Explore insights from your datasets
        </p>
      </div>

      {/* KPI Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₹315K
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Units
          </p>

          <p className="mt-2 text-3xl font-bold">
            109
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Average Order Value
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₹2.89K
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Top City
          </p>

          <p className="mt-2 text-3xl font-bold">
            Mumbai
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <RevenueByCity />

        <RevenueByProduct />

      </div>

      <div className="mt-6">

        <QuantityChart />

      </div>
    </div>
  );
}