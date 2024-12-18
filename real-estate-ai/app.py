# /app.py
from flask import Flask, request, jsonify
import pickle
import numpy as np
import os
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'rent-prediction.pkl')
model = joblib.load(model_path)


@app.route('/predict', methods=['POST'])
def predict():    
    try:
        # Load and validate data
        data = request.get_json()
        if not all(k in data for k in ['sqfeet', 'lat', 'long', 'beds', 'baths']):
            return jsonify({'error': 'Missing required fields'}), 400

        # Convert string values to numeric
        new_data = {
            'type_number': 1,
            'sqfeet': float(data['sqfeet']),
            'lat': float(data['lat']),    
            'long': float(data['long']),
            'beds': float(data['beds']),
            'baths': float(data['baths']),
            'state_number': 1,
        }
        
        # Make prediction
        df = pd.DataFrame([new_data])
        prediction = model.predict(df)
        
        # Format response
        return jsonify({
            'status': 'success',
            'prediction': round(float(prediction[0]), 2)
        })

    except ValueError as e:
        return jsonify({'error': 'Invalid numeric values'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)