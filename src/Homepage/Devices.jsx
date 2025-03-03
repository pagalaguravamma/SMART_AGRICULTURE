import React, { useState } from "react";
import { Button, Card, Select, Input, Row, Col, Typography, message } from "antd";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import "./Devices.css";
import dayjs from "dayjs";
import Temperature from "./Temperature";
import { Progress, Statistic } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const crop_data = {
    "wheat": {
        "growth_days": 120,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 4167,
        "soil_moisture_percent": 50
    },
    "rice": {
        "growth_days": 150,
        "water_required_per_acre_liters": 1000000,
        "daily_water_consumption_liters": 6667,
        "soil_moisture_percent": 70
    },
    "corn": {
        "growth_days": 110,
        "water_required_per_acre_liters": 600000,
        "daily_water_consumption_liters": 5455,
        "soil_moisture_percent": 60
    },
    "soybean": {
        "growth_days": 100,
        "water_required_per_acre_liters": 450000,
        "daily_water_consumption_liters": 4500,
        "soil_moisture_percent": 55
    },
    "barley": {
        "growth_days": 90,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 4444,
        "soil_moisture_percent": 50
    },
    "oats": {
        "growth_days": 100,
        "water_required_per_acre_liters": 450000,
        "daily_water_consumption_liters": 4500,
        "soil_moisture_percent": 55
    },
    "sorghum": {
        "growth_days": 120,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 4167,
        "soil_moisture_percent": 50
    },
    "millet": {
        "growth_days": 90,
        "water_required_per_acre_liters": 350000,
        "daily_water_consumption_liters": 3889,
        "soil_moisture_percent": 45
    },
    "potato": {
        "growth_days": 90,
        "water_required_per_acre_liters": 600000,
        "daily_water_consumption_liters": 6667,
        "soil_moisture_percent": 65
    },
    "sweet_potato": {
        "growth_days": 120,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 4583,
        "soil_moisture_percent": 60
    },
    "cassava": {
        "growth_days": 300,
        "water_required_per_acre_liters": 800000,
        "daily_water_consumption_liters": 2667,
        "soil_moisture_percent": 55
    },
    "sugarcane": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1500000,
        "daily_water_consumption_liters": 4109,
        "soil_moisture_percent": 70
    },
    "cotton": {
        "growth_days": 180,
        "water_required_per_acre_liters": 700000,
        "daily_water_consumption_liters": 3889,
        "soil_moisture_percent": 60
    },
    "sunflower": {
        "growth_days": 110,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 4545,
        "soil_moisture_percent": 55
    },
    "canola": {
        "growth_days": 100,
        "water_required_per_acre_liters": 450000,
        "daily_water_consumption_liters": 4500,
        "soil_moisture_percent": 50
    },
    "peanut": {
        "growth_days": 120,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 4167,
        "soil_moisture_percent": 55
    },
    "alfalfa": {
        "growth_days": 60,
        "water_required_per_acre_liters": 600000,
        "daily_water_consumption_liters": 10000,
        "soil_moisture_percent": 70
    },
    "clover": {
        "growth_days": 90,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 4444,
        "soil_moisture_percent": 60
    },
    "tomato": {
        "growth_days": 90,
        "water_required_per_acre_liters": 600000,
        "daily_water_consumption_liters": 6667,
        "soil_moisture_percent": 65
    },
    "cucumber": {
        "growth_days": 60,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 8333,
        "soil_moisture_percent": 70
    },
    "pepper": {
        "growth_days": 90,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 6111,
        "soil_moisture_percent": 65
    },
    "onion": {
        "growth_days": 120,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 4167,
        "soil_moisture_percent": 60
    },
    "garlic": {
        "growth_days": 150,
        "water_required_per_acre_liters": 450000,
        "daily_water_consumption_liters": 3000,
        "soil_moisture_percent": 55
    },
    "carrot": {
        "growth_days": 80,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 5000,
        "soil_moisture_percent": 60
    },
    "lettuce": {
        "growth_days": 60,
        "water_required_per_acre_liters": 300000,
        "daily_water_consumption_liters": 5000,
        "soil_moisture_percent": 70
    },
    "cabbage": {
        "growth_days": 90,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 5556,
        "soil_moisture_percent": 65
    },
    "broccoli": {
        "growth_days": 90,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 6111,
        "soil_moisture_percent": 65
    },
    "cauliflower": {
        "growth_days": 90,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 6111,
        "soil_moisture_percent": 65
    },
    "spinach": {
        "growth_days": 40,
        "water_required_per_acre_liters": 300000,
        "daily_water_consumption_liters": 7500,
        "soil_moisture_percent": 70
    },
    "pea": {
        "growth_days": 60,
        "water_required_per_acre_liters": 350000,
        "daily_water_consumption_liters": 5833,
        "soil_moisture_percent": 60
    },
    "bean": {
        "growth_days": 70,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 5714,
        "soil_moisture_percent": 60
    },
    "lentil": {
        "growth_days": 100,
        "water_required_per_acre_liters": 350000,
        "daily_water_consumption_liters": 3500,
        "soil_moisture_percent": 55
    },
    "chickpea": {
        "growth_days": 120,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 3333,
        "soil_moisture_percent": 50
    },
    "mustard": {
        "growth_days": 90,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 4444,
        "soil_moisture_percent": 55
    },
    "sesame": {
        "growth_days": 100,
        "water_required_per_acre_liters": 350000,
        "daily_water_consumption_liters": 3500,
        "soil_moisture_percent": 50
    },
    "flax": {
        "growth_days": 90,
        "water_required_per_acre_liters": 400000,
        "daily_water_consumption_liters": 4444,
        "soil_moisture_percent": 55
    },
    "safflower": {
        "growth_days": 120,
        "water_required_per_acre_liters": 450000,
        "daily_water_consumption_liters": 3750,
        "soil_moisture_percent": 50
    },
    "grape": {
        "growth_days": 180,
        "water_required_per_acre_liters": 800000,
        "daily_water_consumption_liters": 4444,
        "soil_moisture_percent": 60
    },
    "apple": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1000000,
        "daily_water_consumption_liters": 2739,
        "soil_moisture_percent": 65
    },
    "orange": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1200000,
        "daily_water_consumption_liters": 3288,
        "soil_moisture_percent": 70
    },
    "banana": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1500000,
        "daily_water_consumption_liters": 4109,
        "soil_moisture_percent": 75
    },
    "mango": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1300000,
        "daily_water_consumption_liters": 3562,
        "soil_moisture_percent": 70
    },
    "papaya": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1400000,
        "daily_water_consumption_liters": 3836,
        "soil_moisture_percent": 75
    },
    "pineapple": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1000000,
        "daily_water_consumption_liters": 2739,
        "soil_moisture_percent": 60
    },
    "strawberry": {
        "growth_days": 90,
        "water_required_per_acre_liters": 500000,
        "daily_water_consumption_liters": 5556,
        "soil_moisture_percent": 70
    },
    "blueberry": {
        "growth_days": 120,
        "water_required_per_acre_liters": 600000,
        "daily_water_consumption_liters": 5000,
        "soil_moisture_percent": 65
    },
    "raspberry": {
        "growth_days": 120,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 4583,
        "soil_moisture_percent": 65
    },
    "blackberry": {
        "growth_days": 120,
        "water_required_per_acre_liters": 550000,
        "daily_water_consumption_liters": 4583,
        "soil_moisture_percent": 65
    },
    "avocado": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1200000,
        "daily_water_consumption_liters": 3288,
        "soil_moisture_percent": 70
    },
    "olive": {
        "growth_days": 365,
        "water_required_per_acre_liters": 800000,
        "daily_water_consumption_liters": 2192,
        "soil_moisture_percent": 60
    },
    "coconut": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1500000,
        "daily_water_consumption_liters": 4109,
        "soil_moisture_percent": 75
    },
    "coffee": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1000000,
        "daily_water_consumption_liters": 2739,
        "soil_moisture_percent": 70
    },
    "tea": {
        "growth_days": 365,
        "water_required_per_acre_liters": 900000,
        "daily_water_consumption_liters": 2466,
        "soil_moisture_percent": 65
    },
    "cocoa": {
        "growth_days": 365,
        "water_required_per_acre_liters": 1200000,
        "daily_water_consumption_liters": 3288,
        "soil_moisture_percent": 75
    }
  }
  
  const soil_adjustment_factors = {
    "sandy": 1.2,
    "loamy": 1.0,
    "clay": 0.8
  }
  
const Devices = ({ onBack }) => {
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedSoil, setSelectedSoil] = useState(null);
    const [acres, setAcres] = useState("");
    const [totalWaterRequired, setTotalWaterRequired] = useState(0);
    const [apiResponse, setApiResponse] = useState(null);
    const today = dayjs().format("YYYY-MM-DD");

    const calculateWaterRequirement = () => {
        if (selectedCrop && selectedSoil && acres > 0) {
            const cropInfo = crop_data[selectedCrop];
            const soilFactor = soil_adjustment_factors[selectedSoil];
            const totalWater = cropInfo.water_required_per_acre_liters * acres * soilFactor;
            setTotalWaterRequired(totalWater);
        } else {
            setTotalWaterRequired(0);
        }
    };
    const handleSoilChange = (value) => {
        setSelectedSoil(value);
        calculateWaterRequirement();
    };
    const [endDate, setEndDate] = useState("");

    const handleCropChange = (value) => {
        setSelectedCrop(value);
        calculateWaterRequirement();
    
        if (crop_data[value]) {
            const growthDays = crop_data[value].growth_days;
            const estimatedEnd = dayjs().add(growthDays, 'day').format("YYYY-MM-DD");
            setEndDate(estimatedEnd);
        }
    };
    
    const handleAcresChange = (e) => {
        const value = e.target.value;
        if (value === "" || (parseFloat(value) > 0 && !isNaN(value))) {
            setAcres(value);
            calculateWaterRequirement();
        }
    };

    const handleUpload = async () => {
        if (!selectedCrop || !selectedSoil || !acres) {
            message.error("Please fill in all fields before uploading.");
            return;
        }
    
        const cropInfo = crop_data[selectedCrop];
    
        const payload = {
            crop_name: selectedCrop.toLowerCase(),
            land_area: Number(acres),
            soil_type: selectedSoil.toLowerCase(),
        };
    
        try {
            const response = await fetch("https://smart-irrigation-2.onrender.com/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) throw new Error("Network response was not ok");
    
            const data = await response.json();
            setApiResponse(data);
            message.success("Data uploaded successfully!");
    
            // Send Soil Moisture Requirements based on the selected crop
            await sendSoilMoistureThreshold(cropInfo.soil_moisture_percent);
        } catch (error) {
            console.error("Error uploading data:", error);
            message.error("Failed to upload data.");
        }
    };
    
    // Function to send soil moisture threshold
    const sendSoilMoistureThreshold = async (moisture) => {
        const thresholdPayload = {
            max: moisture,
            min: moisture,
        };
    
        try {
            const response = await fetch("https://smart-irrigation-3.onrender.com/threshold", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(thresholdPayload),
            });
    
            if (!response.ok) throw new Error("Failed to send soil moisture data.");
    
            message.success("Happy Monitoring! 🌱");
        } catch (error) {
            console.error("Error sending soil moisture:", error);
            message.error("Failed to send soil moisture data.");
        }
    };   

    return (
        <div className="devices-container">
            <div className="header-buttons">
                <Button className="back-button" onClick={onBack} type="primary" icon={<LeftOutlined />} size="large">
                    Back
                </Button>
            </div>

            <div className="main-content">
                <Card className="left-card">
                    <Temperature />
                </Card>

                <Card className="right-card" title="Crop Selection and Water Requirement">
                    <Row justify="center" gutter={[16, 16]}>
                        <Col span={24}>
                        <Row justify="center" gutter={[16, 16]}>
    <Col span={8}>
        <Select
            className="crop-select"
            placeholder="Select Crop"
            style={{ width: "100%" }}
            onChange={(value) => handleCropChange(value.toLowerCase())} // Convert to lowercase when sending
        >
            {Object.keys(crop_data).map((crop) => (
                <Option key={crop} value={crop.toLowerCase()}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)} {/* Display capitalized */}
                </Option>
            ))}
        </Select>
    </Col>
    <Col span={8}>
        <Select
            className="soil-select"
            placeholder="Select Soil Type"
            style={{ width: "100%" }}
            onChange={(value) => handleSoilChange(value.toLowerCase())} // Convert to lowercase when sending
        >
            {Object.keys(soil_adjustment_factors).map((soil) => (
                <Option key={soil} value={soil.toLowerCase()}>
                    {soil.charAt(0).toUpperCase() + soil.slice(1)} {/* Display capitalized */}
                </Option>
            ))}
        </Select>
    </Col>
    <Col span={8}>
        <Input 
            className="acre-input"
            placeholder="Number of Acres"
            type="number"
            style={{ width: "100%" }}
            value={acres}
            onChange={handleAcresChange}
            min="1"
        />
    </Col>
</Row>

                        </Col>
                        <Col span={24}>
                            <Row justify="center">
                                <Col span={8}>
                                    <Input value={today} disabled style={{ width: "100%" }} />
                                </Col>
                            </Row>
                        </Col>
                        {selectedCrop && (
    <Col span={24}>
        <Row justify="center">
            <Col span={8}>
                <Input value={`End Date: ${endDate}`} disabled style={{ width: "101%", fontWeight: "bold" }} />
            </Col>
        </Row>
    </Col>
)}

                        {totalWaterRequired > 0 && (
                            <Col span={24}>
                                <div className="results-section">
                                    <Text>
                                        <strong>Total Water Required:</strong> {totalWaterRequired.toLocaleString()} liters
                                    </Text>
                                </div>
                            </Col>
                        )}
                        <Col span={24} style={{ textAlign: "center" }}>
                            <Button className="upload-button" type="primary" icon={<UploadOutlined />} size="large" onClick={handleUpload}>
                                Upload Data
                            </Button>
                        </Col>
                        {apiResponse && (
    <div className="response-container">
        <Card className="response-card" title="Crop Details">
            <p><Text strong>Crop:</Text> {apiResponse.crop}</p>
            <p><Text strong>Growth Days:</Text> {apiResponse.growth_days} days</p>
            <p><Text strong>Land Area:</Text> {apiResponse.land_area} acres</p>
            <p><Text strong>Soil Type:</Text> {apiResponse.soil_type}</p>
        </Card>

        <Card className="response-card" title="Water & Rainfall Info">
            <p><Text strong>Required Soil Moisture:</Text> {apiResponse.required_soil_moisture}%</p>
            <p><Text strong>Predicted Rainfall:</Text> {apiResponse.predicted_rainfall.toFixed(2)} mm</p>
            <Progress percent={apiResponse.required_soil_moisture} status="active" />
        </Card>

        <Card className="response-card centered-card" title="Daily Water Requirements">
            <Statistic title="Rainfall Contribution" value={apiResponse.daily_water_requirements.rainfall_contribution.toFixed(2)} suffix="L" />
            <Statistic title="With Rainfall" value={apiResponse.daily_water_requirements.with_rainfall.toFixed(2)} suffix="L" />
            <Statistic title="Without Rainfall" value={apiResponse.daily_water_requirements.without_rainfall.toFixed(2)} suffix="L" />
            <Progress type="circle" percent={(apiResponse.daily_water_requirements.with_rainfall / apiResponse.daily_water_requirements.without_rainfall) * 100} strokeColor="#52c41a" />
        </Card>

        <Card className="response-card" title="Total Water Requirements">
            <Statistic title="With Rainfall" value={apiResponse.total_water_requirements.with_rainfall.toFixed(2)} suffix="L" />
            <Statistic title="Without Rainfall" value={apiResponse.total_water_requirements.without_rainfall.toFixed(2)} suffix="L" />
            <Progress type="dashboard" percent={(apiResponse.total_water_requirements.with_rainfall / apiResponse.total_water_requirements.without_rainfall) * 100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
        </Card>
    </div>
)}


                    </Row>
                </Card>
            </div>

            <footer className="devices-footer">
                <Row justify="center">
                    <Col>
                        <Text type="secondary">Powered by IntelliGrow | Smart Agriculture Solutions</Text>
                    </Col>
                </Row>
            </footer>
        </div>
    );
};

export default Devices;
