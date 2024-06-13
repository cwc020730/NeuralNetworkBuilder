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
        send_error("Invalid Graph", str(e))
        send_header_status_data('idle')
        return jsonify({'error': str(e)}), 400
    try:
        curr_unit_id = []
        execution_handler = ExecutionHandler(json_graph_handler.simplified_data, curr_unit_id)
    except Exception as e: # pylint: disable=broad-except
        send_error("Execution Error", f"At Unit {json_graph_handler.simplified_data[curr_unit_id[0]]["type"]}({curr_unit_id[0]}):\n\n{str(e)}")
        send_header_status_data('idle')
        return jsonify({'error': 'Error while executing the graph.'}), 400
    send_header_status_data('idle')

    return jsonify({'status': 'Data received!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)