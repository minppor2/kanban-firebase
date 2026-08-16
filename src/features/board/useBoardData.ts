import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../lib/firebase'
import type { CardDoc, ListDoc, OwnerType, Visibility } from '../../types/models'
import { orderForPosition } from './reorder'

export interface BoardScope {
  classId: string
  ownerId: string
  ownerType: OwnerType
  /** Readonly viewers (teacher looking at a student, student looking at announcements)
   *  only ever see public cards — scoped at the query level, not just hidden in the UI. */
  onlyPublic?: boolean
}

export interface BoardColumn {
  list: ListDoc
  cards: CardDoc[]
}

export function useBoardData(scope: BoardScope) {
  const [lists, setLists] = useState<ListDoc[]>([])
  const [cards, setCards] = useState<CardDoc[]>([])
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)

  const { classId, ownerId, ownerType, onlyPublic } = scope

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const listsQuery = query(
      collection(db, 'lists'),
      where('classId', '==', classId),
      where('ownerId', '==', ownerId),
      where('ownerType', '==', ownerType),
    )
    const unsubLists = onSnapshot(listsQuery, (snap) => {
      setLists(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ListDoc))
      setIsLoading(false)
    })

    const cardFilters = [
      where('classId', '==', classId),
      where('ownerId', '==', ownerId),
      where('ownerType', '==', ownerType),
      ...(onlyPublic ? [where('visibility', '==', 'public')] : []),
    ]
    const cardsQuery = query(collection(db, 'cards'), ...cardFilters)
    const unsubCards = onSnapshot(cardsQuery, (snap) => {
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CardDoc))
    })

    return () => {
      unsubLists()
      unsubCards()
    }
  }, [classId, ownerId, ownerType, onlyPublic])

  const columns: BoardColumn[] = useMemo(() => {
    const sortedLists = [...lists].sort((a, b) => a.order - b.order)
    return sortedLists.map((list) => ({
      list,
      cards: cards.filter((c) => c.listId === list.id).sort((a, b) => a.order - b.order),
    }))
  }, [lists, cards])

  async function addList(title: string) {
    const existingOrders = lists.map((l) => l.order).sort((a, b) => a - b)
    await addDoc(collection(db, 'lists'), {
      classId,
      ownerId,
      ownerType,
      title,
      order: orderForPosition(existingOrders, existingOrders.length),
      createdAt: Date.now(),
    })
  }

  async function deleteList(listId: string) {
    const cardsInList = cards.filter((c) => c.listId === listId)
    await Promise.all(cardsInList.map((c) => deleteDoc(doc(db, 'cards', c.id))))
    await deleteDoc(doc(db, 'lists', listId))
  }

  async function addCard(listId: string, title: string) {
    const siblingOrders = cards
      .filter((c) => c.listId === listId)
      .map((c) => c.order)
      .sort((a, b) => a - b)
    const now = Date.now()
    await addDoc(collection(db, 'cards'), {
      listId,
      classId,
      ownerId,
      ownerType,
      title,
      description: '',
      order: orderForPosition(siblingOrders, siblingOrders.length),
      visibility: 'private',
      createdAt: now,
      updatedAt: now,
    })
  }

  async function updateCard(
    cardId: string,
    patch: Partial<Pick<CardDoc, 'title' | 'description' | 'visibility'>>,
  ) {
    await updateDoc(doc(db, 'cards', cardId), { ...patch, updatedAt: Date.now() })
  }

  async function deleteCard(cardId: string) {
    await deleteDoc(doc(db, 'cards', cardId))
  }

  async function toggleCardVisibility(card: CardDoc) {
    const next: Visibility = card.visibility === 'public' ? 'private' : 'public'
    await updateCard(card.id, { visibility: next })
  }

  async function moveCard(cardId: string, targetListId: string, newOrder: number) {
    await updateDoc(doc(db, 'cards', cardId), {
      listId: targetListId,
      order: newOrder,
      updatedAt: Date.now(),
    })
  }

  return {
    columns,
    isLoading,
    addList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    toggleCardVisibility,
    moveCard,
  }
}
