from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask_jsonpify import jsonify

app = Flask(__name__)
api = Api(app)

#Define parser and request args
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
    #-------Cardinalities to use-------#
    NORTH = "North"
    EAST = "East"
    SOUTH = "South"
    WEST = "West"

    #-------The cardinality located to the left of the current cardinality is obtained-------#
    #     N
    # W       E
    #     S
    def getLeftActualCardinality(self, cardinality):
        if cardinality == self.NORTH: 
            return self.WEST
        elif cardinality == self.WEST: 
            return self.SOUTH
        elif cardinality == self.SOUTH: 
            return self.EAST
        else: 
            return self.NORTH

    #-------The cardinality located to the right of the current cardinality is obtained-------#
    #     N
    # W       E
    #     S
    def getRightActualCardinality(self, cardinality):
        if cardinality == self.NORTH: 
            return self.EAST
        elif cardinality == self.EAST: 
            return self.SOUTH
        elif cardinality == self.SOUTH: 
            return self.WEST
        else: 
            return self.NORTH

    #-------It is verified that the required position is within the established dimensions of the honeycomb-------#
    def isValidPosition(self, newX, newY, rowsSize, columnsSize):
        if newY >= 0 & newY <= rowsSize & newX >= 0 & newX <= columnsSize:
            return "true"
        else: 
            return "false"

    #-------Returns the position to which the bee was moved according to the movement instructions-------#
    def get(self):
        #---Assigning parameters---#
        args = parser.parse_args()
        xPosBee = args['xPosBee']  
        yPosBee = args['yPosBee'] 
        rowsSize = args['rowsSize'] 
        columnsSize = args['columnsSize'] 
        cardinality = args['cardinality'] 
        directionsInstructions = args['directionsInstructions'] 

        #---Each of the movement instructions entered by the user is traversed---#
        for instruction in directionsInstructions:

            #---If the instruction is an L then the left cardinality is obtained to the current cardinality---#
            if instruction == 'L':
                cardinality = self.getLeftActualCardinality(cardinality)
            #---If the instruction is an R then the right cardinality is obtained to the current cardinality---#
            elif instruction == 'R':
                cardinality = self.getRightActualCardinality(cardinality)
            #---If the instruction is an M then it advances one place according to the current cardinality---#
            elif instruction == 'M':
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
        
        #---The new position of the bee in the honeycomb and the cardinality it is looking at is returned---#
        return {'xPosBee': xPosBee, 'yPosBee': yPosBee, 'cardinality': cardinality}


api.add_resource(Honeycomb, '/final_position') #Route


if __name__ == '__main__':
     app.run()