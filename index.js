import express from "express";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

const today = new Date().toISOString().slice(0,10); //YYYY-MM-DD
let overviewResults = "";
let JSON_API = {};

const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const JSON_path = path.join(__dirname,"api-call-limit.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

function getState() {
    return JSON.parse(fs.readFileSync(JSON_path, "utf-8"));
}

function setState(state) {
    fs.writeFileSync(JSON_path, JSON.stringify(state, null, 4));
}

function canCallAPI() {
    //const JSON_API = getState();
    const apiCallLimit = JSON_API.limit;  //Max 1000 on OpenWeatherApp 3.0 free plan
  
    if (JSON_API.resetOn !== today) {
        JSON_API.count = 0;
        JSON_API.resetOn = today;
        setState(JSON_API);
    }
    return JSON_API.count < apiCallLimit;  
}

function convertDailyForecastDate(result) {
    //To be implemented in future
    if (!result || !result.data || !result.data.daily) {
        return [];
    }

    const options = { weekday: 'short',  month: 'short', day: '2-digit' };
    const dailyForecast = result.data.daily;
    for (let i = 0; i < dailyForecast.length; i++) {
        dailyForecast[i].dt = new Date(dailyForecast[i].dt * 1000).toLocaleDateString('en-US', options);
    }

    return dailyForecast;
}

function CreateGraphData(result) {
    //To be implemented in future
    if (!result || !result.data || !result.data.daily) {
        return [];
    }

    const hourlyForecast = result.data.hourly;
    const options = { hour: "numeric",hour12: true };
    for (let i = 0; i < 10; i++) {
        hourlyForecast[i].dt = new Date(hourlyForecast[i].dt * 1000).toLocaleString('en-US', options);
    }

    return hourlyForecast.slice(0,10);
}

app.get("/", async (req, res) => {
    console.log(__dirname);
    JSON_API = getState();
    
    if (!canCallAPI()) {
        return res.send("API call limit reached. Please try again tomorrow.");
    }

    //Goa,India
    const latNow = "15.2128";
    const lonNow = "74.0772";
    const resultWeather = await axios.get(
        WEATHER_API_URL,
        {
            params: {
                lat: latNow,
                lon: lonNow,
                units: "metric",
                appid: API_KEY
            }
        }    
    )
    const resultWeatherOverview = await axios.get(
        `${WEATHER_API_URL}/overview`, 
        {
            params: {
                lat: latNow,
                lon: lonNow,
                units: "metric",
                appid: API_KEY
            }
        }
    );
  
    JSON_API.count+=2;
    setState(JSON_API);
    
    // const weatherDescription = resultWeather.data.current.weather[0].description;
    // const tempCelsius = resultWeather.data.current.temp.toFixed(2);
    // const feelsLikeCelsius = resultWeather.data.current.feels_like.toFixed(2);
    // const humidity = resultWeather.data.current.humidity;
    // const icon = resultWeather.data.current.weather[0].icon;
    // const dailyForecast = getDailyForecastDate(resultWeather);

    const apiCallsLeft = JSON_API.limit - JSON_API.count;
    console.log(`API Calls Left: ${apiCallsLeft}`);

    res.render("index.ejs", {
        apiCallsLeft: apiCallsLeft,
        weatherDescription: resultWeather.data?.current,
        weatherOverview: resultWeatherOverview.data?.weather_overview,
        dailyForecast: convertDailyForecastDate(resultWeather),
        hourlyForecast: CreateGraphData(resultWeather)

        // weatherDescription: weatherDescription,
        // tempCelsius: tempCelsius,    
        // feelsLikeCelsius: feelsLikeCelsius,
        // humidity: humidity,
        // icon: icon,
        // forecast: daily,
        // overviewResults: overviewResults
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
