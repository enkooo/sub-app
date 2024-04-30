import Colors from '@/constants/Colors'
import { CheckboxButton } from 'react-native-bouncy-checkbox-group'
import { IconStyle } from '@/constants/IconStyle'

export const useFetchCheckboxItems = async <
  T extends { id: number; name: string },
>(
  fetchFunction: () => Promise<{ data: T[] }>,
  setFunction: React.Dispatch<React.SetStateAction<CheckboxButton[]>>,
) => {
  const response = await fetchFunction()

  const items = response.data.map((item) => ({
    id: item.id,
    text: item.name,
    fillColor: Colors.primary,
    unFillColor: Colors.primaryLight,
    iconStyle: IconStyle(),
    textStyle: { textDecorationLine: 'none' },
  }))

  setFunction(items as CheckboxButton[])
}
