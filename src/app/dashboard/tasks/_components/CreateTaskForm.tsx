'use client'

import { useRef, useTransition } from 'react'
import { createTask } from '@/lib/actions'

export default function CreateTaskForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createTask(formData)
      formRef.current?.reset() // clear form after creation
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 mb-6">
      <input name="title" placeholder="New task..." required
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {isPending ? '...' : 'Add'}
      </button>
    </form>
  )
}