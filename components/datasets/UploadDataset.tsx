
"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";

type PreviewRow = string[];

export default function UploadDataset() {
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    setError("");
    setPreviewRows([]);
    setFileName("");
    setIsUploaded(false);

    if (!file) {
      return;
    }

    // Validate file type
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

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;

      if (typeof text !== "string") {
        setError("Unable to read the file.");
        return;
      }

      const lines = text
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");

      if (lines.length === 0) {
        setError("The CSV file is empty.");
        return;
      }

      // Display the first 6 rows, including headers
      const rows = lines
        .slice(0, 6)
        .map((line) => line.split(","));

      setPreviewRows(rows);
      setIsUploaded(true);
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
    };

    reader.readAsText(file);
  }

  function handleRemove() {
    setFileName("");
    setPreviewRows([]);
    setError("");
    setIsUploaded(false);
  }

  return (
    <div className="mt-8 rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Upload Dataset
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Upload a CSV file to preview your data.
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

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {fileName && !error && (
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <FileText size={20} className="text-gray-500" />

          <div>
            <p className="text-sm font-medium">
              {fileName}
            </p>

            <p className="text-xs text-green-600">
              File loaded successfully
            </p>
          </div>
        </div>
      )}

      {previewRows.length > 0 && !error && (
        <div className="mt-6">
          <h3 className="font-semibold">
            Data Preview
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Showing the first 5 data rows.
          </p>

          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      rowIndex === 0
                        ? "bg-gray-100 font-semibold"
                        : "border-t"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="whitespace-nowrap px-4 py-3"
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}