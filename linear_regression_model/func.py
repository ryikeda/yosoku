import json
import requests
import csv

FUKUROI_CITY = "22216"
HANAMIGAWA_CITY = "12102"
SHINAGAWA = "13109"

def get_data(user_input):
  REQUIRED_FIELDS = ["Type","TradePrice","Area"]

  raw_data = get_transaction_data(user_input["city_code"])

  clean_data = filter_data(raw_data, REQUIRED_FIELDS)

  return clean_data

def get_transaction_data(city_code):
  """Make API resquest and returs data about past transaction prices"""

  resp = requests.get(f"https://www.land.mlit.go.jp/webland_english/api/TradeListSearch?from=20001&to=20192&city={city_code}")
  resp = resp.json()
  data = resp["data"]

  return data


def filter_data(json,arr):
  filtered_data = []
  for item in json:
    filtered_data.append(dict((key, value) for key, value in item.items() if key in arr))
  return filtered_data
    


def write_csv_file(filename, data):
  
  csv_file = open(filename,"w")
  csvwriter = csv.writer(csv_file)

  #create header
  keys = data[0].keys()
  csvwriter.writerow(keys)

  #write data
  for item in data:
    csvwriter.writerow(item.values())

  csv_file.close()


def write_json_file(filename, data):
  with open(filename,"w") as f:
    f.write(json.dumps(data))

raw_data = get_transaction_data(SHINAGAWA)
write_json_file("raw_data_shinagawa.json",raw_data)
# required_fields = ["Type","TradePrice","Area"]
# data = filter(raw_data, required_fields)
# csv = write_file("output.csv", data)




