import { Visita } from './supabase'

// ─── Equipes ────────────────────────────────────────────────────────────────

export const TEAM_FORTALEZA_NAMES = [
  'amanda', 'italo', 'herica', 'bruna', 'diogo',
  'emília', 'emilia', 'fabiolarita', 'torres neto',
  'zoti', 'guilherme', 'julia', 'mauricio', 'max',
]

const EXCLUDED_NAMES = ['joão paulo', 'joao paulo']

export type Equipe = 'Fortaleza' | 'Eusébio'

export function getEquipe(responsavel: string | null): Equipe | null {
  if (!responsavel) return null
  const lower = responsavel.toLowerCase().trim()
  if (EXCLUDED_NAMES.some(e => lower.includes(e))) return null
  if (TEAM_FORTALEZA_NAMES.some(f => lower === f || lower.includes(f))) return 'Fortaleza'
  return 'Eusébio'
}

// ─── Status ──────────────────────────────────────────────────────────────────

export type Status = 'Realizada' | 'Reagendada' | 'Em aberto' | 'Não realizada' | 'Outro'

export const STATUS_LIST: Status[] = ['Realizada', 'Reagendada', 'Em aberto', 'Não realizada']

export function normalizeStatus(s: string | null): Status {
  if (!s) return 'Outro'
  const lower = s.toLowerCase().trim()
  if (lower.includes('realizada') && !lower.includes('não') && !lower.includes('nao')) return 'Realizada'
  if (lower.includes('reagendada')) return 'Reagendada'
  if (lower.includes('aberto') || lower.includes('aberta')) return 'Em aberto'
  if (lower.includes('não realizada') || lower.includes('nao realizada')) return 'Não realizada'
  return 'Outro'
}

export const STATUS_COLORS: Record<Status, string> = {
  'Realizada':      '#10B981',
  'Reagendada':     '#FBBF24',
  'Em aberto':      '#3B82F6',
  'Não realizada':  '#EF4444',
  'Outro':          '#6B7280',
}

export const STATUS_BG: Record<Status, string> = {
  'Realizada':      'rgba(16,185,129,0.15)',
  'Reagendada':     'rgba(251,191,36,0.15)',
  'Em aberto':      'rgba(59,130,246,0.15)',
  'Não realizada':  'rgba(239,68,68,0.15)',
  'Outro':          'rgba(107,114,128,0.15)',
}

// ─── Date ────────────────────────────────────────────────────────────────────

/** Parses "14:00 02/01/2026" → Date or null */
export function parseDataVisita(raw: string | null): Date | null {
  if (!raw) return null
  const match = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (!match) return null
  const [, day, month, year] = match
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

// ─── Status count shape ───────────────────────────────────────────────────────

export type StatusCount = {
  realizadas:    number
  reagendadas:   number
  emAberto:      number
  naoRealizadas: number
  total:         number
}

export function emptyCount(): StatusCount {
  return { realizadas: 0, reagendadas: 0, emAberto: 0, naoRealizadas: 0, total: 0 }
}

export function addToCount(acc: StatusCount, status: Status): StatusCount {
  const next = { ...acc }
  if (status === 'Realizada')     next.realizadas++
  if (status === 'Reagendada')    next.reagendadas++
  if (status === 'Em aberto')     next.emAberto++
  if (status === 'Não realizada') next.naoRealizadas++
  next.total++
  return next
}

// ─── Aggregations ────────────────────────────────────────────────────────────

export function calcMetrics(data: Visita[]): StatusCount {
  return data.reduce((acc, v) => addToCount(acc, normalizeStatus(v.status_visita)), emptyCount())
}

export function groupByOrigem(data: Visita[]): { origem: string; counts: StatusCount }[] {
  const map: Record<string, StatusCount> = {}
  for (const v of data) {
    const origem = v.origem?.trim() || 'Não informado'
    if (!map[origem]) map[origem] = emptyCount()
    map[origem] = addToCount(map[origem], normalizeStatus(v.status_visita))
  }
  return Object.entries(map)
    .map(([origem, counts]) => ({ origem, counts }))
    .sort((a, b) => b.counts.total - a.counts.total)
}

export type BrokerStats = {
  nome:   string
  equipe: Equipe
  total:  StatusCount
  origens: { origem: string; counts: StatusCount }[]
}

export function groupByBroker(data: Visita[]): BrokerStats[] {
  const map: Record<string, { equipe: Equipe; visitas: Visita[] }> = {}

  for (const v of data) {
    const nome = v.responsavel?.trim() || 'Desconhecido'
    const equipe = getEquipe(nome)
    if (!equipe) continue // exclui João Paulo e sem responsável
    if (!map[nome]) map[nome] = { equipe, visitas: [] }
    map[nome].visitas.push(v)
  }

  return Object.entries(map)
    .map(([nome, { equipe, visitas }]) => ({
      nome,
      equipe,
      total:  calcMetrics(visitas),
      origens: groupByOrigem(visitas),
    }))
    .sort((a, b) => b.total.total - a.total.total)
}
