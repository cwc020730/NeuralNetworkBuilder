# Graph2Torch

Create flowcharts of neural networks and convert the flowcharts into PyTorch for inferencing/training.

## How to run the project

Install NodeJS from `https://nodejs.org/en`.

Make sure the directory `npm` executable is in the system environment variable `PATH`

```
git clone https://github.com/cwc020730/Graph2Torch.git
cd Graph2Torch
npm start
```
If it throws an error related to packages not being installed:
```
npm install <package name>
```
For example:
```
'react-scripts' is not recognized as an internal or external command
```
Use:
```
npm install react-scripts
```
Try `npm start` until all the packages are installed correctly.

`npm start` should start the app locally: `http://localhost:3000`.

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
- Data exchange with frontend (TODO)
