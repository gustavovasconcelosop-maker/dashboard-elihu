'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase, Visita } from '@/lib/supabase'
import {
  calcMetrics, groupByOrigem, groupByBroker,
  getEquipe, parseDataVisita, STATUS_COLORS, STATUS_BG,
} from '@/lib/utils'
import MetricCard   from './MetricCard'
import FiltersBar, { Filters } from './FiltersBar'
import OrigemChart  from './OrigemChart'
import BrokerSection from './BrokerSection'

// ─── Elihu Logo ───────────────────────────────────────────────────────────────
function ElihuLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-baseline font-poppins font-bold text-3xl leading-none tracking-tight text-white">
        el
        {/* "i" com quadrado laranja no lugar do ponto */}
        <span className="relative inline-block">
          <span className="relative" style={{ color: 'white' }}>i</span>
          <span
            className="absolute"
            style={{
              width: 5, height: 5,
              background: '#FF9F00',
              borderRadius: 1,
              top: -1, left: '50%',
              transform: 'translateX(-50%) translateY(-7px)',
            }}
          />
        </span>
        hu
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-poppins font-semibold tracking-[0.2em] text-brand-accent uppercase">
          imóveis
        </span>
        <span className="text-[7px] font-manrope text-brand-muted tracking-widest uppercase mt-0.5">
          dashboard
        </span>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <h2 className="text-lg font-poppins font-bold text-gray-100">{children}</h2>
      {sub && <span className="text-sm text-brand-muted font-manrope">{sub}</span>}
      <div className="flex-1 h-px bg-brand-border ml-2" />
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-brand-card rounded-2xl border border-brand-border p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ElihuLogo />
        <div className="flex gap-1.5 mt-4">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-brand-accent animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className="text-brand-muted text-sm font-manrope">Carregando dados…</span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const DEFAULT_FILTERS: Filters = { equipe: 'Todas', dateFrom: '', dateTo: '', origem: '' }

export default function DashboardClient() {
  const [data,    setData]    = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [tab,     setTab]     = useState<'geral' | 'corretor'>('geral')

  // Fetch
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: rows, error: err } = await supabase
        .from('relatorio_visitas')
        .select('*')
      if (err) { setError(err.message); setLoading(false); return }
      setData(rows ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // All origins (for filter select)
  const allOrigens = useMemo(() => {
    const set = new Set<string>()
    data.forEach(v => { if (v.origem) set.add(v.origem.trim()) })
    return Array.from(set).sort()
  }, [data])

  // Filtered data
  const filtered = useMemo(() => {
    return data.filter(v => {
      // Exclude João Paulo always
      const equipe = getEquipe(v.responsavel)
      if (!equipe) return false

      // Team filter
      if (filters.equipe !== 'Todas' && equipe !== filters.equipe) return false

      // Date filter
      if (filters.dateFrom || filters.dateTo) {
        const d = parseDataVisita(v.data_visita)
        if (!d) return false
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom + 'T00:00:00')
          if (d < from) return false
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo + 'T23:59:59')
          if (d > to) return false
        }
      }

      // Origem filter
      if (filters.origem && (v.origem?.trim() || '') !== filters.origem) return false

      return true
    })
  }, [data, filters])

  const metrics  = useMemo(() => calcMetrics(filtered),       [filtered])
  const origens  = useMemo(() => groupByOrigem(filtered),     [filtered])
  const brokers  = useMemo(() => groupByBroker(filtered),     [filtered])

  const origemChartData = origens.map(({ origem, counts }) => ({
    origem,
    realizadas:    counts.realizadas,
    reagendadas:   counts.reagendadas,
    emAberto:      counts.emAberto,
    naoRealizadas: counts.naoRealizadas,
    total:         counts.total,
  }))

  if (loading) return <Skeleton />
  if (error) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-red-400 text-sm font-manrope">Erro ao carregar dados: {error}</div>
    </div>
  )

  const METRIC_CARDS = [
    {
      label: 'Realizadas',
      value: metrics.realizadas,
      color: STATUS_COLORS['Realizada'],
      bg:    STATUS_BG['Realizada'],
      icon:  <CheckIcon />,
    },
    {
      label: 'Reagendadas',
      value: metrics.reagendadas,
      color: STATUS_COLORS['Reagendada'],
      bg:    STATUS_BG['Reagendada'],
      icon:  <ClockIcon />,
    },
    {
      label: 'Em aberto',
      value: metrics.emAberto,
      color: STATUS_COLORS['Em aberto'],
      bg:    STATUS_BG['Em aberto'],
      icon:  <CircleIcon />,
    },
    {
      label: 'Não realizadas',
      value: metrics.naoRealizadas,
      color: STATUS_COLORS['Não realizada'],
      bg:    STATUS_BG['Não realizada'],
      icon:  <XIcon />,
    },
  ]

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-brand-bg/90 backdrop-blur border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <ElihuLogo />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-brand-muted font-manrope">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#10B981' }}
              title="Conectado ao Supabase"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Filters */}
        <FiltersBar
          filters={filters}
          origens={allOrigens}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          total={filtered.length}
        />

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-card rounded-xl p-1 w-fit border border-brand-border">
          {(['geral', 'corretor'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                px-4 py-2 rounded-lg text-sm font-manrope font-medium transition-all duration-150
                ${tab === t
                  ? 'bg-brand-accent text-black'
                  : 'text-brand-muted hover:text-gray-200'}
              `}
            >
              {t === 'geral' ? 'Visão Geral' : 'Por Corretor'}
            </button>
          ))}
        </div>

        {tab === 'geral' && (
          <div className="space-y-6 animate-fade-in">
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {METRIC_CARDS.map((c, i) => (
                <MetricCard key={c.label} {...c} delay={i * 80} />
              ))}
            </div>

            {/* Total badge */}
            <div className="flex items-center gap-2">
              <span className="text-brand-muted text-sm font-manrope">Total de visitas:</span>
              <span
                className="text-sm font-poppins font-bold px-3 py-0.5 rounded-full"
                style={{ background: 'rgba(255,159,0,0.15)', color: '#FF9F00' }}
              >
                {metrics.total.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Origem chart */}
            <Card>
              <SectionTitle sub={`${origens.length} origens`}>
                Visitas por Origem do Lead
              </SectionTitle>
              <OrigemChart data={origemChartData} />
            </Card>

            {/* Origem table */}
            <Card>
              <SectionTitle>Detalhamento por Origem</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="border-b border-brand-border">
                    <tr>
                      {['Origem', 'Total', 'Realizadas', 'Reagendadas', 'Em aberto', 'Não realizadas'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-manrope font-semibold text-brand-muted uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {origens.map(({ origem, counts }) => (
                      <tr key={origem} className="border-b border-brand-border/50 hover:bg-brand-card2 transition-colors">
                        <td className="px-4 py-2.5 text-sm font-manrope text-gray-200">{origem}</td>
                        <td className="px-4 py-2.5 text-sm font-manrope font-semibold text-gray-100">{counts.total}</td>
                        <td className="px-4 py-2.5 text-sm font-manrope" style={{ color: STATUS_COLORS['Realizada'] }}>{counts.realizadas}</td>
                        <td className="px-4 py-2.5 text-sm font-manrope" style={{ color: STATUS_COLORS['Reagendada'] }}>{counts.reagendadas}</td>
                        <td className="px-4 py-2.5 text-sm font-manrope" style={{ color: STATUS_COLORS['Em aberto'] }}>{counts.emAberto}</td>
                        <td className="px-4 py-2.5 text-sm font-manrope" style={{ color: STATUS_COLORS['Não realizada'] }}>{counts.naoRealizadas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === 'corretor' && (
          <div className="space-y-6 animate-fade-in">
            {/* Metric cards (same but filtered) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {METRIC_CARDS.map((c, i) => (
                <MetricCard key={c.label} {...c} delay={i * 80} />
              ))}
            </div>

            <Card>
              <SectionTitle sub={`${brokers.length} corretores`}>
                Desempenho por Corretor
              </SectionTitle>
              <BrokerSection brokers={brokers} />
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-brand-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <ElihuLogo />
          <p className="text-xs text-brand-muted font-manrope">
            Dados sincronizados via Supabase · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const CheckIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ClockIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const CircleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const XIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
