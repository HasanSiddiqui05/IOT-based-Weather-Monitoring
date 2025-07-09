"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, BarChart, Bar, Cell } from "recharts";
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

// Utility to format the date
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Line Chart Component
export function LineChartComponent({ data }) {
  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: "Humidity (%)",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    temperature: item.predicted_temperature,
    humidity: item.predicted_humidity,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature and Humidity Trend</CardTitle>
        <CardDescription>
          A comparison of temperature and humidity trends over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full min-h-[200px] max-h-96">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis dataKey="date" tickMargin={8} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              dataKey="temperature"
              yAxisId="left"
              type="monotone"
              stroke={chartConfig.temperature.color}
              strokeWidth={2}
              dot={{ fill: chartConfig.temperature.color }}
              activeDot={{ r: 6 }}
              name={chartConfig.temperature.label}
            />
            <Line
              dataKey="humidity"
              yAxisId="right"
              type="monotone"
              stroke={chartConfig.humidity.color}
              strokeWidth={2}
              dot={{ fill: chartConfig.humidity.color }}
              activeDot={{ r: 6 }}
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

// Bar Graph Component
export function BargraphComponent({ data }) {
  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: "Humidity (%)",
      color: "hsl(var(--chart-2))",
    },
  };

  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    temperature: item.predicted_temperature,
    humidity: item.predicted_humidity,
  }));

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
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={10} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} content={<ChartTooltipContent />} />
            <Legend verticalAlign="bottom" height={36} />
            <Bar
              dataKey="temperature"
              yAxisId="left"
              fill={chartConfig.temperature.color}
              radius={[4, 4, 0, 0]}
              name={chartConfig.temperature.label}
            >
              {chartData.map((entry, index) => (
                <Cell key={`temp-cell-${index}`} fill={chartConfig.temperature.color} />
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
                <Cell key={`humidity-cell-${index}`} fill={chartConfig.humidity.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div>Note: Hover over the bars to see detailed data values.</div>
      </CardFooter>
    </Card>
  );
}
