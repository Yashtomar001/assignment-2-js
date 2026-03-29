/* The commented code block is a JavaScript function named `getWeather` that is designed to fetch
weather data from the OpenWeatherMap API based on the user input city. Here's a breakdown of what
the code does: */
const apiKey = "YOUR_API_KEY_HERE";

async function getWeather(){
    const city = document.getElementById("city").value;

    const response = await fetch(
        `https://www.accuweather.com/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if(data.cod !== 200){
        alert("City not found");
        return;
    }

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;

    const condition = data.weather[0].main;

    if(condition === "Clear"){
        document.getElementById("icon").innerText = "☀️";
        document.body.style.background="linear-gradient(135deg,#f7971e,#ffd200)";
    }
    else if(condition === "Rain"){
        document.getElementById("icon").innerText = "🌧️";
        document.body.style.background="linear-gradient(135deg,#2c3e50,#4ca1af)";
        createRain();
    }
    else if(condition === "Snow"){
        document.getElementById("icon").innerText = "❄️";
        document.body.style.background="linear-gradient(135deg,#83a4d4,#b6fbff)";
    }
    else{
        document.getElementById("icon").innerText = "☁️";
        document.body.style.background="linear-gradient(135deg,#757f9a,#d7dde8)";
    }
}

function createRain(){
    for(let i=0;i<60;i++){
        let drop=document.createElement("div");
        drop.classList.add("rain");
        drop.style.left=Math.random()*window.innerWidth+"px";
        drop.style.animationDuration=(Math.random()*1+0.5)+"s";
        document.body.appendChild(drop);
        setTimeout(()=>drop.remove(),1000);
    }
}


document.getElementById("getWeather ").addEventListener("click", getWeather);

require("dotenv").config()
const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
app.use(cors())

app.get("/weather", async (req, res) => {
    const { lat, lon } = req.query
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/3.0/onec`,
            {
                params: {
                    lat,
                    lon,
                    exclude: "minutely",
                    units: "metric",
                    appid: process.env.API_KEY
                }
            }
        )
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch weather" })
    }
})

app.listen(5000, () => console.log("Server running on port 5000"))

import { useEffect, useState } from "react"
import axios from "axios"
import ForecastSlider from "./ForecastSlider"
import WindAnimation from "./WindAnimation"

function App() {

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords

      const res = await axios.get(
        `http://localhost:5000/weather?lat=${latitude}&lon=${longitude}`
      )

      setWeather(res.data)
    })
  }, [])

  if (!weather) return <h2>Loading...</h2>

  return (
    <div className="container">
      <h1>{Math.round(weather.current.temp)}°C</h1>
      <h3>{weather.current.weather[0].description}</h3>

      <WindAnimation speed={weather.current.wind_speed} />

      <ForecastSlider daily={weather.daily} />

      <h3>AQI: {weather.current.air_quality?.aqi || "Check API"}</h3>
    </div>
  )
}

export default App

import { motion } from "framer-motion"

function WindAnimation({ speed }) {

  return (
    <motion.div
      animate={{ x: [0, 20, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2 / speed
      }}
      style={{
        fontSize: "40px"
      }}
    >
      💨
    </motion.div>
  )
}


