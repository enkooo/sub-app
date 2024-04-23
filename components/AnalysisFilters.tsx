import React from 'react'
import { Text, View } from 'react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

type AnalysisFiltersProps = {
  startDate: Date | undefined
  endDate: Date | undefined
  onChangeStartDate: (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => void
  onChangeEndDate: (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => void
}

export default function AnalysisFilters({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}: AnalysisFiltersProps) {
  return (
    <View className="m-4 mt-0">
      <View className="flex-row justify-between mt-4 bg-gray-200/50 rounded-lg">
        <View className="justify-between items-center my-2 rounded-lg">
          <Text className="mb-2 text-base">Start date</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate ?? new Date()}
            onChange={(event, date) => onChangeStartDate(event, date)}
            maximumDate={endDate}
            themeVariant="light"
          />
        </View>
        <View className="justify-between items-center my-2 rounded-lg mr-[10]">
          <Text className="mb-2 ml-4 text-base">End date</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate ?? new Date()}
            onChange={(event, date) => onChangeEndDate(event, date)}
            minimumDate={startDate}
            themeVariant="light"
          />
        </View>
      </View>
    </View>
  )
}
