import kagglehub

# Dataset Link: https://www.kaggle.com/datasets/austinreese/usa-housing-listings
path = kagglehub.dataset_download("austinreese/usa-housing-listings")
print("Path to dataset files:", path)