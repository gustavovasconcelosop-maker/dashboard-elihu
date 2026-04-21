'use client'

import { Equipe } from '@/lib/utils'

export type Filters = {
  equipe:  'Todas' | Equipe
  dateFrom: string
  dateTo:   string
  origem:   string
}

type Props = {
  filters:   Filters
  origens:   string[]
  onChange:  (f: Filters) => void
  onClear:   () => void
  total:     number
}

const inputCls = `
  bg-brand-card2 border border-brand-border text-sm text-gray-200
  rounded-xl px-3 py-2 outline-none focus:border-brand-accent
  transition-colors duration-150 font-manrope
`

export default function FiltersBar({ filters, origens, onChange, onClear, total }: Props) {
  const set = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    onChange({ ...filters, [key]: e.target.value })

  const hasFilters =
    filters.equipe !== 'Todas' ||
    filters.dateFrom !== '' ||
    filters.dateTo   !== '' ||
    filters.origem   !== ''

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-4 flex flex-wrap gap-3 items-center">
      {/* Equipe */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-brand-muted font-manrope">Equipe</label>
        <select className={inputCls} value={filters.equipe} onChange={set('equipe')}>
          <option value="Todas">Todas</option>
          <option value="Fortaleza">Fortaleza</option>
          <option value="Eusébio">Eusébio</option>
        </select>
      </div>

      {/* De */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-brand-muted font-manrope">De</label>
        <input
          type="date"
          className={inputCls}
          value={filters.dateFrom}
          onChange={set('dateFrom')}
        />
      </div>

      {/* Até */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-brand-muted font-manrope">Até</label>
        <input
          type="date"
          className={inputCls}
          value={filters.dateTo}
          onChange={set('dateTo')}
        />
      </div>

      {/* Origem */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-brand-muted font-manrope">Origem do Lead</label>
        <select className={inputCls} value={filters.origem} onChange={set('origem')}>
          <option value="">Todas as origens</option>
          {origens.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Spacer + info + clear */}
      <div className="ml-auto flex items-end gap-3 pb-0.5">
        <span className="text-sm text-brand-muted font-manrope">
          <span className="text-gray-200 font-semibold">{total.toLocaleString('pt-BR')}</span> visitas
        </span>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-brand-accent hover:text-white border border-brand-accent/30 hover:border-brand-accent
                       px-3 py-1.5 rounded-lg transition-colors duration-150 font-manrope"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
