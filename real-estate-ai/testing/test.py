import pickle
import numpy as np

# Load the model
with open('rent-prediction.pkl', 'rb') as f:
    loaded_model = pickle.load(f)

# Create sample test data
test_data = np.random.rand(5, 4)  # 5 samples with 4 features each

# Make predictions
predictions = loaded_model.predict(test_data)

print("Test data shape:", test_data.shape)
print("Predictions:", predictions)