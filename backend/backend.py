"""
The main file for the backend server.
"""

import os
from flask import jsonify, request
from .json_graph_handler import JSONGraphHandler
from .execution_handler import ExecutionHandler

from .app import app

@app.route('/receive_data', methods=['POST'])
def receive_data():
    """
    Function to receive data from the frontend and pass it to the JSONGraphHandler.
    """
    data = request.get_json()
    json_graph_handler = JSONGraphHandler(data)
    execution_handler = ExecutionHandler(json_graph_handler.simplified_data)

    return jsonify({'status': 'Data received!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)