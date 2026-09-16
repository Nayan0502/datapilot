import { Upload, Search, MoreHorizontal } from "lucide-react";
import UploadDataset from "@/components/datasets/UploadDataset";

const datasets = [
  {
    name: "Sales Data",
    type: "CSV",
    records: "12,450",
    uploaded: "Sep 16, 2026",
    status: "Processed",
  },
  {
    name: "Customer Data",
    type: "CSV",
    records: "8,240",
    uploaded: "Sep 15, 2026",
    status: "Processed",
  },
  {
    name: "Marketing Data",
    type: "Excel",
    records: "5,820",
    uploaded: "Sep 14, 2026",
    status: "Processing",
  },
];

export default function DatasetsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Datasets
          </h1>

          <p className="mt-2 text-gray-500">
            Upload and manage your datasets
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <Upload size={18} />
          Upload Dataset
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Datasets
          </p>

          <p className="mt-2 text-3xl font-bold">
            3
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="mt-2 text-3xl font-bold">
            26,510
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">
            Processed
          </p>

          <p className="mt-2 text-3xl font-bold">
            2
          </p>
        </div>

      </div>

      <UploadDataset />

      {/* Dataset Table */}
      <div className="mt-8 rounded-xl border bg-white">

        {/* Table Header */}
        <div className="flex items-center justify-between border-b p-5">

          <div>
            <h2 className="font-semibold">
              Your Datasets
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your uploaded data
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search datasets..."
              className="w-48 text-sm outline-none"
            />
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">
                  Dataset
                </th>

                <th className="px-5 py-4 font-medium">
                  Type
                </th>

                <th className="px-5 py-4 font-medium">
                  Records
                </th>

                <th className="px-5 py-4 font-medium">
                  Uploaded
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {datasets.map((dataset) => (
                <tr
                  key={dataset.name}
                  className="border-b last:border-0 hover:bg-gray-50"
                >

                  <td className="px-5 py-4 font-medium">
                    {dataset.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {dataset.type}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {dataset.records}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {dataset.uploaded}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        dataset.status === "Processed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {dataset.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <button className="rounded-lg p-2 hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}