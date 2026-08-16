import { useState, type FormEvent } from 'react'

export function AddCardForm({
  label,
  onAdd,
}: {
  label: string
  onAdd: (title: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim())
    setTitle('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-200"
      >
        + {label}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false)
        }}
        placeholder="제목 입력"
        rows={2}
        className="resize-none rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-500"
        >
          추가
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md px-3 py-1 text-sm text-slate-500 hover:bg-slate-200"
        >
          취소
        </button>
      </div>
    </form>
  )
}
