import pandas as pd 
import json
from datetime import date, timedelta, datetime

def concatenarAnnos(nombre: str):
    anno12 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2012-01-01_2012-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno13 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2013-01-01_2013-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno14 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2014-01-01_2014-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno15 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2015-01-01_2015-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno16 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2016-01-01_2016-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno17 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2017-01-01_2017-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno18 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2018-01-01_2018-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno19 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2019-01-01_2019-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno20 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2020-01-01_2020-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno21 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2021-01-01_2021-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno22 = pd.read_csv(
        "./Datasets/" + nombre + "/" + nombre + " 2022-01-01_2022-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )

    annoDF = pd.concat(
        [
            anno12,
            anno13,
            anno14,
            anno15,
            anno16,
            anno17,
            anno18,
            anno19,
            anno20,
            anno21,
            anno22,
        ],
        axis=0,
    )

    return annoDF

def getUnder(d, indexes):
    
    prevDate = datetime.strptime(d, "%d/%m/%Y")
    sol = None
    
    while sol == None:
        prev = prevDate - timedelta(1)
        if prev in indexes:
            sol = prev
        else:
            prevDate = prev
    return str(sol.date())
            
def getOver(d, indexes):
    
    prevDate = datetime.strptime(d, "%d/%m/%Y")
    sol = None
    
    while sol == None:
        prev = prevDate + timedelta(1)
        if prev in indexes:
            sol = prev
        else:
            prevDate = prev
    return str(sol.date())

def fixMissing(d, indexes, pantano):
    under = getUnder(d, indexes)
    over = getOver(d, indexes)
    
    underValue = pantano.loc[pd.DatetimeIndex([under])]["Reserva"][0]
    overValue = pantano.loc[pd.DatetimeIndex([over])]["Reserva"][0]

    pantano.loc[datetime.strptime(d, "%d/%m/%Y")] = [round((underValue + overValue) / 2, 2)]

pantanos = json.load(open("./pantanos.json", "r", encoding="utf8"))
for name in pantanos:
    pantano = concatenarAnnos(name)
    indexes = pantano.index
    
    hay = len(indexes)
    date_set = set(indexes[0] + timedelta(x) for x in range((indexes[-1] - indexes[0]).days))
    missing = sorted(date_set - set(indexes))
    faltantes = []
    for i in missing:
        faltantes.append(i.strftime("%d/%m/%Y"))

    for i in faltantes:
        fixMissing(i, indexes, pantano)

    pantano = pantano.sort_index()
    pantano.to_csv("./Datasets/"+name+".csv")