import {
  LayoutDashboard,
  Database,
  BarChart3,
  Bot,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-white">
      
      {/* Logo */}
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          DataPilot
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          AI Data Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        <a
          href="/dashboard"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a
          href="/datasets"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          <Database size={20} />
          Datasets
        </a>

        <a
          href="/analytics"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          <BarChart3 size={20} />
          Analytics
        </a>

        <a
          href="/ai"
          className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          <Bot size={20} />
          AI Analyst
        </a>

      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-gray-500">
          DataPilot v0.1
        </p>
      </div>

    </aside>
  );
}