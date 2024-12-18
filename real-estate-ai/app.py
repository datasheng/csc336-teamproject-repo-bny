# /app.py
from flask import Flask, request, jsonify
import pickle
import numpy as np
import os
import joblib
import pandas as pd

app = Flask(__name__)


current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'rent-prediction.pkl')
model = joblib.load(model_path)


@app.route('/predict', methods=['POST'])
def predict():    
    #load data from the body
    data = request.get_json()
    #convert data to dataframe

    new_data = {
    'type_number': 1,
    'sqfeet': data['sqfeet'],
    'lat': data['lat'],    
    'long': data['long'],
    'beds': data['beds'],
    'baths': data['baths'],
    'state_number': 1,
    }
    print(data)

    df = pd.DataFrame([new_data])

    prediction = model.predict(df)

    return jsonify({float(prediction[0])})

if __name__ == '__main__':
    app.run()