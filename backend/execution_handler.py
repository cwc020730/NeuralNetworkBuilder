"""
The execution_handler.py file contains the ExecutionHandler class, 
which is responsible for executing the operations of the units on the canvas.
"""

import time
import asyncio
from torch.utils.data import DataLoader
from .unit_object_allocator import UnitObjectAllocator
from .app import send_unit_data, build_and_send_image, send_header_status_data
from . import EmptyData, AccuracyData, LossData, TensorData
from .unit_objects.model_start_unit import ModelStartUnit

class ExecutionHandler:
    """
    The ExecutionHandler class is responsible for executing the operations of 
    the units on the canvas.

    Args:
        simplified_data (dict): The simplified version of the JSON data after processing.

    Attributes:
        simplified_data (dict): The simplified version of the JSON data after processing.
    """
    def __init__(self, simplified_data: dict, curr_unit_id: list = None, state_dict = None):
        if curr_unit_id is None:
            curr_unit_id = []
        self.simplified_data = simplified_data
        self.curr_unit_id = curr_unit_id
        self.state_dict = state_dict
        self.execute_operations()

    def execute_operations(self):
        """
        This method executes the operations of the units on the canvas.
        """
        # look for the input unit
        for unit_id, unit_info in self.simplified_data.items():
            if unit_info['input_unit']:
                input_unit_id = unit_id
                break

        # Input cache to store inputs for each unit
        input_cache = {unit_id: {} for unit_id in self.simplified_data}

        def exec_traverse(unit_id, input_data):
            if self.curr_unit_id != []:
                self.curr_unit_id.pop()
            self.curr_unit_id.append(unit_id)
            unit_info = self.simplified_data[unit_id]
            # Check if the unit is a train start unit
            if unit_info['type'] == 'model start':
                if unit_info['parameters']['mode']['value'] == 'train':
                    assert isinstance(input_data['Data'], DataLoader), \
                        'DataLoader input expected for ModelStartUnit in train mode'
                    dataloader = input_data['Data']
                    curr_loss_func_unit_id = input_data['Loss function id']
                    assert curr_loss_func_unit_id is not None, \
                        'Loss function unit not found'
                    unit_object = ModelStartUnit(
                        unit_id,
                        unit_info,
                        self.simplified_data,
                        curr_unit_id=self.curr_unit_id
                    )
                    # try load state dict
                    if self.state_dict is not None:
                        unit_object.load_state_dict(self.state_dict)
                    num_epochs, device = unit_object.get_training_config()
                    # set training device
                    unit_object.to(device)
                    # find optimizer
                    optimizer_unit_id = None
                    for connection in unit_object.output_connections:
                        if connection['name'] == "Optimizer connector":
                            optimizer_unit_id = connection['connects_to']
                            break
                    assert optimizer_unit_id is not None, 'Optimizer unit not found'
                    # handles training
                    optimizer_unit_info = self.simplified_data[optimizer_unit_id]
                    optimizer_unit_object = UnitObjectAllocator.create_unit_object(
                        optimizer_unit_id,
                        optimizer_unit_info
                    )
                    loss_function_unit_info = self.simplified_data[curr_loss_func_unit_id]
                    loss_function_unit_object = UnitObjectAllocator.create_unit_object(
                        curr_loss_func_unit_id,
                        loss_function_unit_info
                    )
                    optimizer = optimizer_unit_object.get_optimizer(unit_object)
                    criterion = loss_function_unit_object.get_loss_func()
                    acc_data = AccuracyData([])
                    loss_data = LossData([])
                    asyncio.run(send_header_status_data(f"Training: Epoch 1/{num_epochs}, 0% complete"))
                    for epoch in range(num_epochs):
                        running_loss = 0.0
                        avg_time = 0.0
                        total_accuracy = 0.0
                        perc_progress = 0.0
                        prev_perc_progress = 0.0
                        for i, (inputs, labels) in enumerate(dataloader, 0):
                            start_time = time.time()
                            inputs, labels = inputs.to(device), labels.to(device)
                            optimizer.zero_grad()
                            output = unit_object(inputs)
                            loss = criterion(output["Model output"].get_data(), labels)
                            loss.backward()
                            total_accuracy += loss_function_unit_object.get_accuracy(
                                output["Model output"].get_data(),
                                labels
                            )
                            optimizer.step()

                            running_loss += loss.item()
                            end_time = time.time()
                            avg_time += end_time - start_time
                            if i % 100 == 99:
                                # unit_object.toggle_send_data()
                                print(f'Epoch {epoch + 1}, batch {i + 1}, loss: {loss.item()}')
                                print(f'Avg time: {avg_time / 100}')
                                avg_time = 0.0
                            prev_perc_progress = perc_progress
                            perc_progress = ((i + 1) / len(dataloader)) * 100
                            if int(perc_progress) > int(prev_perc_progress):
                                asyncio.run(send_header_status_data(
                                    f"Training: Epoch {epoch + 1}/{num_epochs}, " + \
                                    f"{int(perc_progress)}% complete"
                                ))
                                perc_progress = int(perc_progress)
                        # send data to the loss unit on the canvas
                        unit_object.toggle_send_data()
                        loss_data.add_loss(running_loss / len(dataloader))
                        acc_data.add_accuracy(total_accuracy / len(dataloader))
                        asyncio.run(send_unit_data({
                            curr_loss_func_unit_id: {
                                'Loss': loss_data.to_json_dict(),
                                'Accuracy': acc_data.to_json_dict()
                            }
                        }))
                        # send image to the loss unit on the canvas
                        asyncio.run(build_and_send_image(curr_loss_func_unit_id, 'Loss', loss_data))
                        asyncio.run(build_and_send_image(curr_loss_func_unit_id, 'Accuracy', acc_data))
                        print(f'Epoch {epoch + 1}, total accuracy: {total_accuracy / len(dataloader)}')
                    output_connections = unit_object.end_unit_connections
                    self.state_dict = unit_object.state_dict()
                elif unit_info['parameters']['mode']['value'] == 'eval':
                    assert isinstance(input_data['Data'], TensorData), \
                        'TensorData input expected for ModelStartUnit in eval mode'
                    unit_object = ModelStartUnit(
                        unit_id,
                        unit_info,
                        self.simplified_data,
                        curr_unit_id=self.curr_unit_id
                    )
                    # try load state dict
                    if self.state_dict is not None:
                        unit_object.load_state_dict(self.state_dict)
                    _, device = unit_object.get_training_config()
                    # set evaluation device
                    unit_object.to(device)
                    # evaluate the model
                    inputs = input_data['Data'].get_data()
                    inputs = inputs.to(device)
                    output = unit_object(inputs)

                    output_connections = unit_object.end_unit_connections
                    self.state_dict = unit_object.state_dict()
            else:
                unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
                output = unit_object.execute(input_data)
                # add the image to the data panel
                for output_name, output_data in output.items():
                    asyncio.run(build_and_send_image(unit_id, output_name, output_data))
                output_connections = unit_info['outputs']
                # handles the special dataloader case
                if unit_info['type'] == 'to dataloader':
                    unit_data = {
                        unit_id: {
                            'Dataloader X': input_data['Features'].to_json_dict(),
                            'Dataloader Y': input_data['Labels'].to_json_dict()
                        }
                    }
                    asyncio.run(send_unit_data(unit_data))
                    input_for_next_unit = output['dataloader']
                    for connection in output_connections:
                        if connection['name'] == 'Dataloader X':
                            next_unit_id = connection['connects_to']
                            next_unit_input_name_to_connect = connection['end_name']
                            input_cache[next_unit_id][next_unit_input_name_to_connect] = input_for_next_unit
                        if connection['name'] == 'Dataloader Y':
                            loss_func_unit_id = connection['connects_to']
                    input_cache[next_unit_id]['Loss function id'] = loss_func_unit_id
                    exec_traverse(next_unit_id, input_cache[next_unit_id])
                    return
                else:
                    output_to_send = {}
                    for output_name, output_data in output.items():
                        output_data_json = output_data.to_json_dict()
                        output_to_send[output_name] = output_data_json # TODO: need to rename output_to_send to something like data_to_send
                        asyncio.run(build_and_send_image(unit_id, output_name, output_data))
                    unit_data = {
                        unit_id: output_to_send
                    }
                    asyncio.run(send_unit_data(unit_data))
            # print(f'Executing unit: {unit_object}')

            for connection in output_connections:
                input_for_next_unit = output[connection['name']]
                next_unit_id = connection['connects_to']
                # handles the case when the model end unit is the last unit
                if not next_unit_id:
                    continue
                next_unit_input_name_to_connect = connection['end_name']
                input_cache[next_unit_id][next_unit_input_name_to_connect] = input_for_next_unit
                # Check if all inputs for the next unit are ready
                if len(input_cache[next_unit_id]) == len(self.simplified_data[next_unit_id]['inputs']):
                    exec_traverse(next_unit_id, input_cache[next_unit_id])

        exec_traverse(input_unit_id, {'null': EmptyData()})

    def summary(self):
        """
        This method prints a summary of the execution process.
        """
        print('Execution completed successfully!')
