import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await verifySession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { _count: { select: { tasks: true } } },
  })

  const completedCount = await prisma.task.count({
    where: { userId: session.userId, completed: true },
  })

  const totalCount = user?._count.tasks ?? 0

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-gray-500 mb-8">Here's what's going on with your tasks.</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-6 border rounded-xl bg-white">
          <p className="text-sm text-gray-500 mb-1">Total tasks</p>
          <p className="text-3xl font-semibold">{totalCount}</p>
        </div>
        <div className="p-6 border rounded-xl bg-white">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-3xl font-semibold text-green-600">{completedCount}</p>
        </div>
      </div>

      <Link
        href="/dashboard/tasks"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Tasks →
      </Link>
    </div>
  )
}