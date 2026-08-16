import { useState, type FormEvent } from 'react'

export function AddListForm({ label, onAdd }: { label: string; onAdd: (title: string) => void }) {
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
        className="h-fit w-64 shrink-0 rounded-lg border-2 border-dashed border-slate-300 px-3 py-2 text-left text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
      >
        + {label}
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit w-64 shrink-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false)
        }}
        placeholder="목록 이름"
        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="mt-2 flex gap-2">
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
