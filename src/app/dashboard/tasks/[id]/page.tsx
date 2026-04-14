import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

// Generates static params at build time (optional — great for SSG)
export async function generateStaticParams() {
  const tasks = await prisma.task.findMany({ select: { id: true } })
  return tasks.map(t => ({ id: t.id }))
}

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const task = await prisma.task.findFirst({
    where: { id: params.id, userId: session.userId },
  })

  if (!task) notFound()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">{task.title}</h1>
      <p className="text-gray-500 mt-2">{task.description ?? 'No description'}</p>
      <span className={`mt-4 inline-block px-3 py-1 rounded-full text-sm ${
        task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {task.completed ? 'Completed' : 'Pending'}
      </span>
    </div>
  )
}