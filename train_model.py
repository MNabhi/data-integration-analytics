import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

# Generate dummy data
X = np.random.rand(100, 5)  # 100 samples, 5 features

# Train an Isolation Forest model
model = IsolationForest(contamination=0.1)
model.fit(X)

# Save the model
joblib.dump(model, "anomaly_detector.pkl")

print("Model saved as anomaly_detector.pkl")
