export type Context = {
  id: string
  name: string
  currency: string
  currency_value: number
  next_payment: string
  category: { name: string }
  image: { url: string }
  start_date: string
  cycle: { name: string }
  deleted_at?: string | null
}
