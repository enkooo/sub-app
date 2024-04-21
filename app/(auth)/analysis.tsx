import React, { useState } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import AnalysisFilters from '@/components/AnalysisFilters'
import { BarChart, PieChart } from 'react-native-chart-kit'

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

  const pieChartData = [
    {
      name: 'Entertainment',
      cost: 21500000,
      color: 'rgba(131, 167, 234, 1)',
    },
    {
      name: 'Music',
      cost: 2800000,
      color: '#F00',
    },
    {
      name: 'Security',
      cost: 527612,
      color: 'purple',
    },
    {
      name: 'Shopping',
      cost: 8538000,
      color: '#3ea143',
    },
  ]

  const barCharData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50, 20, 45, 28, 80, 99],
      },
    ],
  }

  const barChartConfig = {
    backgroundGradientFrom: '#f0f0f0',
    backgroundGradientTo: '#f0f0f0',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.4,
  }

  const pieChartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  }

  const width = Dimensions.get('window').width

  return (
    <ScrollView className="flex-1 bg-gray-50">
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
      <View className="m-4 mt-0">
        <Text className="text-xl font-bold mb-2">Summary</Text>
        <View className="rounded-lg justify-center items-center">
          <BarChart
            data={barCharData}
            width={width - 30}
            height={300}
            chartConfig={barChartConfig}
            verticalLabelRotation={90}
            yAxisLabel="zł "
            yAxisSuffix=""
            showValuesOnTopOfBars={true}
            fromZero={true}
            style={{
              borderRadius: 8,
            }}
          />
        </View>
      </View>
      <View className="m-4 mt-0">
        <Text className="text-xl font-bold mb-2">Spending by category</Text>
        <View className="bg-gray-200/50 rounded-lg">
          <PieChart
            data={pieChartData}
            width={width}
            height={200}
            chartConfig={pieChartConfig}
            accessor={'cost'}
            backgroundColor={'transparent'}
            paddingLeft={'-30'}
            center={[30, 0]}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Analysis
