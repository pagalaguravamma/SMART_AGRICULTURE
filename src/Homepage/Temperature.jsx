import React from "react";
import { Card, Typography } from "antd";
import "./Temperature.css";

const { Title, Text } = Typography;

const Temperature = ({ temperature, humidity }) => {
    const humidityRotation = (humidity / 100) * 180 - 90;

    return (
        <Card className="temperature-card">
            <Title level={4} className="card-title">
                Environment Sensors
            </Title>
            
            <div className="sensor-container">
                <div className="sensor-row">
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
                                    y={190 - (temperature / 100) * 180}
                                    width="20"
                                    height={(temperature / 100) * 180}
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
                        <Text className="sensor-label">Temperature: {temperature}°C</Text>
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
                                    strokeDashoffset={282.743 - (humidity / 100) * 282.743}
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
                        <Text className="sensor-label">Humidity: {humidity}%</Text>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export default Temperature;