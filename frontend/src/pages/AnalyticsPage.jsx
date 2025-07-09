import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Thermometer, Wind, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "recharts";
import { LineChartComponent, BargraphComponent } from "../components/ui/analyticsCharts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'react-hot-toast'; // Importing react-hot-toast

export function formatTimestampToMonthDateTime(timestamp) {
  const date = new Date(timestamp);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
}

function AnalyticsPage() {
  const [chartType, setChartType] = useState("line");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [sensorData, setSensorData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sensorStatus, setSensorStatus] = useState("green");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSensorData() {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/sensor/fetch");
        const data = response.data.readings;
        setSensorData(data);

        // Check if the first 3 readings have extreme temperature or humidity
        const extremeReading = data.slice(0, 3).find(
          (reading) => reading.temperature > 30 || reading.humidity > 70
        );

        if (extremeReading) {
          toast.error("Extreme weather reading detected!", {
            position: "top-right", // Display the toast on the top right
            style: {
              background: "red",
              color: "white",
              fontWeight: "bold",
            },
          });
        }

        if (data.length > 0) {
          const latestReadingTime = new Date(data[0].timestamp);
          const now = new Date();

          // Check if the latest reading is more than an hour ago
          const timeDifference = now - latestReadingTime;
          setSensorStatus(timeDifference > 3600000 ? "red" : "green");

          // Update last updated time
          setLastUpdated(now.toLocaleString());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSensorData();

    // Refresh the data every 15 minutes
    const intervalId = setInterval(fetchSensorData, 1 * 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sensorData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sensorData.length / itemsPerPage);

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Temperature,Humidity\n" +
      sensorData.map((row) => `${row.timestamp},${row.temperature},${row.humidity}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sensor_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="flex items-center space-x-2">
        <span>Last Updated: {lastUpdated || "Loading..."}</span>
        <div className="flex items-center space-x-1">
          <span>Sensor Status:</span>
          <span className={`relative flex h-3 w-3`}>
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                sensorStatus === "green" ? "bg-green-400" : "bg-red-400"
              } opacity-75`}></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                sensorStatus === "green" ? "bg-green-500" : "bg-red-500"
              }`}></span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          {loading ? (
            <Skeleton className="h-16" />
          ) : (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensorData[0]?.temperature || "N/A"}°C</div>
              </CardContent>
            </>
          )}
        </Card>
        <Card>
          {loading ? (
            <Skeleton className="h-16" />
          ) : (
            <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensorData[0]?.humidity || "N/A"}%</div>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sensor Readings</h2>
        <Button onClick={exportData} disabled={loading}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="pt-4">
                    <TableHead className="font-bold">Timestamp</TableHead>
                    <TableHead className="font-bold">Temperature (°C)</TableHead>
                    <TableHead className="font-bold">Humidity (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((reading, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTimestampToMonthDateTime(reading.timestamp)}</TableCell>
                      <TableCell>{reading.temperature}</TableCell>
                      <TableCell>{reading.humidity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sensor Data Visualization</h2>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Graph</SelectItem>
            <SelectItem value="bar">Bar Graph</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : chartType === "line" ? (
          <LineChartComponent data={sensorData.slice(0, 10)} />
        ) : (
          <BargraphComponent data={sensorData.slice(0, 10)} />
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsPage;
