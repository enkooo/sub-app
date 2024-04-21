import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import AnalysisFilters from '@/components/AnalysisFilters'

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

const Analysis = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0])
  const [selectedYear, setSelectedYear] = useState(YEARS[0])

  const onChangeStartDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate
    setStartDate(currentDate)
  }

  const onChangeEndDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate
    setEndDate(currentDate)
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AnalysisFilters
        tabIndex={tabIndex}
        endDate={endDate}
        onChangeEndDate={onChangeEndDate}
        onChangeStartDate={onChangeStartDate}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setTabIndex={setTabIndex}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        startDate={startDate}
      />
    </View>
  )
}

export default Analysis
