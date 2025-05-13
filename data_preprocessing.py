import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

def clean_data(df):
    # Handle missing values
    df.fillna(method='ffill', inplace=True)

    # Remove duplicates
    df.drop_duplicates(inplace=True)

    # Standardize column names
    df.columns = df.columns.str.lower().str.replace(" ", "_")

    return df

def detect_anomalies(df):
    numeric_df = df.select_dtypes(include=['number']).dropna()

    if numeric_df.empty:
        print("No numeric columns found for anomaly detection.")
        return df

    model = IsolationForest(contamination=0.05, random_state=42)
    df["anomaly"] = model.fit_predict(numeric_df)

    # Label 1 = Normal, -1 = Anomalous
    df["anomaly"] = df["anomaly"].map({1: "Normal", -1: "Anomaly"})

    return df

if __name__ == "__main__":
    data = load_data("data.csv")
    cleaned_data = clean_data(data)
    processed_data = detect_anomalies(cleaned_data)
    
    processed_data.to_csv("cleaned_data_with_anomalies.csv", index=False)
    print("Data cleaning and anomaly detection complete!")
