from flask import Flask, jsonify, render_template
import csv
import pandas as pd
import numpy as np

app = Flask(__name__)

#Reading data
data_df = pd.read_csv("static/data/Churn_data.csv")
churn_df = data_df[(data_df['Churn']=="Yes").notnull()] 

@app.route('/')
def index():
    return render_template('index.html')

def calculate_percentage(val, total):
    """Calculates the percentage of a value over a total"""
    percent = np.round((np.divide(val, total) * 100), 2)
    return percent

def data_creation(data, percent, class_labels, group=None):
    for index, item in enumerate(percent):
        data_instance = {}
        data_instance['category'] = class_labels[index]
        data_instance['measure'] = item
        data_instance['group'] = group
        data.append(data_instance)

@app.route('/get_piechart_data')
def get_piechart_data():
    contract_labels = ['Month-to-month', 'One year', 'Two year']
    _ = churn_df.groupby('Contract').size().values
    class_percent = calculate_percentage(_, np.sum(_)) #Getting the value counts and total

    piechart_data= []
    data_creation(piechart_data, class_percent, contract_labels)
    return jsonify(piechart_data)

@app.route('/get_barchart_data')
def get_barchart_data():
    tenure_labels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79']
    churn_df['tenure_group'] = pd.cut(churn_df.tenure, range(0, 81, 10), labels=tenure_labels)
    select_df = churn_df[['tenure_group','Contract']]
    contract_month = select_df[select_df['Contract']=='Month-to-month']
    contract_one = select_df[select_df['Contract']=='One year']
    contract_two =  select_df[select_df['Contract']=='Two year']
    _ = contract_month.groupby('tenure_group').size().values
    mon_percent = calculate_percentage(_, np.sum(_))
    _ = contract_one.groupby('tenure_group').size().values
    one_percent = calculate_percentage(_, np.sum(_))
    _ = contract_two.groupby('tenure_group').size().values
    two_percent = calculate_percentage(_, np.sum(_))
    _ = select_df.groupby('tenure_group').size().values
    all_percent = calculate_percentage(_, np.sum(_))

    barchart_data = []
    data_creation(barchart_data,all_percent, tenure_labels, "All")
    data_creation(barchart_data,mon_percent, tenure_labels, "Month-to-month")
    data_creation(barchart_data,one_percent, tenure_labels, "One year")
    data_creation(barchart_data,two_percent, tenure_labels, "Two year")
    return jsonify(barchart_data)
    
if __name__ == '__main__':
    app.run(debug=True)
                   