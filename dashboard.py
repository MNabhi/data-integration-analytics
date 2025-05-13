import streamlit as st
import pandas as pd
import joblib

# Load Model
model = joblib.load("anomaly_detector.pkl")

st.title("Real-Time Anomaly Detection Dashboard")

uploaded_file = st.file_uploader("Upload CSV for Analysis", type=["csv"])

if uploaded_file:
    data = pd.read_csv(uploaded_file)
    st.write("Preview of Uploaded Data:")
    st.write(data.head())

    predictions = model.predict(data)
    data["Anomaly"] = predictions
    st.write("Predictions:")
    st.write(data)

    st.bar_chart(data["Anomaly"].value_counts())

