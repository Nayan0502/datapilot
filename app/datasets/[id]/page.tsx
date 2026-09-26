"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  Database,
  FileText,
  Hash,
  Columns3,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { getDataset, Dataset } from "@/lib/api";

type DatasetDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function DatasetDetailsPage({
  params,
}: DatasetDetailsPageProps) {
  const { id } = use(params);

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDataset() {
      try {
        setIsLoading(true);
        setError("");

        const datasetId = Number(id);

        if (Number.isNaN(datasetId)) {
          throw new Error("Invalid dataset ID.");
        }

        const data = await getDataset(datasetId);
        setDataset(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dataset."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDataset();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">
            Loading dataset...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="p-6">
        <Link
          href="/datasets"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Datasets
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900">
                Unable to load dataset
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "Dataset not found."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const uploadedDate = new Date(dataset.uploaded_at);

  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <Link
        href="/datasets"
        className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Datasets
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Database className="h-7 w-7 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {dataset.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Dataset ID: #{dataset.id}
            </p>
          </div>
        </div>
      </div>

      {/* Dataset statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Rows
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {dataset.total_rows.toLocaleString()}
              </p>
            </div>

            <Hash className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Columns
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {dataset.total_columns}
              </p>
            </div>

            <Columns3 className="h-6 w-6 text-purple-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                File Type
              </p>

              <p className="mt-2 text-2xl font-bold uppercase text-gray-900">
                CSV
              </p>
            </div>

            <FileText className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Uploaded
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {uploadedDate.toLocaleDateString()}
              </p>
            </div>

            <Calendar className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Dataset information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Dataset Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Basic information about this stored dataset.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Dataset Name
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {dataset.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Original File
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {dataset.file_name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Rows
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {dataset.total_rows.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Columns
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {dataset.total_columns}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Uploaded At
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {uploadedDate.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis placeholder */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Dataset Analysis
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Detailed profiling, data quality checks, and
          analytics will appear here.
        </p>

        <div className="mt-6 rounded-lg border border-dashed bg-gray-50 p-10 text-center">
          <Database className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 font-medium text-gray-700">
            Analysis coming next
          </p>

          <p className="mt-1 text-sm text-gray-500">
            The next step is to display the actual stored CSV
            data and connect the analysis engine.
          </p>
        </div>
      </div>
    </div>
  );
}