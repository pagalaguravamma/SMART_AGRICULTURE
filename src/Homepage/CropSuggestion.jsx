import React, { useReducer, useState } from "react";
import axios from "axios";
import { message, Input, Button, Card, Spin } from "antd";
import "./CropSuggestion.css";

// Reducer to manage input values
const reducer = (state, action) => ({
  ...state,
  [action.name]: action.value,
});

const CropSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Initial state for form inputs
  const [values, dispatch] = useReducer(reducer, {
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // Handle input changes with useReducer
  const handleChange = (e) => {
    dispatch({ name: e.target.name, value: e.target.value });
  };

  // Validate inputs
  const validateInputs = () => {
    for (const key in values) {
      if (!values[key].trim() || isNaN(values[key])) {
        message.error(`Please enter a valid number for ${key.toUpperCase()}`);
        return false;
      }
    }
    return true;
  };

  // Fetch crop recommendations
  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formattedValues = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [key, parseFloat(val)])
      );

      const { data } = await axios.post(
        "http://localhost:5000/api/croprecommendation",
        formattedValues
      );

      if (data?.recommendation) {
        setResult(data);
      } else {
        message.warning("No crop recommendation received. Try different inputs.");
      }
    } catch (error) {
      message.error("Error fetching crop suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-suggestion-container">
      <h2>Enter Soil & Climate Data</h2>
      <div className="input-container">
        {Object.keys(values).map((key) => (
          <Card key={key} className="input-card">
            <label className="input-label">{key.toUpperCase()}</label>
            <Input
              name={key}
              type="number"
              value={values[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="custom-input"
            />
          </Card>
        ))}
      </div>
      <Button
        type="primary"
        className="submit-button"
        loading={loading}
        onClick={handleSubmit}
      >
        {loading ? "Analyzing..." : "Get Crop Suggestion"}
      </Button>

      {/* Show Results */}
      {loading && <Spin size="large" className="loading-spinner" />}
      {result?.recommendation && (
        <Card className="result-card">
          <h3 className="result-title">Recommended Crops:</h3>
          <p className="result-text">{result.recommendation}</p>
        </Card>
      )}
    </div>
  );
};

export default CropSuggestion;
