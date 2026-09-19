"use client";

import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Database,
  FileWarning,
} from "lucide-react";

import { DataQualityReport as QualityReport } from "@/lib/dataQuality";

type Props = {
  report: QualityReport;
};

export default function DataQualityReport({
  report,
}: Props) {
  const isGoodQuality = report.qualityScore >= 80;

  return (
    <div className="mt-8 rounded-xl border bg-white p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Data Quality
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Automated checks performed on your dataset.
          </p>
        </div>

        {isGoodQuality ? (
          <CheckCircle
            size={24}
            className="text-green-600"
          />
        ) : (
          <AlertTriangle
            size={24}
            className="text-yellow-600"
          />
        )}

      </div>

      {/* Quality Score */}
      <div className="mt-6 rounded-xl border bg-gray-50 p-6">

        <p className="text-sm text-gray-500">
          Overall Quality Score
        </p>

        <div className="mt-2 flex items-end gap-2">

          <p className="text-4xl font-bold">
            {report.qualityScore}
          </p>

          <p className="mb-1 text-gray-500">
            / 100
          </p>

        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-green-500"
            style={{
              width: `${report.qualityScore}%`,
            }}
          />

        </div>

        <p className="mt-3 text-xs text-gray-500">
          Score is calculated using missing values,
          duplicates, empty columns and invalid numeric
          values.
        </p>

      </div>

      {/* Quality Metrics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-lg border p-4">

          <div className="flex items-center gap-2">
            <Database size={18} />
            <p className="text-sm text-gray-500">
              Missing Values
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold">
            {report.missingCells}
          </p>

        </div>

        <div className="rounded-lg border p-4">

          <div className="flex items-center gap-2">
            <Copy size={18} />
            <p className="text-sm text-gray-500">
              Duplicate Rows
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold">
            {report.duplicateRows}
          </p>

        </div>

        <div className="rounded-lg border p-4">

          <div className="flex items-center gap-2">
            <FileWarning size={18} />

            <p className="text-sm text-gray-500">
              Empty Columns
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold">
            {report.emptyColumns}
          </p>

        </div>

        <div className="rounded-lg border p-4">

          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />

            <p className="text-sm text-gray-500">
              Invalid Numeric
            </p>
          </div>

          <p className="mt-2 text-2xl font-bold">
            {report.invalidNumericValues}
          </p>

        </div>

      </div>

      {/* Issues */}
      <div className="mt-8">

        <h3 className="font-semibold">
          Detected Issues
        </h3>

        {report.issues.length === 0 ? (

          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

            <div className="flex items-center gap-2">

              <CheckCircle
                size={20}
                className="text-green-600"
              />

              <p className="text-sm font-medium text-green-700">
                No data quality issues detected.
              </p>

            </div>

          </div>

        ) : (

          <div className="mt-4 space-y-3">

            {report.issues.map((issue, index) => (

              <div
                key={`${issue.type}-${issue.column}-${index}`}
                className="rounded-lg border bg-gray-50 p-4"
              >

                <div className="flex items-start gap-3">

                  <AlertTriangle
                    size={18}
                    className="mt-0.5 text-yellow-600"
                  />

                  <div>

                    <p className="text-sm font-semibold">
                      {issue.type}
                      {issue.column &&
                        ` — ${issue.column}`}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {issue.message}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}