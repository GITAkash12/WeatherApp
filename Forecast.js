import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";

function Forecast() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({});
  const [currentForecast, setCurrentForecast] = useState([]);

  const fetchWeather = (lat, lon, setWeatherData, setForecastData) => {
    axios
      .get(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeatherData(response.data);
        return axios.get(
          `${apiKeys.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
        );
      })
      .then((response) => {
        const dailyForecast = response.data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecastData(dailyForecast);
      })
      .catch((error) => {
        console.log(error);
        setWeatherData({});
        setForecastData([]);
        setError({ message: "Not Found" });
      });
  };

  const search = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city !== "[object Object]" ? city : query
        }&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        return axios.get(
          `${apiKeys.base}forecast?q=${city !== "[object Object]" ? city : query
          }&units=metric&APPID=${apiKeys.key}`
        );
      })
      .then((response) => {
        const dailyForecast = response.data.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecast(dailyForecast);
      })
      .catch((error) => {
        console.log(error);
        setWeather({});
        setForecast([]);
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(
            position.coords.latitude,
            position.coords.longitude,
            setCurrentWeather,
            setCurrentForecast
          );
        },
        (error) => {
          fetchWeather(28.67, 77.22, setCurrentWeather, setCurrentForecast); // Default to Delhi
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        }
      );
    } else {
      alert("Geolocation not available");
    }
  }, []);

  return (
    <div className="app-container">
      <div className="current-location-container">
        <h2>Current Location Weather</h2>
        {typeof currentWeather.main !== "undefined" ? (
          <>
            <div className="cityHead">
              <p>
                {currentWeather.name}, {currentWeather.sys.country}
              </p>
              <img
                className="temp"
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`}
                alt="weather icon"
              />
            </div>
            <ul>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(currentWeather.main.temp)}°c (
                  {currentWeather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(currentWeather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(currentWeather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(currentWeather.wind.speed)} Km/h
                </span>
              </li>
            </ul>
            <div className="forecast-container">
              {currentForecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                  <p>{Math.round(day.main.temp)}°c</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            {error.query} {error.message}
          </div>
        )}
      </div>

      <div className="search-container">
        <h2>Search Weather by City</h2>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                search(query);
              }
            }}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search(query)}
              alt="Search"
            />
          </div>
        </div>
        {typeof weather.main !== "undefined" ? (
          <>
            <div className="cityHead">
              <p>
                {weather.name}, {weather.sys.country}
              </p>
              <img
                className="temp"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="weather icon"
              />
            </div>
            <ul>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </ul>
            <div className="forecast-container">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                  <p>{Math.round(day.main.temp)}°c</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            {error.query} {error.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;
