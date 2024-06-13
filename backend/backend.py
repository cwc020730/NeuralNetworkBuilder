"""
The main file for the backend server.
"""

import os
from flask import jsonify, request
from .json_graph_handler import JSONGraphHandler
from .execution_handler import ExecutionHandler

from .app import app, send_header_status_data, send_error

@app.route('/receive_data', methods=['POST'])
def receive_data():
    """
    Function to receive data from the frontend and pass it to the JSONGraphHandler.
    """
    send_header_status_data('Preparing ...')
    data = request.get_json()
    try:
        json_graph_handler = JSONGraphHandler(data)
    except AssertionError as e:
        send_error(str(e))
        send_header_status_data('idle')
        return jsonify({'error': str(e)}), 400
    execution_handler = ExecutionHandler(json_graph_handler.simplified_data)
    send_header_status_data('idle')

    return jsonify({'status': 'Data received!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)