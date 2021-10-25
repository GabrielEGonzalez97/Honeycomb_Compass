from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
from json import dumps
from flask_jsonpify import jsonify

app = Flask(__name__)
api = Api(app)

# Define parser and request args
parser = reqparse.RequestParser()
parser.add_argument('xPos', type=int)
parser.add_argument('yPos', type=int)
parser.add_argument('rows', type=int)
parser.add_argument('columns', type=int)
parser.add_argument('cardinality', type=str)
parser.add_argument('whereIsHeading', type=str)

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

    def isValidPosition(self, newX, newY, rows, columns):
        if newY >= 0 & newY <= rows & newX >= 0 & newX <= columns:
            return "true"
        else: 
            return "false"


    def get(self):
        args = parser.parse_args()
        xPos = args['xPos']  
        yPos = args['yPos'] 
        rows = args['rows'] 
        columns = args['columns'] 
        cardinality = args['cardinality'] 
        whereIsHeading = args['whereIsHeading'] 
        print('xPos_initial: ' + str(xPos))
        print('yPos_initial: ' + str(yPos))
        for command in whereIsHeading:
            print('command: ' + str(command))
            if command == 'L':
                cardinality = self.getLeftActualCardinality(cardinality)
                print('L: ' + str(cardinality))
            elif command == 'R':
                cardinality = self.getRightActualCardinality(cardinality)
                print('R: ' + str(cardinality))
            elif command == 'M':
                print('cardinality: ' + str(cardinality))
                if cardinality == self.NORTH: 
                    yPos = yPos + 1
                elif cardinality == self.EAST: 
                    xPos = xPos + 1
                elif cardinality == self.SOUTH: 
                    yPos = yPos - 1
                else: 
                    xPos = xPos - 1
                print('xPos: ' + str(xPos))
                print('yPos: ' + str(yPos))

            if self.isValidPosition(xPos, yPos, rows, columns) == "false": 
                break
        print('xPos_final: ' + str(xPos))
        print('yPos_final: ' + str(yPos))
        return {'xPos': xPos, 'yPos': yPos, 'cardinality': cardinality} 


api.add_resource(Honeycomb, '/final_position') # Route_1


if __name__ == '__main__':
     app.run(port=5002)