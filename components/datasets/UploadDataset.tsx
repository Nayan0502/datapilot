
"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import Papa from "papaparse";
import { uploadDataset } from "@/lib/api";


import {
  profileDataset,
  DatasetProfile as DatasetProfileType,
} from "@/lib/dataProfiler";

import DatasetProfile from "./DatasetProfile";

import {
  analyzeDataQuality,
  DataQualityReport as DataQualityReportType,
} from "@/lib/dataQuality";

import DataQualityReport from "./DataQualityReport";



type CsvRow = string[];

type UploadDatasetProps = {
  onUploadComplete?: () => void;
};

export default function UploadDataset({
  onUploadComplete,
}: UploadDatasetProps) {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<CsvRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] =
    useState<DatasetProfileType | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [qualityReport, setQualityReport] =
    useState<DataQualityReportType | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Reset previous data
    setError("");
    setHeaders([]);
    setPreviewRows([]);
    setTotalRecords(0);
    setFileName("");
    setIsUploaded(false);
    setProfile(null);
    setQualityReport(null);
    setSearchTerm("");

    if (!file) {
      return;
    }

    // Validate file extension
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }

    // Validate file size (5 MB maximum)
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB.");
      return;
    }

    // Parse CSV file
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,

      complete: async (results) => {
        const rows = results.data as string[][];

        // Validate minimum rows
        if (rows.length < 2) {
          setError(
            "CSV must contain a header and at least one data row."
          );
          return;
        }

        // Extract and clean headers
        const csvHeaders = rows[0].map((header) =>
          String(header).trim()
        );

        // Validate headers
        if (
          csvHeaders.length === 0 ||
          csvHeaders.some((header) => header === "")
        ) {
          setError("CSV headers cannot be empty.");
          return;
        }

        // Extract data rows
        const dataRows = rows.slice(1);

        // Generate dataset profile
        const datasetProfile = profileDataset(
          csvHeaders,
          dataRows
        );

        // Update profile state
        setProfile(datasetProfile);

        const dataQualityReport =
          analyzeDataQuality(
            csvHeaders,
            dataRows
          );

        setQualityReport(
          dataQualityReport
        );

        setFileName(file.name);
        setHeaders(csvHeaders);
        setTotalRecords(dataRows.length);
        setPreviewRows(
          dataRows.slice(0, 10)
        );

        try {
  setIsSaving(true);

  await uploadDataset(file);

  setIsUploaded(true);

  onUploadComplete?.();

} catch (uploadError) {

          setError(
            uploadError instanceof Error
              ? uploadError.message
              : "Unable to save dataset."
          );

        } finally {

          setIsSaving(false);

        }
      },

      error: () => {
        setError("Unable to parse the CSV file.");
      },
    });
  }

  function handleRemove() {
    setFileName("");
    setHeaders([]);
    setPreviewRows([]);
    setTotalRecords(0);
    setError("");
    setIsUploaded(false);
    setProfile(null);
    setQualityReport(null);
    setSearchTerm("");
  }

  const filteredRows = previewRows.filter((row) =>
    row.some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      {/* Upload Container */}
      <div className="mt-8 rounded-xl border bg-white p-6">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Upload Dataset
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV file to inspect your data.
            </p>
          </div>

          {isUploaded && (
            <button
              onClick={handleRemove}
              className="rounded-lg p-2 hover:bg-gray-100"
              aria-label="Remove uploaded file"
            >
              <X size={18} />
            </button>
          )}

        </div>

        {/* Upload Area */}
        {!isUploaded && (
          <label
            htmlFor="csv-upload"
            className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 text-center hover:bg-gray-50"
          >

            <Upload
              size={32}
              className="text-gray-500"
            />

            <p className="mt-4 font-medium">
              Click to upload CSV
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Maximum file size: 5 MB
            </p>

            <input
              id="csv-upload"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* File Information */}
        {isUploaded && !error && (
          <>
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FileText
                size={20}
                className="text-gray-500"
              />

              <div>
                <p className="text-sm font-medium">
                  {fileName}
                </p>

                <p
                  className={`text-xs ${isSaving
                      ? "text-blue-600"
                      : "text-green-600"
                    }`}
                >
                  {isSaving
                    ? "Saving dataset..."
                    : "CSV saved successfully"}
                </p>
              </div>

            </div>

            {/* Metadata Summary */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Total Records
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalRecords.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Total Columns
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {headers.length}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Preview Rows
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {previewRows.length}
                </p>
              </div>

            </div>

            {/* Data Preview */}
            {/* Data Preview */}
            <div className="mt-8">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="font-semibold">
                    Data Preview
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Search and inspect your dataset records.
                  </p>
                </div>

                <button
                  onClick={() => setSearchTerm("")}
                  disabled={searchTerm === ""}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear Search
                </button>

              </div>

              {/* Search Input */}
              <div className="mt-4">

                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Search Summary */}
              <div className="mt-3 flex items-center justify-between">

                <p className="text-xs text-gray-500">
                  Showing {filteredRows.length} of {previewRows.length} preview rows
                </p>

                {searchTerm && (
                  <p className="text-xs text-blue-600">
                    Filter active
                  </p>
                )}

              </div>

              {/* Data Table */}
              <div className="mt-4 overflow-x-auto rounded-lg border">

                <table className="w-full text-left text-sm">

                  <thead className="bg-gray-100">

                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={`${header}-${index}`}
                          className="whitespace-nowrap px-4 py-3 font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>

                  </thead>

                  <tbody>

                    {filteredRows.length > 0 ? (

                      filteredRows.map((row, rowIndex) => (

                        <tr
                          key={rowIndex}
                          className="border-t hover:bg-gray-50"
                        >

                          {headers.map((_, columnIndex) => (

                            <td
                              key={columnIndex}
                              className="whitespace-nowrap px-4 py-3 text-gray-600"
                            >
                              {row[columnIndex] ?? ""}
                            </td>

                          ))}

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td
                          colSpan={headers.length}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No matching records found.
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              <p className="mt-3 text-xs text-gray-500">
                Preview only. The complete dataset is not stored
                permanently or sent to a backend.
              </p>

            </div>
          </>
        )}

      </div>

      {/* Dataset Profile */}
      {profile && !error && (
        <DatasetProfile profile={profile} />
      )}

      {qualityReport && !error && (
        <DataQualityReport report={qualityReport} />
      )}
    </>
  );
}