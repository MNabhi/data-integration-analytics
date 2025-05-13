import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load the sample dataset
df = pd.read_csv("sample_data.csv")

# Compute correlation matrix
corr_matrix = df.corr()

# Plot heatmap
plt.figure(figsize=(10, 6))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Data Correlation Heatmap")
plt.show()
