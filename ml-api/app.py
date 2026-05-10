from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/api/predict/demand", methods=["POST"])
def predict_demand():
    data = request.json
    product_name = data.get("product_name", "Product")
    historical_sales = data.get("historical_sales", [])
    
    if len(historical_sales) < 3:
        forecast = 50
        confidence = "Low (Insufficient Data)"
    else:
        # Simple Weighted Moving Average
        weights = np.linspace(0.5, 1.0, len(historical_sales))
        weighted_avg = np.average(historical_sales, weights=weights)
        
        # Calculate trend
        trend = "upward" if historical_sales[-1] > historical_sales[0] else "stable/downward"
        
        # Add safety margin if trend is upward
        forecast = int(weighted_avg * (1.15 if trend == "upward" else 1.05))
        confidence = "High" if len(historical_sales) > 10 else "Medium"
    
    return jsonify({
        "product_name": product_name,
        "prediction": forecast,
        "trend": trend if len(historical_sales) >= 3 else "N/A",
        "confidence": confidence,
        "suggestion": f"We recommend stocking {forecast} kg based on current {trend if len(historical_sales) >= 3 else ''} trends."
    })

@app.route("/api/recommend", methods=["POST"])
def recommend_products():
    data = request.json
    purchased_items = data.get("purchased_items", [])
    
    # Collaborative filtering logic placeholder
    recommendations = [
        {"product_name": "Premium Saffron 5g", "reason": "Often bought with rice"},
        {"product_name": "Organic Dal 1kg", "reason": "Complementary good"}
    ]
    return jsonify({"recommendations": recommendations})

@app.route("/api/fraud/detect", methods=["POST"])
def fraud_detect():
    data = request.json
    amount = data.get("amount", 0)
    customer_history_avg = data.get("customer_history_avg", 50)
    
    if amount > customer_history_avg * 5:
        return jsonify({"fraud_score": 0.85, "alert": "High risk of fraud: Unusually large transaction."})
        
    return jsonify({"fraud_score": 0.1, "alert": "Normal transaction."})

if __name__ == "__main__":
    # Run on port 5001 to avoid conflicting with Node.js on 5000
    app.run(port=5001, debug=True)
