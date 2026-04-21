# elihu imóveis — Dashboard de Visitas

Dashboard de métricas de visitas integrado ao Supabase, feito em Next.js para deploy no Vercel.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (banco de dados)
- **Recharts** (gráficos)
- **Tailwind CSS** (estilização)
- **TypeScript**

---

## 1. Configuração local

### Pré-requisitos
- Node.js 18+
- Conta no Supabase com a tabela `relatorio_visitas`

### Instalar dependências
```bash
npm install
```

### Variáveis de ambiente
Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:
```bash
cp .env.local.example .env.local
```

Edite `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> Você encontra esses valores em: **Supabase → Settings → API**

### Rodar em desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 2. Deploy no Vercel

### Opção A — Interface do Vercel (recomendado)
1. Suba o projeto para um repositório no GitHub
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
3. Na etapa de configuração, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

### Opção B — Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## 3. Estrutura do projeto

```
elihu-dashboard/
├── app/
│   ├── layout.tsx        # Layout global (fontes, metadata)
│   ├── globals.css       # Estilos globais + Tailwind
│   └── page.tsx          # Página raiz
├── components/
│   ├── DashboardClient.tsx  # Componente principal do dashboard
│   ├── MetricCard.tsx       # Card de métrica
│   ├── FiltersBar.tsx       # Barra de filtros
│   ├── OrigemChart.tsx      # Gráfico por origem do lead
│   └── BrokerSection.tsx    # Tabela de corretores
├── lib/
│   ├── supabase.ts       # Cliente Supabase + tipo Visita
│   └── utils.ts          # Lógica de equipes, status, agregações
└── .env.local.example    # Modelo de variáveis de ambiente
```

---

## 4. Funcionalidades

### Filtros
- **Equipe**: Fortaleza / Eusébio / Todas
- **Período**: data de início e fim
- **Origem do lead**: filtro por canal de origem

### Visão Geral
- 4 cards de métricas (Realizadas, Reagendadas, Em aberto, Não realizadas)
- Gráfico de barras empilhadas por origem do lead
- Tabela detalhada por origem

### Por Corretor
- 4 cards de métricas filtrados
- Tabela com todos os corretores e seus totais
- Linha expansível com detalhamento por origem do lead (clique no corretor)

### Lógica de equipes
- **Fortaleza**: Amanda, Italo, Herica, Bruna, Diogo, Emília, Fabiolarita, Torres Neto, Zoti, Guilherme, Julia, Mauricio, Max
- **Eusébio**: todos os outros corretores
- **Excluído automaticamente**: João Paulo
