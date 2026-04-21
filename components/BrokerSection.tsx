'use client'

import { useState } from 'react'
import { BrokerStats, STATUS_COLORS } from '@/lib/utils'

type Props = { brokers: BrokerStats[] }

function StatusDot({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5" title={label}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="font-manrope font-medium" style={{ color }}>{value}</span>
    </span>
  )
}

function BrokerRow({ broker, index }: { broker: BrokerStats; index: number }) {
  const [open, setOpen] = useState(false)
  const { nome, equipe, total, origens } = broker

  return (
    <>
      <tr
        className="border-b border-brand-border hover:bg-brand-card2 transition-colors cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-brand-border text-xs text-brand-muted font-poppins font-semibold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-manrope font-semibold text-gray-100">{nome}</p>
              <p className="text-xs text-brand-muted">{equipe}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="text-sm font-manrope font-semibold text-gray-200">{total.total}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <StatusDot color={STATUS_COLORS['Realizada']} value={total.realizadas} label="Realizadas" />
        </td>
        <td className="px-4 py-3 text-center">
          <StatusDot color={STATUS_COLORS['Reagendada']} value={total.reagendadas} label="Reagendadas" />
        </td>
        <td className="px-4 py-3 text-center">
          <StatusDot color={STATUS_COLORS['Em aberto']} value={total.emAberto} label="Em aberto" />
        </td>
        <td className="px-4 py-3 text-center">
          <StatusDot color={STATUS_COLORS['Não realizada']} value={total.naoRealizadas} label="Não realizadas" />
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-brand-muted text-xs transition-transform duration-200 inline-block ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </td>
      </tr>

      {open && origens.map(({ origem, counts }) => (
        <tr key={origem} className="bg-[#0E0E0E] border-b border-brand-border/50">
          <td className="pl-16 pr-4 py-2">
            <span className="text-xs text-brand-muted font-manrope">{origem}</span>
          </td>
          <td className="px-4 py-2 text-center">
            <span className="text-xs text-gray-400 font-manrope">{counts.total}</span>
          </td>
          <td className="px-4 py-2 text-center">
            <span className="text-xs font-manrope" style={{ color: STATUS_COLORS['Realizada'] }}>{counts.realizadas}</span>
          </td>
          <td className="px-4 py-2 text-center">
            <span className="text-xs font-manrope" style={{ color: STATUS_COLORS['Reagendada'] }}>{counts.reagendadas}</span>
          </td>
          <td className="px-4 py-2 text-center">
            <span className="text-xs font-manrope" style={{ color: STATUS_COLORS['Em aberto'] }}>{counts.emAberto}</span>
          </td>
          <td className="px-4 py-2 text-center">
            <span className="text-xs font-manrope" style={{ color: STATUS_COLORS['Não realizada'] }}>{counts.naoRealizadas}</span>
          </td>
          <td />
        </tr>
      ))}
    </>
  )
}

const TH = ({ children, center }: { children?: React.ReactNode; center?: boolean }) => (
  <th className={`px-4 py-3 text-xs font-manrope font-semibold text-brand-muted uppercase tracking-wider ${center ? 'text-center' : 'text-left'}`}>
    {children}
  </th>
)

export default function BrokerSection({ brokers }: Props) {
  if (!brokers.length) return (
    <div className="flex items-center justify-center h-32 text-brand-muted text-sm font-manrope">
      Sem dados para exibir
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="border-b border-brand-border">
          <tr>
            <TH>Corretor</TH>
            <TH center>Total</TH>
            <TH center>Realizadas</TH>
            <TH center>Reagendadas</TH>
            <TH center>Em aberto</TH>
            <TH center>Não realizadas</TH>
            <TH center></TH>
          </tr>
        </thead>
        <tbody>
          {brokers.map((b, i) => (
            <BrokerRow key={b.nome} broker={b} index={i} />
          ))}
        </tbody>
      </table>
      <p className="text-xs text-brand-muted text-center mt-3 font-manrope">
        Clique em um corretor para ver o detalhamento por origem do lead
      </p>
    </div>
  )
}
