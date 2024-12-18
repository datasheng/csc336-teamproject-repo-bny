from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import matplotlib.pyplot as plt
import joblib
import seaborn as sns
import os



current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, '..', 'rent-prediction.pkl')
model = joblib.load(model_path)

new_data = {
    'type_number': 1,
    'sqfeet': 1200,
    'lat': 37.7749,    
    'long': -122.4194,
    'beds': 2,
    'baths': 2,
    'state_number': 34,
}

df = pd.DataFrame([new_data])

prediction = model.predict(df)

print(f'Predicted rent: {prediction[0]}')

