import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
dotenv.config();

const API_KEY = process.env.API_KEY;
const today = new Date().toISOString().slice(0,10); //YYYY-MM-DD
let JSON_API = {};

const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const FW_GEOCODING_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
//Goa,India
let latNow = 15.2128;
let lonNow = 74.0772;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const JSON_path = path.join(__dirname,"api-call-limit.json");

function getState() {
    return JSON.parse(fs.readFileSync(JSON_path, "utf-8"));
}

function setState(state) {
    fs.writeFileSync(JSON_path, JSON.stringify(state, null, 4));
}

function canCallAPI() {
    const JSON_API = getState();
    const apiCallLimit = JSON_API.limit;  //Max 1000 on OpenWeatherApp 3.0 free plan
  
    if (JSON_API.resetOn !== today) {
        JSON_API.count = 0;
        JSON_API.resetOn = today;
        setState(JSON_API);
    }
    return {allowed: JSON_API.count < apiCallLimit, data: JSON_API};  
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

async function forwardGeocodingSearch() {
    return await axios.get(
        FW_GEOCODING_API_URL,
        {
            params: {
                lat: latNow,
                lon: lonNow,
                units: "metric",
                appid: API_KEY
            }
        }    
    )
}

async function queryWeatherData() {
    // console.log("Weather: " + typeof(latNow));
    return await axios.get(
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
}

async function queryWeatherDataOverview() {
    return await axios.get(
        `${WEATHER_API_URL}/overview`,
        {
            params: {
                lat: latNow,
                lon: lonNow,
                units: "metric",
                appid: API_KEY
            }
        }    
    )
}

async function queryGeocodingData(place) {

    try {
        
        const result = await axios.get(
            FW_GEOCODING_API_URL,
            {   
                params: {
                    q: place,
                    limit: 5,
                    appid: API_KEY
                }
            }    
        )
        
        const country = result.data[0].country;
        const state = result.data[0].state;
        const placeFound = result.data[0].name;   
        latNow = result.data[0].lat;
        lonNow = result.data[0].lon;
       
        
        return {placeFound, state, country};
    } catch (error) {
        console.log(error);
    }
}

export {getState, setState, canCallAPI, convertDailyForecastDate, CreateGraphData, queryWeatherData, queryWeatherDataOverview, queryGeocodingData};