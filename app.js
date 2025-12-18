import express from "express";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import * as apiQuery from "./components/api-query.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let geoCodeData = {};

app.get("/", async (req, res) => {
    //JSON_API = apiQuery.getState();
    
    const canCallAPI = apiQuery.canCallAPI()
    if (!canCallAPI.allowed) {
        return res.send("API call limit reached. Please try again tomorrow.");
    }
  
    const resultWeather = await apiQuery.queryWeatherData();
    const resultWeatherOverview = await apiQuery.queryWeatherDataOverview();
    canCallAPI.data.count+=2;
    apiQuery.setState(canCallAPI.data);
    
    // const weatherDescription = resultWeather.data.current.weather[0].description;
    // const tempCelsius = resultWeather.data.current.temp.toFixed(2);
    // const feelsLikeCelsius = resultWeather.data.current.feels_like.toFixed(2);
    // const humidity = resultWeather.data.current.humidity;
    // const icon = resultWeather.data.current.weather[0].icon;
    // const dailyForecast = getDailyForecastDate(resultWeather);

    const apiCallsLeft = canCallAPI.data.limit - canCallAPI.data.count;
    console.log(`API Calls Left: ${apiCallsLeft}`);

    res.render("app.ejs", {
        apiCallsLeft: apiCallsLeft,
        weatherDescription: resultWeather.data?.current,
        weatherOverview: resultWeatherOverview.data?.weather_overview || "Data Not Found",
        dailyForecast: apiQuery.convertDailyForecastDate(resultWeather),
        hourlyForecast: apiQuery.CreateGraphData(resultWeather),
        geoCodeData: geoCodeData
        // weatherDescription: weatherDescription,
        // tempCelsius: tempCelsius,    
        // feelsLikeCelsius: feelsLikeCelsius,
        // humidity: humidity,
        // icon: icon,
        // forecast: daily,
        // overviewResults: overviewResults
    });
});

app.post("/search", async (req, res) => {
    const searchItem = req.body.searchPlace.trim();

    if (!searchItem) {
        return res.redirect("/");
    }
    try {      
        geoCodeData = await apiQuery.queryGeocodingData(searchItem);
        console.log(geoCodeData);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }   
})


export default app; 