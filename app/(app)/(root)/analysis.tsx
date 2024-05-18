import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { AnalysisFilters } from '@/components/AnalysisFilters'
import { BarChart, PieChart } from 'react-native-chart-kit'
import { getAnalysis } from '@/api/apis/getAnalysis'
import randomColor from 'randomcolor'

type BarChartType = {
  labels: string[]
  datasets: {
    data: number[]
  }[]
}

const initialBarChartData: BarChartType = {
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
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
}

type PieChartType = {
  name: string
  cost: number
  color: string
}

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getLastDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Analysis = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(() =>
    getFirstDayOfMonth(new Date()),
  )
  const [endDate, setEndDate] = useState<Date | undefined>(() =>
    getLastDayOfMonth(new Date(new Date().setMonth(new Date().getMonth() + 1))),
  )
  const [pieChartData, setPieChartData] = useState<PieChartType[]>([])
  const [barChartData, setBarChartData] =
    useState<BarChartType>(initialBarChartData)

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

  const fetchPieChartData = async () => {
    const response = await getAnalysis({
      dateStart: formatDateToYYYYMMDD(new Date(startDate!)),
      dateEnd: formatDateToYYYYMMDD(new Date(endDate!)),
      type: 'category',
    })

    const data: PieChartType[] = Object.entries(response).map(
      ([name, cost]) => ({
        name,
        cost: cost as number,
        color: randomColor(),
      }),
    )

    setPieChartData(data)
  }

  const fetchBarChartData = async () => {
    const response = await getAnalysis({
      dateStart: formatDateToYYYYMMDD(new Date(startDate!)),
      dateEnd: formatDateToYYYYMMDD(new Date(endDate!)),
    })

    const data = initialBarChartData.labels.map((label, index) => {
      const month = (index + 1).toString().padStart(2, '0')
      return response[month] || 0
    })

    const chartData = {
      labels: initialBarChartData.labels,
      datasets: [
        {
          data: data,
        },
      ],
    }

    setBarChartData(chartData)
  }

  useEffect(() => {
    fetchPieChartData()
    fetchBarChartData()
  }, [startDate, endDate])

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
        endDate={endDate}
        onChangeEndDate={onChangeEndDate}
        onChangeStartDate={onChangeStartDate}
        startDate={startDate}
      />
      <View className="m-4 mt-0">
        <Text className="text-xl font-bold mb-2">Summary</Text>
        <View className="rounded-lg justify-center items-center">
          <BarChart
            data={barChartData}
            width={width - 30}
            height={300}
            chartConfig={barChartConfig}
            verticalLabelRotation={90}
            yAxisLabel="zł"
            yAxisSuffix=""
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
