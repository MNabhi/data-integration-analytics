from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    df = pd.read_csv("cleaned_data.csv")
    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
