import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CardDoc } from '../../types/models'
import { getBoardLabels } from './labels'

interface CardProps {
  card: CardDoc
  mode: 'edit' | 'readonly'
  onOpen: () => void
}

export function Card({ card, mode, onOpen }: CardProps) {
  const labels = getBoardLabels(card.ownerType)
  const sortable = useSortable({ id: card.id, disabled: mode === 'readonly' })
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(mode === 'edit' ? listeners : {})}
      onClick={onOpen}
      className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 shadow-sm hover:border-indigo-300 hover:shadow"
    >
      <p className="text-sm font-medium text-slate-800">{card.title}</p>
      {card.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{card.description}</p>
      )}
      <span
        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
          card.visibility === 'public'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        {card.visibility === 'public' ? labels.visibilityOnLabel : labels.visibilityOffLabel}
      </span>
    </div>
  )
}
