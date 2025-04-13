import React, { useState, useEffect } from "react";
import Temperature from "./Temperature";
import "./Devices.css";

const crop_data = {
    wheat: { growth_days: 120, water_required_per_acre_liters: 500000, daily_water_consumption_liters: 4167, soil_moisture_percent: 50 },
    rice: { growth_days: 150, water_required_per_acre_liters: 1000000, daily_water_consumption_liters: 6667, soil_moisture_percent: 70 },
    corn: { growth_days: 110, water_required_per_acre_liters: 600000, daily_water_consumption_liters: 5455, soil_moisture_percent: 60 },
    soybean: { growth_days: 100, water_required_per_acre_liters: 450000, daily_water_consumption_liters: 4500, soil_moisture_percent: 55 },
    barley: { growth_days: 90, water_required_per_acre_liters: 400000, daily_water_consumption_liters: 4444, soil_moisture_percent: 50 },
    oats: { growth_days: 100, water_required_per_acre_liters: 450000, daily_water_consumption_liters: 4500, soil_moisture_percent: 55 },
    sorghum: { growth_days: 120, water_required_per_acre_liters: 500000, daily_water_consumption_liters: 4167, soil_moisture_percent: 50 },
    millet: { growth_days: 90, water_required_per_acre_liters: 350000, daily_water_consumption_liters: 3889, soil_moisture_percent: 45 },
    tomato: { growth_days: 90, water_required_per_acre_liters: 400000, daily_water_consumption_liters: 4444, soil_moisture_percent: 50 },
    lettuce: { growth_days: 60, water_required_per_acre_liters: 300000, daily_water_consumption_liters: 5000, soil_moisture_percent: 60 },
    pepper: { growth_days: 90, water_required_per_acre_liters: 450000, daily_water_consumption_liters: 5000, soil_moisture_percent: 55 },
    strawberry: { growth_days: 90, water_required_per_acre_liters: 350000, daily_water_consumption_liters: 3889, soil_moisture_percent: 45 }
};

const soil_adjustment_factors = {
    sandy: 1.2,
    loamy: 1.0,
    clay: 0.8
};

const Devices = ({ onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({});
    const [calculationResults, setCalculationResults] = useState({});
    const [manualDurations, setManualDurations] = useState({});
    const [isManualMode, setIsManualMode] = useState({});

    // State for each crop card's selections
    const [cropSelections, setCropSelections] = useState({});
    const [soilSelections, setSoilSelections] = useState({});
    const [acresValues, setAcresValues] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://192.168.31.124:2041/get_data");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
                
                // Initialize manual mode states based on config
                const newManualModes = {};
                Object.keys(result.config).forEach(key => {
                    const sensorKey = `sensor${key}`;
                    newManualModes[sensorKey] = !result.config[key].automatic_mode;
                });
                setIsManualMode(newManualModes);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleUpload = async (sensorKey) => {
        const cropNumber = parseInt(sensorKey.replace("sensor", ""));
        const selectedCrop = cropSelections[sensorKey] || data.config[cropNumber].name.toLowerCase();
        const selectedSoil = soilSelections[sensorKey];
        const acres = acresValues[sensorKey] || 1;

        if (!selectedCrop || !selectedSoil) {
            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: "Please select both crop and soil type"
            }));
            return;
        }

        try {
            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: "Calculating..."
            }));

            // First API call to calculate
            const cropInfo = crop_data[selectedCrop] || crop_data[selectedCrop.toLowerCase()];
            const payload = {
                crop_name: selectedCrop.toLowerCase(),
                land_area: Number(acres),
                soil_type: selectedSoil.toLowerCase(),
            };

            const calculateResponse = await fetch("https://smart-irrigation-2.onrender.com/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!calculateResponse.ok) {
                throw new Error("Calculation failed");
            }

            const calculateData = await calculateResponse.json();
            setCalculationResults(prev => ({
                ...prev,
                [sensorKey]: calculateData
            }));

            // Second API call to update crop
            const updatePayload = {
                crop_number: cropNumber,
                name: selectedCrop,
                min_threshold: cropInfo.soil_moisture_percent - 10,
                max_threshold: cropInfo.soil_moisture_percent + 10,
                automatic_mode: !isManualMode[sensorKey],
                manual_duration: isManualMode[sensorKey] ? manualDurations[sensorKey] || 0 : 0
            };

            const updateResponse = await fetch("http://192.168.31.124:2040/update_crop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatePayload),
            });

            if (!updateResponse.ok) {
                throw new Error("Update failed");
            }

            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: "Upload successful!"
            }));

        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: `Error: ${error.message}`
            }));
        }
    };

    const handleManualIrrigation = async (sensorKey) => {
        const cropNumber = parseInt(sensorKey.replace("sensor", ""));
        const duration = manualDurations[sensorKey] || 0;

        try {
            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: "Starting manual irrigation..."
            }));

            const response = await fetch("http://192.168.31.124:2040/set_manual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    crop_number: cropNumber,
                    duration: duration
                }),
            });

            if (!response.ok) {
                throw new Error("Manual irrigation failed");
            }

            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: `Manual irrigation started for ${duration} seconds`
            }));

        } catch (error) {
            console.error("Manual irrigation error:", error);
            setUploadStatus(prev => ({
                ...prev,
                [sensorKey]: `Error: ${error.message}`
            }));
        }
    };

    const toggleManualMode = (sensorKey) => {
        setIsManualMode(prev => ({
            ...prev,
            [sensorKey]: !prev[sensorKey]
        }));
    };

    const handleManualDurationChange = (sensorKey, value) => {
        setManualDurations(prev => ({
            ...prev,
            [sensorKey]: Number(value)
        }));
    };

    const handleCropChange = (sensorKey, value) => {
        setCropSelections(prev => ({
            ...prev,
            [sensorKey]: value
        }));
    };

    const handleSoilChange = (sensorKey, value) => {
        setSoilSelections(prev => ({
            ...prev,
            [sensorKey]: value
        }));
    };

    const handleAcresChange = (sensorKey, value) => {
        setAcresValues(prev => ({
            ...prev,
            [sensorKey]: Number(value)
        }));
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error fetching data: {error.message}</div>;
    }

    const { temperature, humidity } = data.data;
    const crops = data.config;

    return (
        <div className="devices-container">
            <div className="devices-header">
                <h1>Device Dashboard</h1>
                <button className="back-button" onClick={onBack}>
                    Back to Home
                </button>
            </div>

            <div className="dashboard-layout">
                <div className="left-section">
                    <div className="sensor-section">
                        <Temperature temperature={temperature} humidity={humidity} />
                        <div className="timestamp">
                            Last updated: {new Date(data.timestamp).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <h2>Crop Configuration</h2>
                    <div className="crop-grid-container">
                        <div className="crop-grid">
                            {Object.entries(crops).map(([key, config]) => {
                                const sensorKey = `sensor${key}`;
                                const sensor = data.data[sensorKey];
                                const cropNumber = parseInt(key);
                                const results = calculationResults[sensorKey];
                                const currentCrop = config.name.toLowerCase();
                                
                                return (
                                    <div key={key} className="crop-card">
                                        <div className="card-header">
                                            <h3 className="crop-title">{config.name} (Crop {cropNumber})</h3>
                                            <div className="mode-toggle">
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={!!isManualMode[sensorKey]}
                                                        onChange={() => toggleManualMode(sensorKey)}
                                                    />
                                                    Manual Mode
                                                </label>
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <div className="sensor-display">
                                                <div className="sensor-row">
                                                    <span className="sensor-label">Current Mode:</span>
                                                    <span className="sensor-value">{sensor.mode}</span>
                                                </div>
                                                <div className="sensor-row">
                                                    <span className="sensor-label">Moisture:</span>
                                                    <span className="sensor-value">{sensor.moisture}%</span>
                                                </div>
                                                <div className="sensor-row">
                                                    <span className="sensor-label">Thresholds:</span>
                                                    <span className="sensor-value">{sensor.min_threshold}% - {sensor.max_threshold}%</span>
                                                </div>
                                                <div className="sensor-row">
                                                    <span className="sensor-label">Relay Status:</span>
                                                    <span className={`sensor-value relay-${sensor.relay_status.toLowerCase()}`}>
                                                        {sensor.relay_status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Crop:</label>
                                                <select 
                                                    value={cropSelections[sensorKey] || currentCrop}
                                                    onChange={(e) => handleCropChange(sensorKey, e.target.value)}
                                                >
                                                    {Object.keys(crop_data).map((cropName) => (
                                                        <option key={cropName} value={cropName}>
                                                            {cropName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Soil Type:</label>
                                                <select 
                                                    value={soilSelections[sensorKey] || ""}
                                                    onChange={(e) => handleSoilChange(sensorKey, e.target.value)}
                                                >
                                                    <option value="">Select Soil Type</option>
                                                    {Object.keys(soil_adjustment_factors).map((soilType) => (
                                                        <option key={soilType} value={soilType}>
                                                            {soilType}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Acres:</label>
                                                <input
                                                    type="number"
                                                    value={acresValues[sensorKey] || 1}
                                                    onChange={(e) => handleAcresChange(sensorKey, e.target.value)}
                                                    min="1"
                                                />
                                            </div>

                                            {isManualMode[sensorKey] && (
                                                <div className="manual-controls">
                                                    <div className="form-group">
                                                        <label>Duration (seconds):</label>
                                                        <input
                                                            type="number"
                                                            value={manualDurations[sensorKey] || 0}
                                                            onChange={(e) => handleManualDurationChange(sensorKey, e.target.value)}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <button 
                                                        className="manual-button"
                                                        onClick={() => handleManualIrrigation(sensorKey)}
                                                    >
                                                        Start Irrigation
                                                    </button>
                                                </div>
                                            )}

                                            <div className="action-buttons">
                                                <button 
                                                    className="upload-button"
                                                    onClick={() => handleUpload(sensorKey)}
                                                >
                                                    Update Configuration
                                                </button>
                                            </div>

                                            {uploadStatus[sensorKey] && (
                                                <div className={`status-message ${uploadStatus[sensorKey].includes("Error") ? "error" : "success"}`}>
                                                    {uploadStatus[sensorKey]}
                                                </div>
                                            )}

                                            {results && (
                                                <div className="calculation-results">
                                                    <h4>Water Requirements</h4>
                                                    <div className="results-grid">
                                                        <div className="result-item">
                                                            <span className="result-label">Total (with rainfall):</span>
                                                            <span className="result-value">{results.total_water_requirements.with_rainfall.toLocaleString()} L</span>
                                                        </div>
                                                        <div className="result-item">
                                                            <span className="result-label">Total (without rainfall):</span>
                                                            <span className="result-value">{results.total_water_requirements.without_rainfall.toLocaleString()} L</span>
                                                        </div>
                                                        <div className="result-item">
                                                            <span className="result-label">Daily (with rainfall):</span>
                                                            <span className="result-value">{results.daily_water_requirements.with_rainfall.toLocaleString()} L/day</span>
                                                        </div>
                                                        <div className="result-item">
                                                            <span className="result-label">Daily (without rainfall):</span>
                                                            <span className="result-value">{results.daily_water_requirements.without_rainfall.toLocaleString()} L/day</span>
                                                        </div>
                                                        <div className="result-item">
                                                            <span className="result-label">Growth Period:</span>
                                                            <span className="result-value">{results.growth_days} days</span>
                                                        </div>
                                                        <div className="result-item">
                                                            <span className="result-label">Soil Moisture:</span>
                                                            <span className="result-value">{results.required_soil_moisture}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Devices;