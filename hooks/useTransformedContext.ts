import { Context } from '@/types/Context'

export const useTransformedContext = (context: Context[]) => {
  return context.map((item: Context) => {
    const {
      id,
      name,
      currency,
      currency_value,
      next_payment,
      category: { name: categoryName },
      image: { url: iconUrl },
      start_date,
      cycle: { name: cycleName },
    } = item

    return `${name}: ID=${id}, Currency=${currency}, Value=${currency_value}, Next Payment=${new Date(next_payment).toISOString().split('T')[0]}, Category=${categoryName}, Icon URL=${iconUrl}, Created At=${new Date(start_date).toISOString().split('T')[0]}, Cycle=${cycleName.toLowerCase()}, Deleted At=${item.deleted_at ? new Date(item.deleted_at).toISOString().split('T')[0] : 'null'}`
  })
}
