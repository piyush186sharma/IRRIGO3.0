from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)

# ✅ IMPORTANT: enable CORS properly
CORS(app, resources={r"/*": {"origins": "*"}})

model = pickle.load(open("model/crop_model.pkl","rb"))

model = pickle.load(open("model/crop_model.pkl","rb"))

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    features = [[
        data["N"],
        data["P"],
        data["K"],
        data["temperature"],
        data["humidity"],
        data["ph"],
        data["rainfall"]
    ]]

    prediction = model.predict(features)
    probabilities = model.predict_proba(features)

    confidence = np.max(probabilities) * 100

    top3_index = probabilities[0].argsort()[-3:][::-1]
    top3_crops = [model.classes_[i] for i in top3_index]

    return jsonify({
        "recommended_crop": prediction[0],
        "confidence": round(confidence,2),
        "top3_recommendations": top3_crops
    })

if __name__ == "__main__":
    app.run(port=5001)