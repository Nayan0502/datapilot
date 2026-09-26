"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Database,
  FileText,
  RefreshCw,
  Rows3,
  Columns3,
} from "lucide-react";

import UploadDataset from "@/components/datasets/UploadDataset";
import {
  getDatasets,
  Dataset,
} from "@/lib/api";

import Link from "next/link";


export default function DatasetsPage() {

  const [datasets, setDatasets] =
    useState<Dataset[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isRefreshing, setIsRefreshing] =
    useState(false);


  const loadDatasets = useCallback(
    async (showRefreshing = false) => {

      try {

        if (showRefreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError("");

        const result =
          await getDatasets();

        setDatasets(
          result.datasets
        );

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load datasets."
        );

      } finally {

        setIsLoading(false);
        setIsRefreshing(false);

      }
    },
    []
  );


  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);


  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Datasets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Upload, inspect and manage your datasets.
          </p>

        </div>


        <button
          onClick={() =>
            loadDatasets(true)
          }
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <RefreshCw
            size={16}
            className={
              isRefreshing
                ? "animate-spin"
                : ""
            }
          />

          {isRefreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* Upload */}
      <UploadDataset
        onUploadComplete={() =>
          loadDatasets(true)
        }
      />


      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm text-red-600">
            {error}
          </p>

        </div>
      )}


      {/* Stored Dataset Section */}
      <div className="rounded-xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              Stored Datasets
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Datasets persisted by the DataPilot backend.
            </p>

          </div>

          <Database
            size={22}
            className="text-gray-500"
          />

        </div>


        {/* Loading */}
        {isLoading && (
          <div className="mt-8 text-center">

            <p className="text-sm text-gray-500">
              Loading datasets...
            </p>

          </div>
        )}


        {/* Empty State */}
        {!isLoading &&
          datasets.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed p-10 text-center">

              <Database
                size={36}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-4 font-semibold">
                No datasets yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Upload a CSV file to create your first dataset.
              </p>

            </div>
          )}


        {/* Dataset Cards */}
        {!isLoading &&
          datasets.length > 0 && (

            <div className="mt-6 space-y-4">

              {datasets.map((dataset) => (
                <div key={dataset.id} className="space-y-3">
                  <div className="rounded-xl border p-5 transition hover:bg-gray-50">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* Dataset Identity */}
                      <div className="flex items-start gap-4">

                        <div className="rounded-lg bg-gray-100 p-3">

                          <FileText
                            size={22}
                            className="text-gray-600"
                          />

                        </div>


                        <div>

                          <h3 className="font-semibold">
                            {dataset.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {dataset.file_name}
                          </p>

                        </div>

                      </div>


                      {/* Dataset Statistics */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

                        <div className="flex items-center gap-2">

                          <Rows3
                            size={17}
                            className="text-gray-500"
                          />

                          <div>

                            <p className="text-xs text-gray-500">
                              Rows
                            </p>

                            <p className="text-sm font-semibold">
                              {dataset.total_rows.toLocaleString()}
                            </p>

                          </div>

                        </div>


                        <div className="flex items-center gap-2">

                          <Columns3
                            size={17}
                            className="text-gray-500"
                          />

                          <div>

                            <p className="text-xs text-gray-500">
                              Columns
                            </p>

                            <p className="text-sm font-semibold">
                              {dataset.total_columns.toLocaleString()}
                            </p>

                          </div>

                        </div>


                        <div>

                          <p className="text-xs text-gray-500">
                            Uploaded
                          </p>

                          <p className="text-sm font-semibold">
                            {new Date(
                              dataset.uploaded_at
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>

                    </div>
                  </div>

                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                    View Dataset →
                  </Link>
                </div>
              ))}

             

            </div>

            
          )}

      </div>

    </div>
  );
}