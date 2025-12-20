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

    const apiCallsLeft = canCallAPI.data.limit - canCallAPI.data.count;
    console.log(`API Calls Left: ${apiCallsLeft}`);

    res.render("app.ejs", {
        apiCallsLeft: apiCallsLeft,
        weatherDescription: resultWeather.data?.current,
        weatherOverview: resultWeatherOverview.data?.weather_overview || "Data Not Found",
        dailyForecast: apiQuery.convertDailyForecastDate(resultWeather),
        hourlyForecast: apiQuery.CreateGraphData(resultWeather),
        geoCodeData: geoCodeData
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