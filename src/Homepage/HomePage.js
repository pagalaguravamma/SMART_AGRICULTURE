import React, { useState } from "react";
import { Button, Card, Row, Col, Typography } from "antd";
import { EnvironmentOutlined, RobotOutlined, LineChartOutlined, CloudOutlined } from "@ant-design/icons";
import CropPage from "./CropPage";
import Rainfall from "./Rainfall"; // Import Rainfall component
import "./Home.css";

const { Title, Paragraph } = Typography;

const Home = () => {
  const [showCropPage, setShowCropPage] = useState(false);
  const rainfallData = 120; // Example rainfall data, replace with dynamic data

  const handleGetStarted = () => {
    setShowCropPage(true);
  };

  const handleBackToHome = () => {
    setShowCropPage(false);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar with Rainfall Card */}
      <nav className="navbar">
        <Card className="rainfall-card">
          <Rainfall data={rainfallData} />
        </Card>
      </nav>
      
      {showCropPage ? (
        <CropPage onBack={handleBackToHome} />
      ) : (
        <>
          <header className="hero">
            <div className="hero-content">
            <div className="slogan">
          <Title level={3}>"Revolutionizing Agriculture, One Drop at a Time"</Title>
        </div>
              <Title level={1}>Welcome to IntelliGrow</Title>
              <div className="slogan">
              <Title level={3}>"Smart Agriculture Solutions for Modern Farming"</Title>
        </div>
              <Button type="primary" size="large" className="cta-button" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </header>

          <section className="features">
            <Title level={2}>Key Features</Title>
            <Row gutter={[16, 16]} className="feature-grid">
              <Col xs={24} sm={12} md={6}>
                <Card className="feature-card">
                  <EnvironmentOutlined className="feature-icon" />
                  <Title level={4}>Crop Monitoring</Title>
                  <Paragraph>Real-time tracking of crop health and growth patterns</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="feature-card">
                  <RobotOutlined className="feature-icon" />
                  <Title level={4}>Automation Control</Title>
                  <Paragraph>Remote management of farming equipment</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="feature-card">
                  <LineChartOutlined className="feature-icon" />
                  <Title level={4}>Analytics Dashboard</Title>
                  <Paragraph>Comprehensive data visualization and insights</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="feature-card" onClick={() => setShowCropPage(false)}>
                  <CloudOutlined className="feature-icon" />
                  <Title level={4}>Rainfall Prediction</Title>
                  <Paragraph>Accurate rainfall forecasts for smarter irrigation</Paragraph>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials">
            <Title level={2}>What Farmers Say</Title>
            <Row gutter={[16, 16]} className="testimonial-cards">
              <Col xs={24} sm={12} md={10} lg={8}>
                <Card className="testimonial">
                  <Paragraph>"IntelliGrow revolutionized our farming operations. Yield increased dramatically!"</Paragraph>
                  <Title level={4}>- John D., AgriFarm Co.</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={10} lg={8}>
                <Card className="testimonial">
                  <Paragraph>"The automated irrigation system cut our water costs in half."</Paragraph>
                  <Title level={4}>- Maria S., Organic Valley</Title>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Benefits Section */}
          <section className="benefits">
            <Title level={2}>Why Choose IntelliGrow?</Title>
            <Row gutter={[16, 16]} className="benefits-grid">
              <Col xs={24} sm={8}>
                <Card className="benefit-item">
                  <Title level={3}>30% Yield Increase</Title>
                  <Paragraph>Optimized growing conditions maximize production</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="benefit-item">
                  <Title level={3}>40% Water Savings</Title>
                  <Paragraph>Smart irrigation reduces water waste</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="benefit-item">
                  <Title level={3}>24/7 Monitoring</Title>
                  <Paragraph>Round-the-clock crop protection</Paragraph>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-content">
              <Title level={3}>IntelliGrow</Title>
              <Paragraph>Contact us: info@intelligrow.com</Paragraph>
              <Paragraph>© 2023 IntelliGrow. All rights reserved.</Paragraph>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Home;
