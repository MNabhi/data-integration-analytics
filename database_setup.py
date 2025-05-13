from sqlalchemy import create_engine
import pandas as pd

DATABASE_URL = "postgresql://postgres:pratham.182@localhost:5432/multi_source_db"


def store_data(df):
    engine = create_engine(DATABASE_URL)
    df.to_sql("integrated_data", engine, if_exists="replace", index=False)
    print("Data stored successfully!")

if __name__ == "__main__":
    df = pd.read_csv("cleaned_data.csv")
    store_data(df)
