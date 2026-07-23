import React from "react";
import { Bell } from "lucide-react";

// Notifications module has been removed. This component is a no-op placeholder.
export function NotificationDropdown() {
  return (
    <button
      disabled
      className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center opacity-40 cursor-default"
      title="Notifications unavailable"
    >
      <Bell className="w-3.5 h-3.5 text-gray-400" />
    </button>
  );
}
