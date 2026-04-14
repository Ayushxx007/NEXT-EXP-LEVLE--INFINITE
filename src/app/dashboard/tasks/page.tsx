import { verifySession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import TaskList from '@/app/dashboard/tasks/_components/TaskList'
import CreateTaskForm from '@/app/dashboard/tasks/_components/CreateTaskForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Tasks' }

// This runs on the SERVER — no useEffect, no loading state needed
export default async function TasksPage() {
  const session = await verifySession()
  if (!session) redirect('/auth/login')// Belt-and-suspenders (middleware handles this too)

  const tasks = await prisma.task.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Tasks</h1>
      <CreateTaskForm />
      <TaskList tasks={tasks} />
    </div>
  )
}