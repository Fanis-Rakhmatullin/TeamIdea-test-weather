const API_KEY = '5408ee9ba163a745d4bfca69fd528f22';
const MOSCOW_COORDS = {
    lat: 55.751244,
    lon: 37.618423
}
const url = `
https://api.openweathermap.org/data/2.5/onecall
?lat=${MOSCOW_COORDS.lat}
&lon=${MOSCOW_COORDS.lon}
&exclude=current,minutely,hourly,alerts
&appid=${API_KEY}
&units=metric
`;

function findMaxPressure(weatherDaysArray) {
    return Math.max(...weatherDaysArray);
}

function findMinTemperatureDifference(weatherDaysArray) {
    const dayWithMinTempDiff = weatherDaysArray
        .reduce((result, day, index) => {
            if (Math.abs(day.temp.night - day.temp.morn) < Math.abs(result.minValue)) {
                result.minValue = day.temp.night - day.temp.morn;
                result.index = index;
            }
            return result;
        }, {
            minValue: Infinity,
            index: 0
        })
    let date = new Date();
    date.setDate(date.getDate() + dayWithMinTempDiff.index);
    return {
        minValue: Math.round(dayWithMinTempDiff.minValue * 100) / 100,
        day: date
    };
}

function insertDataIntoDom(maxPressure, minTempDiff) {
    let pressure = document.querySelector('#max-pressure');
    let temperature = document.querySelector('#min-temperature');

    pressure.textContent = maxPressure;
    temperature.textContent = minTempDiff;
}


fetch(url)
    .then((response) => response.json())
    .then((weather) => {
        const pressureByDays = weather.daily.map(day => day.pressure);
        const maxPressure = findMaxPressure(pressureByDays.slice(0,5));
        console.log(`Максимальное давление в ближайшие 5 дней: ${Math.round(maxPressure / 1.3332)} мм. рт. ст.`);

        const dayWithMinTempDifference = findMinTemperatureDifference(weather.daily.slice(0,5));
        console.log(`${dayWithMinTempDifference.day.toLocaleDateString()} ожидается минимальная разница между ночной и утренней температурой (${dayWithMinTempDifference.minValue} °C)`);

        insertDataIntoDom(
            `${Math.round(maxPressure / 1.3332)} мм. рт. ст.`,
            `${dayWithMinTempDifference.day.toLocaleDateString()} (${dayWithMinTempDifference.minValue} °C)`
            )
    })
    .catch(() => console.error('Произошла ошибка, попробуйте повторить запрос через 10 минут'));


