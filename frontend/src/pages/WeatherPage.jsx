import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Thermometer, Wind, Sun as Sunicon, Droplet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Sun from "../assets/sun.png";
import Lightning from "../assets/lightning.png";
import Rain from "../assets/rain.png";
import Clouds from "../assets/clouds.png";
import Cloudy from "../assets/cloudy.png";
import Snow from "../assets/snow.png";
import { TempBarChartComponent, HumidBarChartComponent } from "../components/ui/barchart";
import axios from "axios";

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function WeatherPage() {
  axios.defaults.withCredentials = false;
  const [current, setCurrent] = useState();
  const [search, setSearch] = useState("karachi");
  const [input, setInput] = useState("");
  const [hourly, setHourly] = useState("");
  const [daily, setDaily] = useState();
  const [city, setCity] = useState("Karachi");
  const [loading, setLoading] = useState(false);

  function getWeatherIcon(wmoCode) {
    const weatherIcons = {
      0: Sun,
      1: Sun,
      2: Clouds,
      3: Cloudy,
      45: Rain,
      48: Rain,
      51: Rain,
      53: Rain,
      55: Rain,
      56: Rain,
      57: Rain,
      61: Rain,
      63: Rain,
      65: Rain,
      66: Rain,
      67: Rain,
      71: Snow,
      73: Snow,
      75: Snow,
      80: Rain,
      81: Rain,
      82: Rain,
      85: Snow,
      86: Snow,
      95: Lightning,
      96: Lightning,
      99: Lightning,
    };
    return weatherIcons[wmoCode] || Sun;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const geocodeResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${search}&count=10&language=en&format=json`
        );
        const { latitude, longitude, name } = geocodeResponse.data.results[0] || {};
        if (!latitude || !longitude || !name) {
          throw new Error("City not found");
        }
        setCity(name);

        const weatherResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,apparent_temperature_max`
        );

        setCurrent(weatherResponse.data.current);
        setDaily(weatherResponse.data.daily);
        setHourly(weatherResponse.data.hourly);
      } catch (error) {
        toast.error("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  const handleSearch = () => {
    if (input.trim() === "") {
      toast.error("Please enter a city name");
      return;
    }
    setSearch(input.trim());
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Home</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Search for cities"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="max-w-96"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-4 gap-8 mt-2">
        <div className="col-span-4 lg:col-span-2">
          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="font-bold text-4xl">
                    {loading ? <Skeleton className="h-8 w-32" /> : city}
                  </h1>
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-col">
                    {loading ? (
                      <Skeleton className="h-24 w-24 self-end" />
                    ) : (
                      <>
                        <p>Chances of Rain: {current?.rain || "-"}%</p>
                        <img
                          src={getWeatherIcon(current?.weather_code)}
                          alt="Weather Icon"
                          className="self-end py-0"
                          width={120}
                          height={120}
                        />
                      </>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${Math.round(current?.temperature_2m || 0)} °C`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Air Conditions</CardTitle>
              </CardHeader>
              <CardContent className="px-8 flex flex-col gap-4 justify-center">
                <div className="flex justify-between">
                  <div>
                    <div className="flex gap-2">
                      <Thermometer />Real Feel
                    </div>
                    <div className="text-right">
                      {loading ? <Skeleton className="h-6 w-16" /> : `${current?.apparent_temperature}°C`}
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <Wind />Wind Speed
                    </div>
                    <div className="text-right">
                      {loading ? <Skeleton className="h-6 w-16" /> : `${current?.wind_speed_10m} Km/h`}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <div className="flex gap-2">
                      <Droplet />Rain
                    </div>
                    <div className="text-right">
                      {loading ? <Skeleton className="h-6 w-16" /> : `${current?.rain} %`}
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <Sunicon />Humidity
                    </div>
                    <div className="text-right">
                      {loading ? <Skeleton className="h-6 w-16" /> : `${current?.relative_humidity_2m} %`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="col-span-4 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent className="px-2 flex flex-col gap-2">
            {loading ? (
              <>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded" />
                ))}
              </>
            ) : (
              daily?.weather_code.map((code, index) => (
                <div
                  key={daily.time[index]}
                  className="border w-full rounded flex justify-between items-center py-2 px-2"
                >
                  <div>{formatDate(daily.time[index])}</div>
                  <div className="font-bold flex items-center">
                    <img
                      src={getWeatherIcon(code)}
                      height={30}
                      width={30}
                      alt="Weather Icon"
                    />
                    <div className="flex items-center">
                      {Math.round(daily.temperature_2m_max[index])}°C / {Math.round(
                        daily.apparent_temperature_max[index]
                      )}°C
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-2">
        <div>
          {!loading && daily ? (
            <TempBarChartComponent daily={daily} />
          ) : (
            <Skeleton className="h-64 w-full rounded" />
          )}
        </div>

        <div>
          {!loading && hourly ? (
            <HumidBarChartComponent daily={daily} hourly={hourly} />
          ) : (
            <Skeleton className="h-64 w-full rounded" />
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
