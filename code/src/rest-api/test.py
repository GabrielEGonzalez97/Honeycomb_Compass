from server import app
import unittest

class FlaskTest(unittest.TestCase): 

    #---Check for response 200---#
    def test_bee_final_position(self):
        tester = app.test_client(self)
        response = tester.get("/final_position?xPosBee=1&yPosBee=2&rowsSize=5&columnsSize=5&cardinality=North&directionsInstructions=LMLMLMLMM")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200) 

    #---Check if content return is application/json---#
    def test_index_content(self):
        tester = app.test_client(self)
        response = tester.get("/final_position?xPosBee=1&yPosBee=2&rowsSize=5&columnsSize=5&cardinality=North&directionsInstructions=LMLMLMLMM")
        self.assertEqual(response.content_type, "application/json")

    #---Check for data returned---#
    def test_index_data(self):
        tester = app.test_client(self)
        response = tester.get("/final_position?xPosBee=1&yPosBee=2&rowsSize=5&columnsSize=5&cardinality=North&directionsInstructions=LMLMLMLMM")
        self.assertTrue(b'{"xPosBee": 1, "yPosBee": 3, "cardinality": "North"}' in response.data)

if __name__ == '__main__':
    unittest.main()