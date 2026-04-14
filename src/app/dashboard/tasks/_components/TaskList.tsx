'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleTask, deleteTask } from '@/lib/actions'
import type { Task } from '@prisma/client'

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, updateOptimistic] = useOptimistic(
    tasks,
    (state, { id, completed }: { id: string; completed: boolean }) =>
      state.map(t => t.id === id ? { ...t, completed } : t)
  )
  const [, startTransition] = useTransition()

  function handleToggle(task: Task) {
    startTransition(async () => {
      // Optimistic update — UI changes instantly before server confirms
      updateOptimistic({ id: task.id, completed: !task.completed })
      await toggleTask(task.id)
    })
  }

  if (optimisticTasks.length === 0) {
    return <p className="text-gray-400 text-center py-12">No tasks yet. Add one above!</p>
  }

  return (
    <ul className="space-y-3">
      {optimisticTasks.map(task => (
        <li key={task.id} className="flex items-center gap-3 p-4 border rounded-lg bg-white">
          <input type="checkbox" checked={task.completed}
            onChange={() => handleToggle(task)}
            className="w-4 h-4 accent-blue-600 cursor-pointer" />

          <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </span>

          <form action={deleteTask.bind(null, task.id)}>
            <button type="submit" className="text-red-400 hover:text-red-600 text-sm">
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}