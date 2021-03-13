import json
from flask import Flask, render_template, jsonify
import pandas as pd
import os
import requests
import re
from sqlalchemy import create_engine
import pymysql
import datetime
#%%
from config import remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd

#%%
#from fbprophet import Prophet
#%%
pymysql.install_as_MySQLdb()
engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")

#%%

app = Flask(__name__)

#%%

@app.route("/")
def index():
    return render_template("index.html")

#%%

@app.route("/nasdaq")
def nasdaq():
    conn = engine.connect()

    query = '''
    select * from NASDAQ
    '''

    nasdaq_data = pd.read_sql(query, con=conn)
    nasdaq_json = nasdaq_data.to_json(orient="records")

    conn.close()
    return nasdaq_json

#%%

@app.route("/tickerlist")
def tickerlist(): 
    
    cwd = os.getcwd()
    
    tickerlist = pd.read_csv("static/data/tickerlist_industries.csv")
    tickerlist_json = tickerlist.to_json(orient='records')   #orient='columns'
    
    return tickerlist_json
#%%

if __name__ == "__main__":
    app.run(debug=True)
#%%
