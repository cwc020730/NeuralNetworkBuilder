# NeuralNetworkBuilder

Create flowcharts of neural networks and convert the flowcharts into PyTorch for inferencing/training.

## How to run the project

Clone this repository
```
git clone https://github.com/cwc020730/NeuralNetworkBuilder.git
```

Install NodeJS from `https://nodejs.org/en`.

Make sure the directory `npm` executable is in the system environment variable `PATH`

Install relevant packages:
```
npm install
```

Start the frontend:
```
npm start
```

`npm start` should start the app locally: `http://localhost:3000`.

Start the backend:
```
pip install -r backend/requirements.txt
python -m backend.backend
```
The backend server should start locally: `http://localhost:5000`.

## Project Prototyping Components

### Front-End (React)
- Flowchart Canvas with zoom in/out utility (Finished)
- Menu for neural network layer blocks (In Progress)
- Draggable neural network layer blocks (To be dropped into the canvas) (Finished)
- Arrows attach to the neural network layers blocks (Finished)
- Data exchange with backend (TODO)

### Back-End (Python)
- Graph To PyTorch code converter (TODO)
- PyTorch inferencing/training utility (TODO)
- Data exchange with frontend (In Progress)
