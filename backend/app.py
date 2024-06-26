"""
The file contains the app initialization code for the Flask server and the SocketIO server.
"""

import base64
import gc
import io
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from .data_image_builder import DataImageBuilder

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)
# Allow all origins
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

async def send_unit_data(unit_data):
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

async def send_error(error_header, error_message):
    """
    Send an error message to the client via WebSocket.

    Args:
        error_message (str): The error message to be sent to the client.

    Returns:
        dict: The error message.
    """
    socketio.emit('backend_error', {'header': error_header, 'message': error_message})
    return jsonify({'backend_error': error_message})

async def send_header_status_data(status):
    """
    Send header status data to the client via WebSocket.

    Args:
        status (dict): The status data to be sent to the client.

    Returns:
        dict: The status data.
    """
    socketio.emit('header_status_updated', {'status': status})
    return jsonify({'status': status})

async def build_and_send_image(unit_id, data_name, data_obj):
    """
    Build and send an image to the client via WebSocket.

    Args:
        unit_id (str): The ID of the unit.
        data_name (str): The name of the data.
        data_obj (object): The image object.

    Returns:
        dict: The image data.
    """
    buf = DataImageBuilder(data_obj).build_image()
    if buf is not None:
        await send_image(unit_id, data_name, buf)

@app.route('/send_image', methods=['POST'])
async def send_image(unit_id, data_name, buf):
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
        if isinstance(buf, io.BytesIO):
            image_data = base64.b64encode(buf.read()).decode('utf-8')
            # notifiy the client that the image has been updated
            socketio.emit('image_updated', {
                'unit_id': unit_id,
                'data_name': data_name,
                'image_data': [image_data]}
            )
            buf.close()
            gc.collect()
            return jsonify({'status': 'success', 'message': 'Image send successfully'})
    except Exception as e: # pylint: disable=broad-except
        buf.close()
        print(f'Error sending image: {e}')
        return jsonify({'status': 'error', 'message': str(e)}), 500
