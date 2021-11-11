const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

//configure dotnev package
require("dotenv").config();

// Set up your OpenWeatherMap API_KEY
const apiKey = `${process.env.API_KEY}`;

// Setup your express app and body-parser configurations
// Setup your javascript template view engine
// we will serve your static pages from the public directory, it will act as your root directory

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Setup your default display on launch
app.get("/", function (req, res) {
    // It will not fetch and display any data in the index page
    res.render("index", { weather: null, error: null });
});
// On a post request, the app shall data from OpenWeatherMap using the given arguments

app.post('/', function (req, res) {
    let city = req.body.city;
    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?id=${city}&units=metric&appid=${apiKey}`;
    console.log(url);
    // Request for data using the URL
    request(url, function (err, response, body) {
        // On return, check the json data fetched
        if (err) {
            res.render('index', { weather: null, error: 'Error, please try again' });
        }
        else {
            debugger;
            let weather = JSON.parse(body);
            // you shall output it in the console just to make sure that the data being displayed is what you want
            console.log(weather);
            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again.' })
            }
            else {
                // we shall use the data got to set up your output
                debugger;
                let place = `${weather.name}, ${weather.sys.country}`,
                    /* you shall calculate the current timezone using the data fetched*/
                    weatherTimeZone = `${new Date(
                        weather.dt * 1000 - weather.timezone * 1000
                    )}`;
                let weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,
                    /* you will fetch the weather icon and its size using the icon data*/
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    weatherFahrenheit = (weatherTemp * 9) / 5 + 32;
                function roundToTwo(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }
                weatherFahrenheit = roundToTwo(weatherFahrenheit);
                // you shall now render the data to your page (index.ejs) before displaying it out
                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimeZone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    main: main,
                    error: null,
                });
            }
        }
    });
});
// you will set up your port configurations. You will also start the server and add a message to display when running.
app.listen(5000, function () {
    console.log("Weather app listening on port 5000");
});

