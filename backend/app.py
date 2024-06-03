"""
The file contains the app initialization code for the Flask server and the SocketIO server.
"""

import os, base64
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
    # if len(str(unit_data)) < 300:
    #     print('Sending unit data to client...', unit_data)
    # else:
    #     print('Sending unit data to client...')
    socketio.emit('data_updated', {'data': unit_data})
    return jsonify({'unit_data': unit_data})

@app.route('/send_image', methods=['POST'])
def send_image(unit_id, data_name, buf):
    """
    Send an image to the client via WebSocket.

    Args:
        unit_id (str): The ID of the unit.
        data_name (str): The name of the data.
        buf (io.BytesIO): The image buffer.

    Returns:
        dict: The image data.
    """
    try:
        image_data = base64.b64encode(buf.read()).decode('utf-8')
        # notifiy the client that the image has been updated
        socketio.emit('image_updated', {'unit_id': unit_id, 'data_name': data_name, 'image_data': image_data})
        buf.close()
        return jsonify({'status': 'success', 'message': 'Image send successfully'})
    except Exception as e:
        buf.close()
        print(f'Error sending image: {e}')
        return jsonify({'status': 'error', 'message': str(e)}), 500
