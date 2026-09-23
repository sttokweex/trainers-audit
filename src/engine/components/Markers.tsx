import type { Mark } from '@/engine/types'

/** Кнопки «знаю / повторить» — повторный клик снимает отметку. */
export function Markers({
  mark, onToggle,
}: {
  mark: Mark | undefined
  onToggle: (m: Mark) => void
}) {
  return (
    <div className="marks">
      <button
        type="button"
        className={'mk' + (mark === 'know' ? ' on-k' : '')}
        aria-pressed={mark === 'know'}
        onClick={() => onToggle('know')}
      >
        ✓ Знаю{mark === 'know' ? ' · выбрано' : ''}
      </button>
      <button
        type="button"
        className={'mk' + (mark === 'repeat' ? ' on-r' : '')}
        aria-pressed={mark === 'repeat'}
        onClick={() => onToggle('repeat')}
      >
        ↻ Повторить{mark === 'repeat' ? ' · выбрано' : ''}
      </button>
    </div>
  )
}
