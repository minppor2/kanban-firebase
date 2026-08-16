import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import type { BoardScope } from './useBoardData'
import { useBoardData } from './useBoardData'
import { List } from './List'
import { AddListForm } from './AddListForm'
import { Card } from './Card'
import { CardDetailModal } from './CardDetailModal'
import { getBoardLabels } from './labels'
import { orderForPosition } from './reorder'
import type { CardDoc } from '../../types/models'

interface BoardPageProps extends BoardScope {
  mode: 'edit' | 'readonly'
  emptyMessage?: string
}

export function BoardPage({ mode, emptyMessage, ...scope }: BoardPageProps) {
  const {
    columns,
    isLoading,
    addList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    toggleCardVisibility,
    moveCard,
  } = useBoardData(scope)
  const labels = getBoardLabels(scope.ownerType)
  const [openCardId, setOpenCardId] = useState<string | null>(null)
  const [activeDragCard, setActiveDragCard] = useState<CardDoc | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const allCards = useMemo(() => columns.flatMap((c) => c.cards), [columns])
  const openCard = allCards.find((c) => c.id === openCardId) ?? null

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragCard(null)
    const { active, over } = event
    if (!over) return

    const activeCard = allCards.find((c) => c.id === active.id)
    if (!activeCard) return

    const isOverList = columns.some((c) => c.list.id === over.id)
    const targetListId = isOverList
      ? (over.id as string)
      : (allCards.find((c) => c.id === over.id)?.listId ?? activeCard.listId)

    const siblingCards = (columns.find((c) => c.list.id === targetListId)?.cards ?? []).filter(
      (c) => c.id !== activeCard.id,
    )
    const overIndex = isOverList ? siblingCards.length : siblingCards.findIndex((c) => c.id === over.id)
    const insertIndex = overIndex === -1 ? siblingCards.length : overIndex

    const newOrder = orderForPosition(
      siblingCards.map((c) => c.order),
      insertIndex,
    )
    moveCard(activeCard.id, targetListId, newOrder)
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">불러오는 중...</p>
  }

  if (mode === 'readonly' && columns.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage ?? '표시할 내용이 없습니다.'}</p>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveDragCard(allCards.find((c) => c.id === e.active.id) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDragCard(null)}
    >
      <div className="flex items-start gap-3 overflow-x-auto pb-4">
        {columns.map(({ list, cards }) => (
          <List
            key={list.id}
            list={list}
            cards={cards}
            mode={mode}
            onAddCard={(title) => addCard(list.id, title)}
            onDeleteList={() => deleteList(list.id)}
            onOpenCard={(card) => setOpenCardId(card.id)}
          />
        ))}
        {mode === 'edit' && <AddListForm label={labels.addListLabel} onAdd={addList} />}
      </div>

      <DragOverlay>
        {activeDragCard && <Card card={activeDragCard} mode="edit" onOpen={() => {}} />}
      </DragOverlay>

      {openCard && (
        <CardDetailModal
          card={openCard}
          mode={mode}
          onClose={() => setOpenCardId(null)}
          onSave={(patch) => updateCard(openCard.id, patch)}
          onToggleVisibility={() => toggleCardVisibility(openCard)}
          onDelete={() => {
            deleteCard(openCard.id)
            setOpenCardId(null)
          }}
        />
      )}
    </DndContext>
  )
}
