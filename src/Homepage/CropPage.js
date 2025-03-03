import React, { useState } from "react";
import { Button, Card } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./CropPage.css";
import CropSuggestion from "./CropSuggestion";
import Devices from "./Devices";
import wheatImg from "../assets/images/wheat.jpg";
import riceImg from "../assets/images/rice.jpeg";
import cornImg from "../assets/images/corn.jpg";
import vegetablesImg from "../assets/images/vegetables.jpg";

const CropPage = ({ onBack }) => {
  const [showDevices, setShowDevices] = useState(false);
  
  const cropImages = {
    Wheat: wheatImg,
    Rice: riceImg,
    Corn: cornImg,
    Vegetables: vegetablesImg,
  };

  if (showDevices) {
    return <Devices onBack={() => setShowDevices(false)} />;
  }

  return (
    <div className="crop-container">
      <div className="header-buttons">
        <Button 
          className="back-button" 
          onClick={onBack} 
          type="primary" 
          icon={<LeftOutlined />} 
          size="large"
        >
          Back
        </Button>

        <Button 
          className="devices-button" 
          onClick={() => setShowDevices(true)} 
          type="default"
          size="large"
        >
          Devices
        </Button>
      </div>

      <header className="crop-header">
        <h1>Smart Crop Suggestions</h1>
        <p>Find the best crops to grow based on climate, soil type.</p>
      </header>

      <section className="crop-suggestions">
        <h2>CHOOSE YOUR CROPS</h2>
        <div className="crop-grid">
          {Object.keys(cropImages).map((crop, index) => (
            <Card 
              className="crop-card" 
              key={index}
              hoverable
              cover={<img alt={crop} src={cropImages[crop]} />}
            >
              <h3>{crop}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="crop-analysis">
        <h2>Crop Analysis</h2>
        <CropSuggestion />
      </section>

      <footer className="crop-footer">
        <p>Powered by IntelliGrow | Smart Agriculture Solutions</p>
      </footer>
    </div>
  );
};

export default CropPage;
