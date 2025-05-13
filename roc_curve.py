import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc

# Sample actual labels (replace this with your real y_true values)
y_true = np.array([0, 0, 1, 1, 1, 0, 1, 0, 1, 1])

# Sample model scores (replace this with your real y_scores values)
y_scores = np.array([0.1, 0.4, 0.35, 0.8, 0.92, 0.3, 0.75, 0.2, 0.85, 0.9])

# Compute ROC curve and AUC score
fpr, tpr, _ = roc_curve(y_true, y_scores)
roc_auc = auc(fpr, tpr)

# Plot ROC curve
plt.figure()
plt.plot(fpr, tpr, color='blue', lw=2, label=f'ROC Curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='gray', linestyle='--')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.legend(loc="lower right")

# Save the ROC Curve as an image
plt.savefig("roc_curve.png")
plt.show()
