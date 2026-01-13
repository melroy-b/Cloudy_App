var icons = [];

export default function displayImageOnUI(weatherDescription) {
    icons.length = 0;

    const UVI_INDEX = weatherDescription.uvi;
    const weatherInfo = weatherDescription.weather[0].description;
    const temp = weatherDescription.temp.toFixed(2);

    getUVIAdvice(UVI_INDEX)
    getClothingAdvice({temp, weatherInfo})

    return icons; 
}

function getUVIAdvice(UVI_INDEX) {

    if (UVI_INDEX >= 3) {
        icons.push("sunscreen")
    }
    if (UVI_INDEX >= 11) {
        icons.push("scorching-sun")
    }
}

function getClothingAdvice({temp, weatherInfo}) {
    if (temp < 15) icons.push("winter-wear");
    if (temp < 5) icons.push("snowfall");

    if (weatherInfo.includes("sunny") || weatherInfo.includes("cloud") || weatherInfo.includes("sky")) icons.push("sun");
    if (weatherInfo.includes("rain") || weatherInfo.includes("rainy")){
      icons.push("raincoat");  
      icons.push("rainy");
    } 
}