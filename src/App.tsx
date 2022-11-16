import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { IconSearch } from "@tabler/icons";
import moment from "moment";
import * as WeatherIcons from "@icons";

import { OpenWeather } from "@types";

export function App() {
  const apiKey = "1e4ec165898118cbab1cd42df86e5f9f";
  const date = moment();

  const input = useRef<HTMLInputElement>(null);
  const [city, setCity] = useState<string>();
  const [data, setData] = useState<OpenWeather>();
  const [error, setError] = useState(false);

  const onSearch = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCity(input.current?.value);
  }, []);

  const round = useCallback((value: number, precision: number = 0) => {
    var multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }, []);

  const icon = useCallback((code: string) => {
    const {
      Icon01d,
      Icon01n,
      Icon02d,
      Icon02n,
      Icon03d,
      Icon03n,
      Icon04d,
      Icon04n,
      Icon09d,
      Icon09n,
      Icon10d,
      Icon10n,
      Icon11d,
      Icon11n,
      Icon13d,
      Icon13n,
      Icon50d,
      Icon50n,
    } = WeatherIcons;

    switch (code) {
      case "01d":
        return Icon01d;
      case "01n":
        return Icon01n;
      case "02d":
        return Icon02d;
      case "02n":
        return Icon02n;
      case "03d":
        return Icon03d;
      case "03n":
        return Icon03n;
      case "04d":
        return Icon04d;
      case "04n":
        return Icon04n;
      case "09d":
        return Icon09d;
      case "09n":
        return Icon09n;
      case "10d":
        return Icon10d;
      case "10n":
        return Icon10n;
      case "11d":
        return Icon11d;
      case "11n":
        return Icon11n;
      case "13d":
        return Icon13d;
      case "13n":
        return Icon13n;
      case "50d":
        return Icon50d;
      case "50n":
        return Icon50n;
      default:
        return Icon01d;
    }
  }, []);

  useEffect(() => {
    const nav = navigator.geolocation;

    if (city) {
      (async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const request = await fetch(url);
        const response = await request.json();
        setError(!request.ok);

        if (request.ok) setData(response as OpenWeather);
      })();
    } else if (nav) {
      nav.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          const request = await fetch(url);
          const response = await request.json();
          setError(!request.ok);

          if (request.ok) setData(response as OpenWeather);
        },
        async () => {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=Fortaleza&appid=${apiKey}&units=metric`;
          const request = await fetch(url);
          const response = await request.json();
          setError(!request.ok);

          if (request.ok) setData(response as OpenWeather);
        }
      );
    }
  }, [city]);

  return (
    <div className="app">
      {data && (
        <div className="w-screen h-screen grid grid-rows-[1fr_1fr_200px] font-brand text-white/70">
          <div className="header mt-10 text-center md:mx-20 md:text-left">
            <div className="text-xl">
              {`${date.format("dddd, DD MMMM")} | ${data.name}, ${data.sys.country}`}
            </div>
          </div>

          <div className="body mx-4 md:mx-40">
            <form onSubmit={onSearch} autoComplete="off" className="flex relative h-full">
              <div className="flex absolute top-2 right-0 items-center pr-4 pointer-events-none">
                <IconSearch />
              </div>
              <input
                ref={input}
                placeholder="Enter your city..."
                className="w-full h-10 capitalize bg-black/20 rounded-full pl-6 pr-14 outline-none focus:outline-white focus:outline-1 focus:outline-offset-2"
              />
              <div className="flex absolute top-11 pl-4 text-sm font-medium">
                {error && "Sorry, enter a valid city"}
              </div>
            </form>
          </div>

          <div className="footer w-full h-full bg-black/20 shadow-[0_4px_30px] shadow-black/10 backdrop-blur-md border-t-white/30">
            <div className="grid grid-cols-3 md:grid-cols-5 h-full">
              <div className="p-4 flex flex-col justify-center items-center">
                <div className="icon">
                  <img
                    alt="icon"
                    src={icon(data.weather[0].icon)}
                    className="w-full md:w-32 md:h-32"
                  />
                </div>
                <div className="description font-thin capitalize text-center">
                  {data.weather[0].description}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="w-full border-x border-white/20 flex flex-col items-center">
                  <div className="text-3xl md:text-6xl font-extralight flex">
                    <span>{round(data.main.temp_max, 1)}</span>
                    <span className="text-2xl">°C</span>
                  </div>

                  <span className="md:text-xl font-thin">Maximum</span>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="w-full md:border-r border-white/20 flex flex-col items-center">
                  <div className="text-3xl md:text-6xl font-extralight flex">
                    <span>{round(data.main.temp_min, 1)}</span>
                    <span className="text-2xl">°C</span>
                  </div>

                  <span className="md:text-xl font-thin">Minimum</span>
                </div>
              </div>

              <div className="hidden md:flex flex-col justify-center">
                <div className="w-full border-r border-white/20 flex flex-col items-center">
                  <div className="text-6xl font-extralight flex">
                    <span>{round(data.wind.speed, 1)}</span>
                    <span className="text-2xl">m/s</span>
                  </div>

                  <span className="text-xl font-thin">Wind</span>
                </div>
              </div>

              <div className="hidden md:flex flex-col justify-center items-center">
                <div className="text-6xl font-extralight flex">
                  <span>{round(data.main.humidity, 1)}</span>
                  <span className="text-2xl">%</span>
                </div>

                <span className="text-xl">Humidity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
