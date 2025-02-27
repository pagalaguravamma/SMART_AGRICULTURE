import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";
import "./Temperature.css"; // Import CSS for styling

const { Title, Text } = Typography;

const Temperature = () => {
    const [data, setData] = useState({ temperature: 0, humidity: 0, soil_moisture: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://smart-irrigation-3.onrender.com/data");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                console.log("API Response:", result);
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const humidityRotation = (data.humidity / 100) * 180 - 90;

    const getSoilMoistureType = (moisture) => {
        if (moisture < 30) return "Dry";
        if (moisture < 70) return "Moist";
        return "Wet";
    };

    return (
        <Card className="temperature-card">
            <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
                Sensor Data
            </Title>
            <div className="sensor-container">
                {/* Row for Temperature and Humidity */}
                <div className="row">
                    <div className="sensor-item">
                        <div className="thermometer">
                            <svg
                                width="80"
                                height="200"
                                viewBox="0 0 80 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect x="30" y="10" width="20" height="180" rx="10" fill="#f0f0f0" />
                                <rect
                                    x="30"
                                    y={190 - (data.temperature / 100) * 180}
                                    width="20"
                                    height={(data.temperature / 100) * 180}
                                    rx="10"
                                    fill="url(#temperature-gradient)"
                                />
                                <circle cx="40" cy="190" r="15" fill="url(#temperature-gradient)" />
                                <defs>
                                    <linearGradient id="temperature-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0000ff" />
                                        <stop offset="100%" stopColor="#ff0000" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <Text className="sensor-label">Temperature: {data.temperature}°C</Text>
                    </div>

                    <div className="sensor-item">
                        <div className="humidity-gauge">
                            <svg
                                width="200"
                                height="120"
                                viewBox="0 0 200 120"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 110 A90 90 0 0 1 190 110"
                                    stroke="#f0f0f0"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M10 110 A90 90 0 0 1 190 110"
                                    stroke="url(#humidity-gradient)"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    strokeDasharray="282.743"
                                    strokeDashoffset={282.743 - (data.humidity / 100) * 282.743}
                                />
                                <line
                                    x1="100"
                                    y1="110"
                                    x2="100"
                                    y2="30"
                                    stroke="#000"
                                    strokeWidth="3"
                                    transform={`rotate(${humidityRotation} 100 110)`}
                                    strokeLinecap="round"
                                />
                                <circle cx="100" cy="110" r="5" fill="#000" />
                                <defs>
                                    <linearGradient id="humidity-gradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#add8e6" />
                                        <stop offset="100%" stopColor="#00008b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <Text className="sensor-label">Humidity: {data.humidity}%</Text>
                    </div>
                </div>

                {/* Row for Soil Moisture, centered */}
                <div className="soil-row">
                    <div className="sensor-item">
                        <div className="soil-moisture">
                            <div className="bucket">
                                <div
                                    className="water"
                                    style={{ height: `${data.soil_moisture}%` }}
                                ></div>
                            </div>
                            <Text className="soil-type">
                                Soil: {getSoilMoistureType(data.soil_moisture)}
                            </Text>
                        </div>
                        <Text className="sensor-label">Soil Moisture: {data.soil_moisture}%</Text>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Temperature;