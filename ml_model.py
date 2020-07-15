import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, ShuffleSplit, cross_val_score

class Dataset:
    def __init__(self, city_code):
        self.city_code = city_code
        self.raw_data = self.get_transaction_data()
        self.params = {
            "required_cols": ["Type", "TradePrice", "Area", "FloorPlan"],
            "float_values": ["TradePrice", "Area"],
            "rows_to_drop": {"column": "Type", "values": ["Agricultural Land", "Forest Land"]},
            "dummies": ["Type", "FloorPlan"]
        }

        self.clean_data = self.clean_data()
       
    def get_transaction_data(self):

        resp = requests.get(
            f"https://www.land.mlit.go.jp/webland_english/api/TradeListSearch?from=20101&to=20192&city={self.city_code}")
        resp = resp.json()
        data = resp["data"]

        return pd.DataFrame(data=data)

    def clean_data(self):

        # Get raw data
        data = self.raw_data
        # Filter columns
        data = self.filter_cols(data)
        # Remove data points that are not floats
        data = self.clean_floats(data)
        # Remove Agricultural Land and Forest Land
        data = self.drop_rows(data)

        # Create FloorPlan column if necessary
        if "FloorPlan" not in data.columns.values:
            data["FloorPlan"] = "no_layout"
        # Fill NaN in FloorPlan
        data = self.fillna(data, "FloorPlan", "no_layout")
        # Drop if not enough data points in FloorPlan
        data = self.drop_if_few_data(data, "FloorPlan", 5)

        ############ REMOVING OUTLIERS ##################

        # Create Price Per Square Meter column
        data["price_per_sqm"] = (data["TradePrice"]/10000) / data["Area"]

        ##Remove data points greater than one standard deviation
        data = self.remove_pps_outliers(data)

        #Create dummies
        type_dummies = pd.get_dummies(data.Type)
        floor_plan_dummies = pd.get_dummies(data.FloorPlan)

        #Set type_ and floor plan properties
        self.type_ = [type_ for type_ in type_dummies.columns]
        self.floor_plan = [floor_plan for floor_plan in floor_plan_dummies.columns]

        data = pd.concat([type_dummies,data,floor_plan_dummies], axis="columns")
        
        data = data.drop(["price_per_sqm","Type","FloorPlan"],axis="columns")

        return data

    def filter_cols(self, df):
        return df.filter(self.params["required_cols"])

    def is_float(self, x):
        try:
            return float(x)
        except:
            return None

    def clean_floats(self, df):
        fields = self.params["float_values"]
        for field in fields:
            df[field] = df[field].apply(self.is_float)

        df = df.dropna(subset=[field for field in fields])
        return df

    def drop_rows(self, df):
        df_out = df.copy()
        rows = self.params["rows_to_drop"]

        for value in rows["values"]:
            df_out.drop(df_out[df_out[rows["column"]]
                               == value].index, inplace=True)
        return df_out

    def fillna(sefl, df, col, val):
        df[col] = df[col].fillna(val)
        return df

    def drop_if_few_data(self, df, col, count):
        cat = df.groupby(col)[col].agg("count")
        cat_less_than = cat[cat < count]

        df[col] = df[col].apply(lambda x: None if x in cat_less_than else x)
        df.dropna(subset=[col])
        return df

    def remove_pps_outliers(self, df):
        df_out = pd.DataFrame()
        for key, subdf in df.groupby("Type"):
            mean = np.mean(subdf.price_per_sqm)
            stdev = np.std(subdf.price_per_sqm)

            reduce_df = subdf[(subdf.price_per_sqm > (mean - stdev))
                          & (subdf.price_per_sqm <= (mean + stdev))]
            df_out = pd.concat([df_out, reduce_df], ignore_index=True)

        return df_out

class PricePredictionModel:
    def __init__(self,dataset):
        self.dataset = pd.DataFrame(dataset.clean_data)
        self.city_code = dataset.city_code
        self.X = self.dataset.drop(["TradePrice"],axis="columns")
        self.y = self.dataset.TradePrice
        self.lr = self.train_data()
        self.type_ = dataset.type_
        self.floor_plan = dataset.floor_plan

    def train_data(self):
        lr = LinearRegression()
        X_train, X_test, y_train, y_test = train_test_split(self.X,self.y,test_size=0.2,random_state=10)
        lr.fit(X_train, y_train)
        return lr
    
    def predict_price(self,type_, area, floor_plan="no_layout"):
        area_index = np.where(self.X.columns == "Area")[0][0]
        type_index = np.where(self.X.columns == type_)[0][0]
        floor_plan_index = np.where(self.X.columns == floor_plan)[0][0]
        
        x = np.zeros(len(self.X.columns))
        x[area_index] = area
        x[type_index] = 1
        x[floor_plan_index] = 1
        prediction = self.lr.predict([x])[0]
    
        return self.formatCurrency(prediction)
    
    def cross_validation_score(self):
        cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)
        return cross_val_score(LinearRegression(), self.X, self.y, cv=cv)

    def formatCurrency(self,num):
        return  "¥ {:,.0f}".format(num)

    
    
    