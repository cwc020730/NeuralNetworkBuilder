"""
The main file for the backend server.
"""

import os
import asyncio
import traceback
import torch
from flask import jsonify, request, send_file
from flask_socketio import emit
from .json_graph_handler import JSONGraphHandler
from .execution_handler import ExecutionHandler

from .app import app, send_header_status_data, send_error, socketio

MODEL_PATH = os.path.join('backend', 'model.pth')
MODEL_PATH_LOCAL = 'model.pth'

@socketio.on('send_state_dict')
def handle_state_dict(data):
    """
    Function to receive the state_dict from the frontend and save it as a file.
    """
    file_bytes = data['file']
    byte_array = bytearray(file_bytes)
    with open(MODEL_PATH, 'wb') as f:
        f.write(byte_array)
    print('Received and saved file as model.pth')
    emit('response', {'status': 'File received and saved'})

@app.route('/download_model', methods=['GET'])
def download_model():
    """
    The function to download the model file from the server.
    """
    if not os.path.exists(MODEL_PATH):
        return jsonify({'error': 'Model file not found'}), 404
    return send_file(MODEL_PATH_LOCAL, as_attachment=True)

@app.route('/receive_data', methods=['POST'])
def receive_data():
    """
    Function to receive data from the frontend and pass it to the JSONGraphHandler.
    """
    asyncio.run(send_header_status_data('Preparing ...'))
    data = request.get_json()
    # try loading state dict
    if os.path.exists(MODEL_PATH):
        state_dict = torch.load(MODEL_PATH)
    else:
        state_dict = None
    try:
        json_graph_handler = JSONGraphHandler(data)
    except AssertionError as e:
        asyncio.run(send_error("Invalid Graph", str(e)))
        asyncio.run(send_header_status_data('idle'))
        return jsonify({'error': str(e)}), 400
    except Exception as e: # pylint: disable=broad-except
        asyncio.run(send_error("Invalid Graph", f"An error occurred while parsing the graph: {e}"))
        asyncio.run(send_header_status_data('idle'))
        return jsonify({'error': f'An error occurred while parsing the graph: {e}'}), 400
    try:
        curr_unit_id = []
        execution_handler = ExecutionHandler(json_graph_handler.simplified_data, curr_unit_id, state_dict)
        torch.save(execution_handler.state_dict, MODEL_PATH)
    except Exception as e: # pylint: disable=broad-except
        print(e)
        asyncio.run(send_error("Execution Error", f"At Unit {json_graph_handler.simplified_data[curr_unit_id[0]]["type"]}({curr_unit_id[0]}):\n\n{str(e)}"))
        asyncio.run(send_header_status_data('idle'))
        print(traceback.format_exc())
        return jsonify({'error': 'Error while executing the graph.'}), 400
    asyncio.run(send_header_status_data('idle'))

    return jsonify({'status': 'Data received!'}), 200

def start_server():
    """
    Function to start the server.
    """
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
        print('Removed existing model.pth file')
    app.run(debug=True, port=5000)

if __name__ == '__main__':
    start_server()