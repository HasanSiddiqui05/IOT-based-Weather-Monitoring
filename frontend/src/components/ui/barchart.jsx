

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList,XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { date } from "zod"
import {formatDate} from '../../pages/WeatherPage.jsx'


export  function TempBarChartComponent({daily}) {
    const {time,temperature_2m_max} = daily;
    const chartData = [
        { date: formatDate(time[0]), temperature: temperature_2m_max[0] },
        { date: formatDate(time[1]), temperature: temperature_2m_max[1] },
        { date: formatDate(time[2]), temperature: temperature_2m_max[2] },
        { date: formatDate(time[3]), temperature: temperature_2m_max[3] },
        { date: formatDate(time[4]), temperature: temperature_2m_max[4] },
        { date: formatDate(time[5]), temperature: temperature_2m_max[5] },
        { date: formatDate(time[6]), temperature: temperature_2m_max[6] },
        
    ]
    
    const chartConfig = {
      Temperature: {
        label: "temperature",
      },
    } 
    return (
    <Card className=''>
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
        <CardDescription className='pb-0'>Next 7-Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className='min-h-[200px] w-full ' config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid vertical={false} className='h-full'/>
            <XAxis
      dataKey="date"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 6)}
    />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="temperature">
              <LabelList position="top" dataKey="temperature" fillOpacity={1} />

              {chartData.map((item) => (
                <Cell
                  key={item.date}
                  fill={
                    item.temperature > 0
                      ? "hsl(var(--chart-2))"
                      : "hsl(var(--chart-1))"
                  }
                />
              ))}
            </Bar>
              
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}

export  function HumidBarChartComponent({daily,hourly}) {
    const {time} = daily;
    const {relative_humidity_2m} = hourly;
    const temperature_2m_max = relative_humidity_2m;
const chartData = [
    { date: formatDate(time[0]), humidity: temperature_2m_max[0] },
    { date: formatDate(time[1]), humidity: temperature_2m_max[1] },
    { date: formatDate(time[2]), humidity: temperature_2m_max[2] },
    { date: formatDate(time[3]), humidity: temperature_2m_max[3] },
    { date: formatDate(time[4]), humidity: temperature_2m_max[4] },
    { date: formatDate(time[5]), humidity: temperature_2m_max[5] },
    { date: formatDate(time[6]), humidity: temperature_2m_max[6] },
    
  ]

  const chartConfig = {
    Humidity: {
      label: "humidity",
    },
  } 
return (
<Card className=''>
  <CardHeader>
    <CardTitle>Humidity Trend</CardTitle>
    <CardDescription className='pb-0'>Next 7-Days</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer className='min-h-[200px] w-full ' config={chartConfig}>
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
        <CartesianGrid vertical={false} className='h-full'/>
        <XAxis
  dataKey="date"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => value.slice(0, 6)}
/>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel hideIndicator />}
        />
        <Bar dataKey="humidity">
          <LabelList position="top" dataKey="humidity" fillOpacity={1} />

          {chartData.map((item) => (
            <Cell
              key={item.date}
              fill={
                item.humidity > 0
                  ? "hsl(var(--chart-1))"
                  : "hsl(var(--chart-2))"
              }
            />
          ))}
        </Bar>
          
      </BarChart>
    </ChartContainer>
  </CardContent>
  
</Card>
)
}