import pickle

# Load the model
with open('rent-prediction.pkl', 'rb') as f:
    model = pickle.load(f)

# Print basic model info
print("Model type:", type(model))
print("\nModel parameters:")
print(model.get_params())

# Print all attributes
print("\nAll attributes:")
for attr in dir(model):
    if not attr.startswith('_'):  # Skip private attributes
        print(attr)

# Print feature importances if available
if hasattr(model, 'feature_importances_'):
    print("\nFeature importances:")
    print(model.feature_importances_)

# Print number of features if available
if hasattr(model, 'n_features_in_'):
    print("\nNumber of features:", model.n_features_in_)