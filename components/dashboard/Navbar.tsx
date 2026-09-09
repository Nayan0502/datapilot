import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div>
        <h2 className="text-lg font-semibold">
          Dashboard
        </h2>

        <p className="text-xs text-gray-500">
          Overview of your data
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="rounded-lg p-2 hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <User size={18} />
          </div>

          <span className="text-sm font-medium">
            User
          </span>
        </div>

      </div>

    </header>
  );
}