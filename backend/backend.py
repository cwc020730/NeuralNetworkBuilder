"""
The main file for the backend server.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from json_graph_handler import JSONGraphHandler

app = Flask(__name__)
CORS(app)

@app.route('/api/message')
def send_message():
    """
    Placeholder for the API endpoint that sends a message.
    """
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/receive_data', methods=['POST'])
def receive_data():
    """
    Function to receive data from the frontend and pass it to the JSONGraphHandler.
    """
    data = request.get_json()
    JSONGraphHandler(data)
    return jsonify({'status': 'Data received!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)