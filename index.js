import express from "express";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
const API_KEY = process.env.API_KEY;
console.log(API_KEY);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
    console.log(__dirname);
    const JSON_API = JSON.parse(fs.readFileSync(path.join(__dirname,"api-call-limit.json")));
    const API_CALL_LIMIT = JSON_API.limit;  //Max 1000 on OpenWeatherApp 3.0 free plan
    const today = new Date().toISOString().slice(0,10); //YYYY-MM-DD
    
    if (JSON_API.reset !== today) {
        JSON_API.count = 0;
        JSON_API.reset = today;
        fs.writeFileSync(path.join(__dirname,"api-call-limit.json"), JSON.stringify(JSON_API, null, 4));
    }

    if (JSON_API.count >= API_CALL_LIMIT) {
        return res.send("API call limit reached. Please try again later.");
    }
    
    //Goa,India
    // const latNow = "15.2993";
    // const lonNow = "74.1240";
    // const result = await axios.get(
    //     WEATHER_API_URL,
    //     {
    //         params: {
    //             lat: latNow,
    //             lon: lonNow,
    //             appid: API_KEY
    //         }
    //     }    
    // )
    JSON_API.count++;
    fs.writeFileSync(path.join(__dirname,"api-call-limit.json"), JSON.stringify(JSON_API, null, 4));
    //console.log(result.data);
   
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




