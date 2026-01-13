var icons = [];

export default function displayImageOnUI(weatherDescription) {
    try {
        icons.length = 0;

        const UVI_INDEX = weatherDescription.uvi;
        const weatherInfo = weatherDescription.weather[0].description;
        const temp = weatherDescription.temp.toFixed(2);
        const timeOfDay = weatherDescription.weather[0].icon//new Date(weatherDescription.temp * 1000).toLocaleString("en-US", {hour: "numeric", hour12: false});
        console.log(timeOfDay);

        getUVIAdvice(UVI_INDEX)
        getClothingAdvice({temp, weatherInfo, timeOfDay})

        return icons; 
    } catch (error) {
        console.log(error);
    }
    
}

function getUVIAdvice(UVI_INDEX) {

    if (UVI_INDEX >= 3) {
        icons.push("sunscreen")
    }
    if (UVI_INDEX >= 11) {
        icons.push("scorching-sun")
    }
}

function getClothingAdvice({temp, weatherInfo, timeOfDay}) {
    const weather = weatherInfo.toLowerCase();

    // Temperature-based icons
    if (temp < 5) {
    icons.push("snowfall", "winter-wear");
    } else if (temp < 15) {
    icons.push("winter-wear");
    }

    // Weather condition icons
    if (weather.includes("rain")) {
    icons.push("raincoat", "rainy");
    } else if (weather.includes("cloud") || weather.includes("sky")) {
    icons.push(timeOfDay.includes("d") ? "sun" : "moon");
    }

    // Air quality
    if (weather.includes("smoke")) {
    icons.push("mask");
    }
}