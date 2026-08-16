import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { CardDoc, ListDoc } from '../../types/models'
import { Card } from './Card'
import { AddCardForm } from './AddCardForm'
import { getBoardLabels } from './labels'

interface ListProps {
  list: ListDoc
  cards: CardDoc[]
  mode: 'edit' | 'readonly'
  onAddCard: (title: string) => void
  onDeleteList: () => void
  onOpenCard: (card: CardDoc) => void
}

export function List({ list, cards, mode, onAddCard, onDeleteList, onOpenCard }: ListProps) {
  const labels = getBoardLabels(list.ownerType)
  const { setNodeRef } = useDroppable({ id: list.id, disabled: mode === 'readonly' })

  return (
    <div className="flex h-fit w-64 shrink-0 flex-col rounded-lg bg-slate-100 p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-700">{list.title}</h3>
        {mode === 'edit' && (
          <button
            onClick={onDeleteList}
            className="text-xs text-slate-400 hover:text-red-500"
            aria-label="목록 삭제"
          >
            삭제
          </button>
        )}
      </div>
      <div ref={setNodeRef} className="flex min-h-8 flex-col gap-2">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} mode={mode} onOpen={() => onOpenCard(card)} />
          ))}
        </SortableContext>
      </div>
      {mode === 'edit' && (
        <div className="mt-2">
          <AddCardForm label={labels.addCardLabel} onAdd={onAddCard} />
        </div>
      )}
    </div>
  )
}
