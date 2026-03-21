import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# load dataset
data = pd.read_csv("data/Crop_recommendation.csv")

X = data[["N","P","K","temperature","humidity","ph","rainfall"]]
y = data["label"]

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2)

model = RandomForestClassifier()
model.fit(X_train,y_train)

pickle.dump(model,open("model/crop_model.pkl","wb"))

print("Model trained successfully")