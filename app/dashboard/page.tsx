import BackendStatus from "@/components/dashboard/BackendStatus";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div>
        <h1 className="text-3xl font-bold">
          DataPilot
        </h1>

        <p className="mt-2 text-gray-500">
          AI-powered data intelligence platform
        </p>
      </div>

      <BackendStatus />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Total Datasets
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            AI Queries
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Reports Generated
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

      </div>
    </main>
  );
}