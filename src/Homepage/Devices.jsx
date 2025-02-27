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
    wheat: { growth_days: 120, water_required_per_acre_liters: 500000, daily_water_consumption_liters: 4167, soil_moisture_percent: 50 },
    rice: { growth_days: 150, water_required_per_acre_liters: 1000000, daily_water_consumption_liters: 6667, soil_moisture_percent: 70 }
};

const soil_adjustment_factors = { sandy: 1.2, loamy: 1.0, clay: 0.8 };

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
    
            // Send Soil Moisture Requirements
            await sendSoilMoistureThreshold(data.soil_moisture_percent);
        } catch (error) {
            console.error("Error uploading data:", error);
            message.error("Failed to upload data.");
        }
    };
    
    // Function to send soil moisture to threshold API
    const sendSoilMoistureThreshold = async (moisture) => {
        const thresholdPayload = {
            min: moisture,
            max: moisture,
        };
    
        try {
            const response = await fetch("https://smart-irrigation-2.onrender.com/threshold", {
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
                <Input value={`Estimated End Date: ${endDate}`} disabled style={{ width: "100%", fontWeight: "bold" }} />
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
