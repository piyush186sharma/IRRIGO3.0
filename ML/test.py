import pickle

profiles = pickle.load(open("model/crop_profiles.pkl", "rb"))

crop = "rice"

print(profiles.loc[crop])