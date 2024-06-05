import React from "react";
import apiKeys from "./apiKeys";
import loader from "./images/WeatherIcons.gif";
import Forecast from "./Forecast"; 
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
    forecast: [],
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          this.getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    const weather_api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const weather_data = await weather_api_call.json();
    const forecast_api_call = await fetch(
      `${apiKeys.base}forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const forecast_data = await forecast_api_call.json();

    this.setState({
      lat: lat,
      lon: lon,
      city: weather_data.name,
      temperatureC: Math.round(weather_data.main.temp),
      temperatureF: Math.round(weather_data.main.temp * 1.8 + 32),
      humidity: weather_data.main.humidity,
      main: weather_data.weather[0].main,
      country: weather_data.sys.country,
      forecast: forecast_data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      ),
    });

    //this.setIcon(this.state.main);
  };

  // setIcon = (main) => {
  //   let icon;
  //   switch (main) {
  //     case "Haze":
  //       icon = "CLEAR_DAY";
  //       break;
  //     case "Clouds":
  //       icon = "CLOUDY";
  //       break;
  //     case "Rain":
  //       icon = "RAIN";
  //       break;
  //     case "Snow":
  //       icon = "SNOW";
  //       break;
  //     case "Dust":
  //       icon = "WIND";
  //       break;
  //     case "Drizzle":
  //       icon = "SLEET";
  //       break;
  //     case "Fog":
  //       icon = "FOG";
  //       break;
  //     case "Smoke":
  //       icon = "FOG";
  //       break;
  //     case "Tornado":
  //       icon = "WIND";
  //       break;
  //     default:
  //       icon = "CLEAR_DAY";
  //   }
  //   this.setState({ icon });
  // };

  renderForecast = () => {
    return this.state.forecast.map((reading, index) => {
      const date = new Date(reading.dt * 1000);
      const day = dateBuilder(date).split(",")[0];
      return (
        // <div key={index} className="forecast-day">
        //   {/* <p>{day}</p> */}
        //   {/* <ReactAnimatedWeather
        //     icon={this.getIcon(reading.weather[0].main)}
        //     color={defaults.color}
        //     size={defaults.size}
        //     animate={defaults.animate}
        //   /> */}
        //   {/* <p>{Math.round(reading.main.temp)}°C</p> */}
        // </div>
        <></>
      );
    });
  };

  // getIcon = (main) => {
  //   switch (main) {
  //     case "Haze":
  //       return "CLEAR_DAY";
  //     case "Clouds":
  //       return "CLOUDY";
  //     case "Rain":
  //       return "RAIN";
  //     case "Snow":
  //       return "SNOW";
  //     case "Dust":
  //       return "WIND";
  //     case "Drizzle":
  //       return "SLEET";
  //     case "Fog":
  //       return "FOG";
  //     case "Smoke":
  //       return "FOG";
  //     case "Tornado":
  //       return "WIND";
  //     default:
  //       return "CLEAR_DAY";
  //   }
  // };

  render() {
    if (this.state.temperatureC) {
      return (
        <React.Fragment>
          <div className="city">
            {/* <div className="title">
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div> */}
            {/* <div className="mb-icon">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div> */}
            <div className="date-time">
              {/* <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div> */}
              {/* <div className="temperature">
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
              </div> */}
            </div>
            <div className="forecast">{this.renderForecast()}</div>
            <Forecast icon={this.state.icon} weather={this.state.main} /> Use Forecast
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App <br />
            & used for calculating Real time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
