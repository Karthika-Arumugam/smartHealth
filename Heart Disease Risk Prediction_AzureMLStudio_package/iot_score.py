# This script generates the scoring file
# with the init and run functions needed to 
# operationalize the anomaly detection sample

import pickle
import json
import pandas
import joblib

from sklearn.linear_model import Ridge
from azureml.core.model import Model

def init():
    global model
    # this is a different behavior than before when the code is run locally, even though the code is the same.
    model_path = Model.get_model_path('model.pkl')
    # deserialize the model file back into a sklearn model
    model = joblib.load(model_path)

# note you can pass in multiple rows for scoring
def run(input_str):
    try:
        input_json = json.loads(input_str)
        input_df = pandas.DataFrame([[input_json['age'],input_json['chol'],input_json['cigs'],input_json['cp_1'],input_json['cp_2'],input_json['cp_3'],input_json['cp_4'],input_json['dig'],input_json['diuretic'],input_json['exang'],
input_json['famhist'],input_json['fbs'],input_json['htn'],input_json['met'],input_json['nitr'],input_json['old_peak'],input_json['painexer'],input_json['painloc'],input_json['pro'],input_json['prop'],input_json['relrest'],input_json['restecg_0.0'],input_json['restecg_1.0'],input_json['restecg_2.0'],input_json['rldv5'],input_json['rldv5e'],input_json['sex'],input_json['slope'],input_json['thalach'],input_json['thaldur'],input_json['thalrest'],input_json['tpeakbpd'],input_json['tpeakbps'],input_json['trestbpd'],input_json['trestbps'],input_json['xhypo'],input_json['years']]])
        pred = model.predict(input_df)
        print("Prediction is ", pred[0])
    except Exception as e:
        result = str(e)
        
    if pred[0] == 0:
        input_json['risk_level']="Normal"
        input_json['risk_factor']=0
    elif pred[0] == 1:
        input_json['risk_level']="Low"
        input_json['risk_factor']=1
    elif pred[0] == 2:
        input_json['risk_level']="Medium"
        input_json['risk_factor']=2
    else:
        input_json['risk_level']="Critical"
        input_json['risk_factor']=3
    return [json.dumps(input_json)]
