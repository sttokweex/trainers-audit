import { useCallback, useEffect, useState } from 'react'
import type { ContentPack, Mark } from '@/engine/types'

type Flags = Record<string, boolean>
type Marks = Record<string, Mark>

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

const save = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* хранилище может быть недоступно */ }
}

export function useProgress(pack: ContentPack) {
  const prefix = pack.storagePrefix
  const keys = {
    marks: `${prefix}:marks`,
    reveal: `${prefix}:reveal`,
    cards: `${prefix}:cards`,
    plan: `${prefix}:plan`,
  }

  const [marks, setMarks] = useState<Marks>(() => read(keys.marks, {}))
  const [cardsKnown, setCardsKnown] = useState<Flags>(() => read(keys.cards, {}))
  const [planDone, setPlanDone] = useState<Flags>(() => read(keys.plan, {}))
  const [reveal, setReveal] = useState(() => {
    try { return localStorage.getItem(keys.reveal) !== 'hide' } catch { return true }
  })

  useEffect(() => { save(keys.marks, marks) }, [keys.marks, marks])
  useEffect(() => { save(keys.cards, cardsKnown) }, [keys.cards, cardsKnown])
  useEffect(() => { save(keys.plan, planDone) }, [keys.plan, planDone])
  useEffect(() => {
    try { localStorage.setItem(keys.reveal, reveal ? 'show' : 'hide') } catch { /* ignore */ }
  }, [keys.reveal, reveal])

  const toggleMark = useCallback((id: string, mark: Mark) => {
    setMarks((previous) => {
      const next = { ...previous }
      if (next[id] === mark) delete next[id]
      else next[id] = mark
      return next
    })
  }, [])

  const toggleCard = useCallback((term: string) => {
    setCardsKnown((previous) => {
      const next = { ...previous }
      if (next[term]) delete next[term]
      else next[term] = true
      return next
    })
  }, [])

  const togglePlan = useCallback((key: string, value: boolean) => {
    setPlanDone((previous) => ({ ...previous, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setMarks({})
    setCardsKnown({})
    setPlanDone({})
    try { localStorage.removeItem('audit-trainer-exam-progress-v1') } catch { /* ignore */ }
    try { localStorage.removeItem('audit-trainer-exam-cards-v1') } catch { /* ignore */ }
    window.dispatchEvent(new Event('audit-trainer-progress-reset'))
  }, [])

  const known = Object.values(marks).filter((mark) => mark === 'know').length
  const repeat = Object.values(marks).filter((mark) => mark === 'repeat').length

  return {
    marks, toggleMark, cardsKnown, toggleCard, planDone, togglePlan,
    reset, reveal, setReveal, known, repeat,
  }
}
