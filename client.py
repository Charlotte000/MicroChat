from websocket import create_connection
from threading import Thread
import colorama

def send_data(ws):
    while True:
        ws.send(input())

def receive_data(ws):
    while True:
        print(ws.recv())

colorama.init()
uri = "ws://chat-micro.herokuapp.com:8080"
ws = create_connection(uri)
Thread(target=send_data, args=(ws, )).start()
Thread(target=receive_data, args=(ws, )).start()
