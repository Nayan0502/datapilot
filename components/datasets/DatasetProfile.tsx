
"use client";

import type { DatasetProfile as Profile } from "@/lib/dataProfiler";

type Props = {
  profile: Profile;
};

export default function DatasetProfile({ profile }: Props) {
  return (
    <div className="mt-8">

      <h3 className="text-lg font-semibold">
        Dataset Profile
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Automatically generated statistics
      </p>

      {/* Overview */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Total Rows
          </p>

          <p className="mt-2 text-2xl font-bold">
            {profile.totalRows.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Total Columns
          </p>

          <p className="mt-2 text-2xl font-bold">
            {profile.totalColumns}
          </p>
        </div>

      </div>

      {/* Column Statistics */}
      <div className="mt-6 overflow-x-auto rounded-lg border">

        <table className="w-full text-left text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Column</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Unique</th>
              <th className="px-4 py-3">Missing</th>
              <th className="px-4 py-3">Min</th>
              <th className="px-4 py-3">Max</th>
              <th className="px-4 py-3">Average</th>
            </tr>
          </thead>

          <tbody>

            {profile.columns.map((column) => (
              <tr
                key={column.name}
                className="border-t"
              >

                <td className="px-4 py-3 font-medium">
                  {column.name}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {column.type}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {column.uniqueValues}
                </td>

                <td className="px-4 py-3">
                  {column.missingValues}
                </td>

                <td className="px-4 py-3">
                  {column.min ?? "—"}
                </td>

                <td className="px-4 py-3">
                  {column.max ?? "—"}
                </td>

                <td className="px-4 py-3">
                  {column.average !== undefined
                    ? column.average.toFixed(2)
                    : "—"}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}