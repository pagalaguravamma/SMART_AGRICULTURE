import React, { useEffect, useState } from "react";
import { Spin } from "antd";

const Rainfall = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://smart-irrigation-1.onrender.com/predict")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin size="small" style={{ marginLeft: 10 }} />;
  }

  if (!data) {
    return <span style={{ color: "red", marginLeft: 10 }}>Failed to load data</span>;
  }

  const { predicted_rainfall, weather_data } = data;

  return (
    <span style={{ fontSize: "14px", fontWeight: "bold", marginLeft: 10 }}>
      🌧️ Predicted Rainfall: {predicted_rainfall.toFixed(2)} mm | 🌡️ Temp: {weather_data.temp}°F | 
      🌬️ Wind: {weather_data.windspeed} km/h | ☁️ Cloud: {weather_data.cloudcover}%
    </span>
  );
};

export default Rainfall;
