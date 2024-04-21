import React from 'react'
import { Text, View } from 'react-native'
import SegmentedControl from '@/libraries/SegmentedControl/SegmentedControl'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const YEARS = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
]

type AnalysisFiltersProps = {
  tabIndex: number
  setTabIndex: (index: number) => void
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  selectedYear: string
  setSelectedYear: (year: string) => void
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
  tabIndex,
  setTabIndex,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}: AnalysisFiltersProps) {
  return (
    <View className="m-4">
      <SegmentedControl
        containerMargin={16}
        segments={['Month', 'Year', 'Custom']}
        onChange={(index) => setTabIndex(index)}
        currentIndex={tabIndex}
        segmentedControlWrapper={{ backgroundColor: 'rgba(229 231 235 / 0.5)' }}
        inactiveTextStyle={{ color: 'black' }}
      />
      {tabIndex === 0 && (
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          itemStyle={{ fontSize: 14 }}
          style={{
            backgroundColor: 'rgba(229 231 235 / 0.5)',
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          {MONTHS.map((month) => (
            <Picker.Item
              key={month}
              label={month}
              value={month.toLocaleLowerCase()}
            />
          ))}
        </Picker>
      )}
      {tabIndex === 1 && (
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          itemStyle={{ fontSize: 14 }}
          style={{
            backgroundColor: 'rgba(229 231 235 / 0.5)',
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          {YEARS.map((year) => (
            <Picker.Item
              key={year}
              label={year}
              value={year.toLocaleLowerCase()}
            />
          ))}
        </Picker>
      )}
      {tabIndex === 2 && (
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
      )}
    </View>
  )
}
