import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Visita = {
  id_do_lead:       number
  descricao_do_lead: string | null
  origem:           string | null
  data_visita:      string | null
  responsavel:      string | null
  status_visita:    string | null
  comentario:       string | null
}
