import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# load dataset
data = pd.read_csv("data/Crop_recommendation.csv")

# features and label
X = data[["N","P","K","temperature","humidity","ph","rainfall"]]
y = data["label"]

# split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# save model
pickle.dump(model, open("model/crop_model.pkl", "wb"))

# 🔥 NEW: create crop-wise average profiles
crop_profiles = data.groupby("label").mean()

# save profiles
pickle.dump(crop_profiles, open("model/crop_profiles.pkl", "wb"))

print("Model + Crop profiles saved successfully!")