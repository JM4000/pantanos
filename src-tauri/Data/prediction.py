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
import datetime

class GRU(nn.Module):
    def __init__(self, num_classes, input_size, hidden_size, num_layers, seq_length):
        super(GRU, self).__init__()
        self.hidden_size  = hidden_size
        self.num_layers = num_layers
        
        self.gru = nn.GRU(input_size, hidden_size, num_layers, batch_first=True)
        self.fc1 = nn.Linear(hidden_size * seq_length, num_classes)
    
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        
        out,_ = self.gru(x, h0)
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
        
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size,
                            num_layers=num_layers, batch_first=True)
        
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x): 
        h_0 = torch.zeros( 
            self.num_layers, x.size(0), self.hidden_size)
        
        c_0 = torch.zeros(
            self.num_layers, x.size(0), self.hidden_size)
        
        # Propagate input through LSTM
        ula, (h_out, _) = self.lstm(x, (h_0, c_0))
        
        h_out = h_out.view(-1, self.hidden_size)
        
        out = self.fc(h_out)
        
        return out
    
def sliding_windows(data, seq_length):
    x = []
    y = []

    for i in range(len(data)-seq_length-1):
        _x = data[i:(i+seq_length)]
        _y = data[i+seq_length]
        x.append(_x)
        y.append(_y)

    return np.array(x),np.array(y)

def mean_absolute_percentage_error(y_true, y_pred): 
    """Calculates MAPE given y_true and y_pred"""
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100     
        
class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)
    
def createArray(original:set, value):
    newWindow = np.append(original, value)
    newWindow = np.delete(newWindow, 0)
    sol = []
    for i in newWindow:
        sol.append([i])
    return np.array([sol])
    
torch.set_default_device("cpu")
sc = MinMaxScaler()
name = str(sys.argv[1]).upper()
fecha = str(sys.argv[2])
distancia = int(sys.argv[3])

excepciones = ["ANDÉVALO", "GUADALCACÍN","CHANZA","IZNÁJAR", "ARENOSO", "GIRIBAILE", "GUADALEN", "LA BREÑA", "RUMBLAR"]
color_pal = ["#F8766D", "#D39200", "#93AA00", "#00BA38", "#00C19F", "#00B9E3", "#619CFF", "#DB72FB"]          # Paleta de colores Rojo - Naranja - Verdes - Azules - Morado

torch.device("cpu")

dataset = pd.read_csv("./Data/Datasets/"+name+".csv", index_col=[0], parse_dates=True, dayfirst=True)
model = torch.load("./Data/Modelos/"+name+".pt", map_location=torch.device('cpu'))
seq_length = 21
    
if name in excepciones:
    seq_length = 14

training_data = sc.fit_transform(dataset)
x, y = sliding_windows(training_data, seq_length)

model.cpu()
model.eval()

index = dataset.index.get_loc(fecha)

newWindow = np.array([x[index-(seq_length-1)]])
predictionsDummy = []
for i in range(distancia):
    train_predict = model(torch.Tensor(newWindow))
    predictionsDummy.append(train_predict.data.cpu().numpy())
    newWindow = createArray(newWindow, train_predict.data.cpu().numpy())
    
predictions = []
for i in predictionsDummy:
    predictions.append(i[0][0])
predictions = sc.inverse_transform([predictions])[0]

predictionsRound = []
for i in predictions:
    predictionsRound.append(round(i,2))

fechas = []
originales = []
date = datetime.datetime.strptime(fecha, "%Y-%m-%d")
for i in range(distancia):
    fechas.append(str(date))
    originales.append(str(dataset.loc[str(date.date())]["Reserva"]))
    date += datetime.timedelta(1)

tempFolder = tempfile.gettempdir()+"/Pantanos"
checkFolder = os.path.isdir(tempFolder)

# If folder doesn't exist, then create it.
if not checkFolder:
    os.makedirs(tempFolder)

with open(tempFolder+"/prediction.json", "w") as tmpFile:
    json.dump({"prediction":np.array(predictionsRound), "dates": np.array(fechas), "originals": np.array(originales)}, tmpFile, cls=NumpyArrayEncoder)