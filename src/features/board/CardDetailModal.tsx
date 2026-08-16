import { useState } from 'react'
import type { CardDoc } from '../../types/models'
import { getBoardLabels } from './labels'

interface CardDetailModalProps {
  card: CardDoc
  mode: 'edit' | 'readonly'
  onClose: () => void
  onSave: (patch: { title: string; description: string }) => void
  onToggleVisibility: () => void
  onDelete: () => void
}

export function CardDetailModal({
  card,
  mode,
  onClose,
  onSave,
  onToggleVisibility,
  onDelete,
}: CardDetailModalProps) {
  const labels = getBoardLabels(card.ownerType)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)
  const isReadonly = mode === 'readonly'

  function handleClose() {
    if (!isReadonly && (title !== card.title || description !== card.description)) {
      onSave({ title: title.trim() || card.title, description })
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isReadonly ? (
          <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
        ) : (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-transparent px-1 text-lg font-semibold text-slate-900 focus:border-slate-300 focus:outline-none"
          />
        )}

        {isReadonly ? (
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
            {card.description || '내용 없음'}
          </p>
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={5}
            className="mt-3 w-full resize-none rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        )}

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              card.visibility === 'public'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {card.visibility === 'public' ? labels.visibilityOnLabel : labels.visibilityOffLabel}
          </span>

          {!isReadonly && (
            <div className="flex gap-2">
              <button
                onClick={onToggleVisibility}
                className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
              >
                {card.visibility === 'public' ? labels.toggleToPrivate : labels.toggleToPublic}
              </button>
              <button
                onClick={onDelete}
                className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="mt-5 w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
