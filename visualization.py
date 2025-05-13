import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load the cleaned dataset
df = pd.read_csv("cleaned_data.csv")

# Select only numeric columns for correlation
numeric_df = df.select_dtypes(include=['number'])

# Check if there are numeric columns before plotting
if not numeric_df.empty:
    plt.figure(figsize=(10, 6))
    sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm")
    plt.title("Data Correlation Heatmap")
    plt.show()
else:
    print("No numeric columns found for correlation.")
