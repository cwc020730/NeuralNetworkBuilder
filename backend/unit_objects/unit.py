
class Unit:
    def __init__(self, unit_id, unit_info):
        self.id = unit_id
        self.type = unit_info['type']
        self.input_unit = unit_info['input_unit']
        self.inputs = unit_info['inputs']
        self.outputs = unit_info['outputs']
        self.parameters = unit_info['parameters']

    def __repr__(self):
        return f'Unit ID: {self.id}'