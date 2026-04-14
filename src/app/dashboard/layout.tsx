import LogoutButton from './_components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">NexCore</span>
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="/dashboard/tasks" className="text-sm text-gray-600 hover:text-gray-900">Tasks</a>
          <LogoutButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}