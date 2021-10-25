from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask_jsonpify import jsonify

app = Flask(__name__)
api = Api(app)

# Define parser and request args
parser = reqparse.RequestParser()
parser.add_argument('xPosBee', type = int)
parser.add_argument('yPosBee', type = int)
parser.add_argument('rowsSize', type = int)
parser.add_argument('columnsSize', type = int)
parser.add_argument('cardinality', type = str)
parser.add_argument('directionsInstructions', type = str)

CORS(app)

@app.route("/")
def hello():
    return jsonify({'text':'Hello, welcome to the Honeycomb Compass!'})

class Honeycomb(Resource):
    NORTH = "North"
    EAST = "East"
    SOUTH = "South"
    WEST = "West"

    def getLeftActualCardinality(self, cardinality):
        if cardinality == self.NORTH: 
            return self.WEST
        elif cardinality == self.WEST: 
            return self.SOUTH
        elif cardinality == self.SOUTH: 
            return self.EAST
        else: 
            return self.NORTH

    def getRightActualCardinality(self, cardinality):
        if cardinality == self.NORTH: 
            return self.EAST
        elif cardinality == self.EAST: 
            return self.SOUTH
        elif cardinality == self.SOUTH: 
            return self.WEST
        else: 
            return self.NORTH

    def isValidPosition(self, newX, newY, rowsSize, columnsSize):
        if newY >= 0 & newY <= rowsSize & newX >= 0 & newX <= columnsSize:
            return "true"
        else: 
            return "false"

    def get(self):
        args = parser.parse_args()
        xPosBee = args['xPosBee']  
        yPosBee = args['yPosBee'] 
        rowsSize = args['rowsSize'] 
        columnsSize = args['columnsSize'] 
        cardinality = args['cardinality'] 
        directionsInstructions = args['directionsInstructions'] 

        for command in directionsInstructions:

            if command == 'L':
                cardinality = self.getLeftActualCardinality(cardinality)
            elif command == 'R':
                cardinality = self.getRightActualCardinality(cardinality)
            elif command == 'M':
                if cardinality == self.NORTH: 
                    yPosBee = yPosBee + 1
                elif cardinality == self.EAST: 
                    xPosBee = xPosBee + 1
                elif cardinality == self.SOUTH: 
                    yPosBee = yPosBee - 1
                else: 
                    xPosBee = xPosBee - 1

            if self.isValidPosition(xPosBee, yPosBee, rowsSize, columnsSize) == "false": 
                break
        
        return {'xPosBee': xPosBee, 'yPosBee': yPosBee, 'cardinality': cardinality}


api.add_resource(Honeycomb, '/final_position') # Route_1


if __name__ == '__main__':
     app.run(port = 5002)