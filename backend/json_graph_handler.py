"""
The JSONGraphHandler class is responsible for handling the JSON data received from the frontend. 
It performs data validation checks and simplifies the data for further processing. 
The simplified data is then used to generate a summary of the units, connections, 
and parameters in the graph.
"""
import json

class JSONGraphHandler:
    """
    The JSONGraphHandler class is responsible for handling the JSON data received from the frontend.

    Args:
        raw_data (dict): The raw JSON data received from the frontend.
    
    Attributes:
        unit_list (dict): A dictionary containing information about different unit types.
        raw_data (dict): The raw JSON data received from the frontend.
        simplified_data (dict): The simplified version of the JSON data after processing.
    """
    def __init__(
        self,
        raw_data: dict
    ):
        with open('./src/components/UnitList.json', 'r', encoding='utf-8') as f:
            unit_list = json.load(f)
        self.unit_list = unit_list
        self.raw_data = raw_data
        self.data_validity_check()
        self.simplified_data = self.simplify_data()
        self.summary()

    def data_validity_check(self):
        """
        This method performs data validation checks on the raw JSON data received 
        from the frontend.
        """
        contains_input = False

        assert isinstance(self.raw_data, dict)
        assert 'units' in self.raw_data
        assert 'arrows' in self.raw_data
        units = self.raw_data['units']
        connections = self.raw_data['arrows']
        assert isinstance(units, dict)
        assert isinstance(connections, dict)
        for unit_id, unit_info in units.items():
            assert isinstance(unit_id, str)
            assert isinstance(unit_info, dict)
            assert 'unitInfo' in unit_info
            unit_info_details = unit_info['unitInfo']
            assert isinstance(unit_info_details, dict)
            assert 'type' in unit_info_details
            assert isinstance(unit_info_details['type'], str)
            assert unit_info_details['type'] in self.unit_list
            if self.unit_list[unit_info_details['type']]['category'] == 'INPUT':
                assert contains_input == False
                contains_input = True
            assert 'connectionPoints' in unit_info_details
            assert isinstance(unit_info_details['connectionPoints'], list)
            for connection_point in unit_info_details['connectionPoints']:
                assert isinstance(connection_point, dict)
                assert 'is_input' in connection_point
                assert isinstance(connection_point['is_input'], bool)
                assert 'is_output' in connection_point
                assert isinstance(connection_point['is_output'], bool)
                assert 'label' in connection_point
                assert isinstance(connection_point['label'], str)
                assert 'occupied' in connection_point
                assert isinstance(connection_point['occupied'], bool)
                assert 'id' in connection_point
                assert isinstance(connection_point['id'], str)
            assert 'attachingArrowStarts' in unit_info_details
            assert 'attachingArrowEnds' in unit_info_details
            for arrow_id in unit_info_details['attachingArrowStarts'] + unit_info_details['attachingArrowEnds']:
                assert isinstance(arrow_id, str)
            assert 'parameters' in unit_info_details
            assert isinstance(unit_info_details['parameters'], dict)
        for arrow_id, arrow_info in connections.items():
            assert isinstance(arrow_id, str)
            assert 'startUnitId' in arrow_info
            assert isinstance(arrow_info['startUnitId'], (str, type(None)))
            assert 'endUnitId' in arrow_info
            assert isinstance(arrow_info['endUnitId'], (str, type(None)))
            assert 'startAnchorPointId' in arrow_info
            assert isinstance(arrow_info['startAnchorPointId'], (str, type(None)))
            assert 'endAnchorPointId' in arrow_info
            assert isinstance(arrow_info['endAnchorPointId'], (str, type(None)))

    def simplify_data(self):
        """
        This method simplifies the raw JSON data into a more structured format.
        """
        simplified_data = {}
        id_to_connection_point = {}
        # fill id to connection point
        for unit_id, unit_info in self.raw_data['units'].items():
            for connection_point in unit_info['unitInfo']['connectionPoints']:
                id_to_connection_point[connection_point['id']] = connection_point
        for unit_id, unit_info in self.raw_data['units'].items():
            simplified_data[unit_id] = {
                'type': unit_info['unitInfo']['type'],
                'input_unit': self.unit_list[unit_info['unitInfo']['type']]['category'] == 'INPUT',
                'inputs': [],
                'outputs': [],
                'parameters': unit_info['unitInfo']['parameters']
            }
            for connection_point in unit_info['unitInfo']['connectionPoints']:
                if connection_point['is_input']:
                    this_connection = {}
                    # find units that attach to this input using attachingArrowEnds
                    for arrow_id in unit_info['unitInfo']['attachingArrowEnds']:
                        if self.raw_data['arrows'][arrow_id]['endAnchorPointId'] == connection_point['id']:
                            this_connection['name'] = connection_point['label']
                            this_connection['connects_to'] = self.raw_data['arrows'][arrow_id]['startUnitId']
                            this_connection['end_name'] = id_to_connection_point[self.raw_data['arrows'][arrow_id]['startAnchorPointId']]['label']
                            break
                    if this_connection:
                        simplified_data[unit_id]['inputs'].append(this_connection)
                elif connection_point['is_output']:
                    this_connection = {}
                    # find units that attach to this output using attachingArrowStarts
                    for arrow_id in unit_info['unitInfo']['attachingArrowStarts']:
                        if self.raw_data['arrows'][arrow_id]['startAnchorPointId'] == connection_point['id']:
                            this_connection['name'] = connection_point['label']
                            this_connection['connects_to'] = self.raw_data['arrows'][arrow_id]['endUnitId']
                            this_connection['end_name'] = id_to_connection_point[self.raw_data['arrows'][arrow_id]['endAnchorPointId']]['label']
                            break
                    if this_connection:
                        simplified_data[unit_id]['outputs'].append(this_connection)

        return simplified_data
    
    def summary(self):
        """
        This method generates a summary of the units, connections, and parameters in the graph.
        """
        print('Units:')
        for unit_id, unit_info in self.simplified_data.items():
            print(f'Unit ID: {unit_id}')
            print(f'Unit Type: {unit_info["type"]}')
            if unit_info['input_unit']:
                print('This unit is an input unit')
            print('Inputs:')
            for connection in unit_info['inputs']:
                print(f'  {connection["name"]} connects to {connection["connects_to"]}')
            print('Outputs:')
            for connection in unit_info['outputs']:
                print(f'  {connection["name"]} connects to {connection["connects_to"]}')
            print('Parameters:')
            for param_name, param_value in unit_info['parameters'].items():
                print(f'  {param_name}: {param_value}')
            print()
