"use client";

import { CartesianGrid, Line, LineChart, XAxis,YAxis, Legend,BarChart,Bar,Cell } from "recharts";
import {formatTimestampToMonthDateTime} from '../../pages/AnalyticsPage'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function LineChartComponent({ data }) {
  const chartConfig = {
    temperature: {
      label: "Temperature",
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: "Humidity",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature and Humidity Trend</CardTitle>
        <CardDescription>
          A comparison of temperature and humidity trends over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='w-full min-h-[200px] max-h-96'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="timestamp"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={formatTimestampToMonthDateTime} // Adjust for readable date format
            />

        
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              dataKey="temperature"
              yAxisId='left'
              type="monotone"
              stroke={chartConfig.temperature.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.temperature.color,
              }}
              activeDot={{
                r: 6,
              }}
              name={chartConfig.temperature.label}
            />
            <Line
              dataKey="humidity"
              type="monotone"
              yAxisId='right'
              stroke={chartConfig.humidity.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.humidity.color,
              }}
              activeDot={{
                r: 6,
              }}
              name={chartConfig.humidity.label}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div>Note: Hover over the points to see detailed data values.</div>
      </CardFooter>
    </Card>
  );
}


export function BargraphComponent({ data }) {
    const chartConfig = {
      temperature: {
        label: "Temperature",
        color: "hsl(var(--chart-1))",
      },
      humidity: {
        label: "Humidity",
        color: "hsl(var(--chart-2))",
      },
    };
  
    const chartData = data;
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Temperature and Humidity Trends</CardTitle>
          <CardDescription>
          A comparison of temperature and humidity trends over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full min-h-[200px] max-h-96">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={true}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                content={<ChartTooltipContent />}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar
                dataKey="temperature"
                yAxisId="left"
                fill={chartConfig.temperature.color}
                radius={[4, 4, 0, 0]}
                name={chartConfig.temperature.label}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`temp-cell-${index}`}
                    fill={
                      entry.temperature > 0
                        ? chartConfig.temperature.color
                        : "hsl(var(--chart-muted))"
                    }
                  />
                ))}
              </Bar>
              <Bar
                dataKey="humidity"
                yAxisId="right"
                fill={chartConfig.humidity.color}
                radius={[4, 4, 0, 0]}
                name={chartConfig.humidity.label}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`humidity-cell-${index}`}
                    fill={
                      entry.humidity > 0
                        ? chartConfig.humidity.color
                        : "hsl(var(--chart-muted))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div>Note: Hover over the bars to see detailed data values.</div>
          <div className="leading-none text-muted-foreground">
            
          </div>
        </CardFooter>
      </Card>
    );
  }