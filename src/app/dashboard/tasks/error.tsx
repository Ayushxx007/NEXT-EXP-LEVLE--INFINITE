'use client'

export default function Error({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <p className="text-red-500 mb-4">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Try again
      </button>
    </div>
  )
}