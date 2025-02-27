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
    const { name, value } = e.target;
    let parsedValue = parseFloat(value);

    // Validate no negative values
    if (parsedValue < 0) {
      message.error(`Negative values are not allowed for ${name.toUpperCase()}`);
      return;
    }

    // Validate N, P, K, temperature, and humidity do not exceed 100
    if (["N", "P", "K", "temperature", "humidity"].includes(name)) {
      if (parsedValue > 100) {
        message.error(`${name.toUpperCase()} should not exceed 100`);
        return;
      }
    }

    // Validate pH is between 1 and 14
    if (name === "ph") {
      if (parsedValue < 1 || parsedValue > 14) {
        message.error("pH value must be between 1 and 14");
        return;
      }
    }

    // Dispatch the value if validation passes
    dispatch({ name, value });
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

      // Use a CORS proxy to bypass CORS errors in development
      const apiUrl = "https://smart-irrigation-1.onrender.com/recommendation";
      const { data } = await axios.post(apiUrl, formattedValues, {
        headers: { "Content-Type": "application/json" },
      });
      
      if (data?.predicted_crop) {
        setResult(data);
      } else {
        message.warning("No crop recommendation received. Try different inputs.");
      }
    } catch (error) {
      message.error("Error fetching crop suggestions. Please try again.");
      console.error(error);
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
      {result?.predicted_crop && (
        <Card className="result-card">
          <h3 className="result-title">Recommended Crop:</h3>
          <p className="result-text">{result.predicted_crop}</p>
        </Card>
      )}
    </div>
  );
};

export default CropSuggestion;