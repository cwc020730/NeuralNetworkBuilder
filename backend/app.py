"""
The file contains the app initialization code for the Flask server and the SocketIO server.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins

def send_unit_data(unit_data):
    """
    Send unit data to the client via WebSocket.

    Args:
        unit_data (dict): The data to be sent to the client.

    Returns:
        dict: The unit data.
    """
    if len(str(unit_data)) < 300:
        print('Sending unit data to client...', unit_data)
    else:
        print('Sending unit data to client...')
    socketio.emit('data_updated', {'data': unit_data})
    return jsonify({'unit_data': unit_data})