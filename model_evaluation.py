import pandas as pd
from sklearn.metrics import precision_score, recall_score, f1_score

# Load the processed data
df = pd.read_csv("cleaned_data_with_anomalies.csv")

# Convert anomaly labels to numeric (1 for Normal, 0 for Anomaly)
df["anomaly"] = df["anomaly"].map({"Normal": 1, "Anomaly": 0})

# Generate dummy "true" labels (Assume 95% data is normal, 5% is anomaly)
y_true = [1 if i < 95 else 0 for i in range(len(df))]
y_pred = df["anomaly"]

# Calculate evaluation metrics
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1 Score: {f1:.2f}")
