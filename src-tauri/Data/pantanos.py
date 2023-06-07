import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn.preprocessing import MinMaxScaler
import sys
import tempfile
import json
from json import JSONEncoder
import os


class GRU(nn.Module):
    def __init__(self, num_classes, input_size, hidden_size, num_layers, seq_length):
        super(GRU, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.gru = nn.GRU(input_size, hidden_size, num_layers, batch_first=True)
        self.fc1 = nn.Linear(hidden_size * seq_length, num_classes)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)

        out, _ = self.gru(x, h0)
        out = out.reshape(out.shape[0], -1)
        out = self.fc1(out)
        return out


class LSTM(nn.Module):
    def __init__(self, num_classes, input_size, hidden_size, num_layers, seq_length):
        super(LSTM, self).__init__()

        self.num_classes = num_classes
        self.num_layers = num_layers
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.seq_length = seq_length

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
        )

        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        h_0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)

        c_0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)

        # Propagate input through LSTM
        ula, (h_out, _) = self.lstm(x, (h_0, c_0))

        h_out = h_out.view(-1, self.hidden_size)

        out = self.fc(h_out)

        return out


def concatenarAnnos(nombre: str):
    anno12 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2012-01-01_2012-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno13 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2013-01-01_2013-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno14 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2014-01-01_2014-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno15 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2015-01-01_2015-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno16 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2016-01-01_2016-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno17 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2017-01-01_2017-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno18 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2018-01-01_2018-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno19 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2019-01-01_2019-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno20 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2020-01-01_2020-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno21 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2021-01-01_2021-12-30.csv",
        index_col=[0],
        parse_dates=True,
        dayfirst=True,
    )
    anno22 = pd.read_csv(
        "./Data/Datasets/" + nombre + "/" + nombre + " 2022-01-01_2022-12-30.csv",
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


def sliding_windows(data, seq_length):
    x = []
    y = []

    for i in range(len(data) - seq_length - 1):
        _x = data[i : (i + seq_length)]
        _y = data[i + seq_length]
        x.append(_x)
        y.append(_y)

    return np.array(x), np.array(y)


def mean_absolute_percentage_error(y_true, y_pred):
    """Calculates MAPE given y_true and y_pred"""
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


torch.set_default_device("cpu")
sc = MinMaxScaler()
name = str(sys.argv[1]).upper()

excepciones = [
    "ANDÉVALO",
    "GUADALCACÍN",
    "CHANZA",
    "IZNÁJAR",
    "ARENOSO",
    "GIRIBAILE",
    "GUADALEN",
    "LA BREÑA",
    "RUMBLAR",
]
color_pal = [
    "#F8766D",
    "#D39200",
    "#93AA00",
    "#00BA38",
    "#00C19F",
    "#00B9E3",
    "#619CFF",
    "#DB72FB",
]  # Paleta de colores Rojo - Naranja - Verdes - Azules - Morado

torch.device("cpu")

dataset = concatenarAnnos(name)
model = torch.load("./Data/Modelos/" + name + ".pt", map_location=torch.device("cpu"))
seq_length = 21

if name in excepciones:
    seq_length = 14

training_data = sc.fit_transform(dataset)
x, y = sliding_windows(training_data, seq_length)

dataX = torch.Tensor(np.array(x))
dataY = torch.Tensor(np.array(y))

model.cpu()
model.eval()
train_predict = model(dataX)

data_predict = train_predict.data.cpu().numpy()
dataY_plot = dataY.data.cpu().numpy()

data_predict = sc.inverse_transform(data_predict)
dataY_plot = sc.inverse_transform(dataY_plot)

dates = dataset.index
fechas = []
for i in dates:
    fechas.append(str(i))

tempFolder = tempfile.gettempdir() + "/Pantanos"
checkFolder = os.path.isdir(tempFolder)

# If folder doesn't exist, then create it.
if not checkFolder:
    os.makedirs(tempFolder)

with open(tempFolder + "/data.json", "w") as tmpFile:
    json.dump(
        {
            "prediction": np.concatenate(data_predict),
            "original": np.concatenate(dataY_plot),
            "dates": np.array(fechas),
        },
        tmpFile,
        cls=NumpyArrayEncoder,
    )
