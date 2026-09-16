
"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import Papa from "papaparse";

type CsvRow = string[];

export default function UploadDataset() {
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<CsvRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setError("");
    setHeaders([]);
    setPreviewRows([]);
    setTotalRecords(0);
    setFileName("");
    setIsUploaded(false);

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

    Papa.parse<string[]>(file, {
      skipEmptyLines: true,

      complete: (results) => {
        const rows = results.data as string[][];

        if (rows.length < 2) {
          setError(
            "CSV must contain a header and at least one data row."
          );
          return;
        }

        const csvHeaders = rows[0].map((header) =>
          header.trim()
        );

        if (
          csvHeaders.length === 0 ||
          csvHeaders.some((header) => header === "")
        ) {
          setError("CSV headers cannot be empty.");
          return;
        }

        const dataRows = rows.slice(1);

        setFileName(file.name);
        setHeaders(csvHeaders);
        setTotalRecords(dataRows.length);

        // Show only the first 10 records
        setPreviewRows(dataRows.slice(0, 10));

        setIsUploaded(true);
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
  }

  return (
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

          <Upload size={32} className="text-gray-500" />

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

      {/* Error */}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* File Information */}
      {isUploaded && !error && (
        <>
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-4">

            <FileText size={20} className="text-gray-500" />

            <div>
              <p className="text-sm font-medium">
                {fileName}
              </p>

              <p className="text-xs text-green-600">
                CSV parsed successfully
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
          <div className="mt-8">

            <div>
              <h3 className="font-semibold">
                Data Preview
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Showing up to 10 records from your dataset.
              </p>
            </div>

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

                  {previewRows.map((row, rowIndex) => (
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
                  ))}

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
  );
}