import React, { useState } from "react";
import { Button, Card } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./CropPage.css";
import CropSuggestion from "./CropSuggestion";
import Devices from "./Devices"; // Import Devices Page

const CropPage = ({ onBack }) => {
  const [showDevices, setShowDevices] = useState(false);

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
        <p>Find the best crops to grow based on climate, soil type, and season.</p>
      </header>

      <section className="crop-suggestions">
        <h2>Recommended Crops</h2>
        <div className="crop-grid">
          {["Wheat", "Rice", "Corn", "Vegetables"].map((crop, index) => (
            <Card 
              className="crop-card" 
              key={index}
              hoverable
              cover={
                <img 
                  alt={crop}
                  src={`https://via.placeholder.com/200x150.png?text=${crop}`} 
                />
              }
            >
              <h3>{crop}</h3>
              <p>Best conditions for growing {crop.toLowerCase()}.</p>
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
