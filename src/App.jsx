import {
  faDroplet,
  faMagnifyingGlass,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import uvIndex from "../src/assets/uv-index.png";
import "./App.css";

const API_KEY = "YOUR_API_KEY";
const searchIcn = <FontAwesomeIcon icon={faMagnifyingGlass} />;
const humidityIcn = <FontAwesomeIcon icon={faDroplet} />;
const windIcn = <FontAwesomeIcon icon={faWind} />;

// WeatherDetails component to display weather information
const WeatherDetails = ({
  icn,
  temperature,
  location,
  country,
  latitude,
  longitude,
  humidity,
  uv_index,
  windSpeed,
  description,
}) => {
  return (
    <>
      <div className="weather-icn">
        {" "}
        <img src={icn} alt="" />
      </div>
      <div className="description">{description}</div>
      <div className="temp">{temperature}&deg;C</div>
      <div className="location-det">{location}</div>
      <div className="country">{country}</div>
      <div className="coordinates">
        <div>
          <span className="latitude">latitude</span>
          <span>{latitude}</span>
        </div>

        <div>
          <span className="longitude">longitude</span>
          <span>{longitude}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          {humidityIcn}
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={uvIndex} alt="UV index icon" className="condition-icn" />
          <div className="data">
            <div className="uv-index">{uv_index}</div>
            <div className="text">UV index</div>
          </div>
        </div>

        <div className="element">
          {windIcn}
          <div className="data">
            <div className="humidity-percent">{windSpeed} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * The main component of the application.
 *
 * @returns {JSX.Element} The rendered JSX element.
 */
function App() {
  const [text, setText] = useState("Jaffna");
  const [icn, setIcn] = useState();
  const [temp, setTemp] = useState(0);
  const [location, setLocation] = useState("Jaffna");
  const [country, setCountry] = useState("LK");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [uvIndex, setUVIndex] = useState("0");
  const [windSpeed, setWindSpeed] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");

  // Function to fetch weather data from the API
  const search = async () => {
    setLoading(true);

    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${text}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      const { current, location } = data;
      const { condition, temp_c, humidity, uv, wind_kph } = current;

      setIcn(condition.icon);
      setLocation(location.name);
      setTemp(temp_c);
      setCountry(location.country);
      setLatitude(location.lat);
      setLongitude(location.lon);
      setHumidity(humidity);
      setUVIndex(uv);
      setDescription(condition.text);
      setWindSpeed(wind_kph);
      setCityNotFound(false);
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Event handler for location input change
  const handleLocation = (e) => {
    setText(e.target.value);
  };

  // Event handler for Enter key press in location input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  // Fetch weather data on component mount
  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            name="location"
            id="location"
            className="location"
            placeholder="location"
            onChange={handleLocation}
            onKeyDown={handleKeyDown}
            value={text}
          />

          <div className="search-icn" onClick={() => search()}>
            {searchIcn}
          </div>
        </div>

        {loading && (
          <div className="lading-msg">
            <h1>Loading......</h1>
          </div>
        )}

        {error && (
          <div className="lading-msg">
            <p>{error}</p>
          </div>
        )}

        {!loading && cityNotFound && (
          <div className="cityNotFound-msg">
            <h1>City Not Found</h1>
          </div>
        )}

        {!loading && !cityNotFound && (
          <WeatherDetails
            icn={icn}
            temperature={temp}
            location={location}
            country={country.toUpperCase()}
            latitude={latitude}
            longitude={longitude}
            humidity={humidity}
            uv_index={uvIndex.toString().padStart(2, "0")}
            windSpeed={windSpeed}
            description={description}
          />
        )}

        <p className="copy-right">
          &copy; Designed By <span>Maran</span>
        </p>
      </div>
    </>
  );
}

WeatherDetails.propTypes = {
  icn: PropTypes.any,
  temperature: PropTypes.number,
  location: PropTypes.string,
  country: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  humidity: PropTypes.number,
  windSpeed: PropTypes.number,
  description: PropTypes.string,
  uv_index: PropTypes.string,
};

export default App;
