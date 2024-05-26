from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/message')
def send_message():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.get_json()
    print(data)
    return jsonify({'status': 'Data received!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)