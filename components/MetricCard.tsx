'use client'

type Props = {
  label:  string
  value:  number
  color:  string
  bg:     string
  icon:   React.ReactNode
  delay?: number
}

export default function MetricCard({ label, value, color, bg, icon, delay = 0 }: Props) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 border border-brand-border animate-slide-up"
      style={{
        backgroundColor: '#161616',
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-brand-muted text-sm font-manrope font-medium">{label}</span>
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg, color }}
        >
          {icon}
        </span>
      </div>
      <span
        className="text-4xl font-poppins font-bold leading-none"
        style={{ color }}
      >
        {value.toLocaleString('pt-BR')}
      </span>
    </div>
  )
}
