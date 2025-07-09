import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Search, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChartComponent, BargraphComponent } from "../components/ui/forecastCharts";
import { ResponsiveContainer } from "recharts";
import {toast} from 'react-hot-toast'
import { formatDate } from "./WeatherPage";

function ForecastPage() {
axios.defaults.withCredentials = false;
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("karachi");
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const geocodeResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=10&language=en&format=json`
        );
        const { latitude, longitude, name } = geocodeResponse.data.results[0] || {};
        if (!latitude || !longitude || !name) {
          throw new Error("City not found");
        }
        setCity(name);
  
        const response = await axios.post("http://localhost:8000/predict-weather", { city: search });
        console.log(response.data);
        const data = Object.values(response.data);
  
        // Update dates starting from tomorrow
        const today = new Date();
        const updatedData = data.map((item, index) => {
          const newDate = new Date(today);
          newDate.setDate(today.getDate() + index + 1); // Tomorrow + index
          return {
            ...item,
            date: newDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          };
        });
        console.log(updatedData)
        setPredictions(updatedData);
      } catch (err) {
        setError("Failed to fetch forecast data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCityForecast();
  }, [search]);
  
  
  
  
  
  
  

const handleSearch = () => {
    if (input.trim() === "") {
      toast.error("Please enter a city name");
      return;
    }
    setSearch(input.trim());
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Forecast</h1>
      <div className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city name"
          className="w-80"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-80" />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && predictions && (
        <>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-medium">7-Day Forecast for {city}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {predictions.slice(0,7).map((prediction, index) => (
                  <Card key={index}>
                    <CardContent>
                      <div className="text-lg font-bold mt-4">{formatDate(prediction.date)}</div>
                      <div>Temperature: {Math.round(prediction.predicted_temperature,2)}°C</div>
                      <div>Humidity: {Math.round(prediction.predicted_humidity,2)}%</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold">Weather Data Visualization</h2>
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

          <ResponsiveContainer width="100%" height={300} className="mt-4">
            {loading ? (
              <Skeleton className="h-72 w-full" />
            ) : chartType === "line" ? (
              <LineChartComponent data={predictions.slice(0,7)}/>
            ) : (
              <BargraphComponent data={predictions.slice(0,7)}/>
            )}
          </ResponsiveContainer>
        </>
      )}

      {!loading && !predictions && !error && (
        <div className="flex justify-center mt-6">
          <p>No data available. Please search for a city.</p>
        </div>
      )}
    </div>
  );
}

export default ForecastPage;
