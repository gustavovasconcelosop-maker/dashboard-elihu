'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { STATUS_COLORS } from '@/lib/utils'

type OrigemRow = {
  origem:        string
  realizadas:    number
  reagendadas:   number
  emAberto:      number
  naoRealizadas: number
  total:         number
}

type Props = { data: OrigemRow[] }

const BARS = [
  { key: 'realizadas',    label: 'Realizada',      color: STATUS_COLORS['Realizada']      },
  { key: 'reagendadas',   label: 'Reagendada',     color: STATUS_COLORS['Reagendada']     },
  { key: 'emAberto',      label: 'Em aberto',      color: STATUS_COLORS['Em aberto']      },
  { key: 'naoRealizadas', label: 'Não realizada',  color: STATUS_COLORS['Não realizada']  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0)
  return (
    <div className="bg-[#1C1C1C] border border-[#262626] rounded-xl p-3 shadow-xl text-sm font-manrope min-w-[180px]">
      <p className="text-gray-300 font-semibold mb-2 truncate max-w-[200px]">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-2 text-gray-400">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            {p.name}
          </span>
          <span className="text-gray-100 font-medium">{p.value}</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-[#333] flex justify-between text-gray-300">
        <span>Total</span>
        <span className="font-semibold">{total}</span>
      </div>
    </div>
  )
}

export default function OrigemChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-brand-muted text-sm font-manrope">
      Sem dados para exibir
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 16, left: 0, bottom: 60 }}
        barSize={18}
        barGap={2}
      >
        <CartesianGrid vertical={false} stroke="#1F1F1F" />
        <XAxis
          dataKey="origem"
          tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'var(--font-manrope)' }}
          tickLine={false}
          axisLine={false}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'var(--font-manrope)' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ paddingTop: 16, fontFamily: 'var(--font-manrope)', fontSize: 12 }}
          formatter={(v) => <span style={{ color: '#9CA3AF' }}>{v}</span>}
        />
        {BARS.map(b => (
          <Bar key={b.key} dataKey={b.key} name={b.label} stackId="a" fill={b.color} radius={b.key === 'realizadas' ? [0,0,4,4] : b.key === 'naoRealizadas' ? [4,4,0,0] : undefined} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
