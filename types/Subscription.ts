import { Image } from '@/types/Image'

type Category = {
  id: number
  name: string
  user: number
}

type Cycle = {
  id: number
  name: string
}

export type Subscription = {
  id: string
  name: string
  currency: string
  currency_value: number
  next_payment: string
  category: Category
  category_id: number
  image: Image
  created_at: string
  cycle: Cycle
  cycle_id: number
}
