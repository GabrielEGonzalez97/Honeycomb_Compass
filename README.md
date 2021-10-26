# :honeybee: Honeycomb Compass
### :page_with_curl: Problem introduction

A bee researcher discovered how to improve honey production by guiding bees in a honeycomb to certain cells, in such a way that arranging a group of bees in a very specific layout, their production as a team is greatly improved.

The honeycomb is an N by N rectangular shape. The location of a bee in the honeycomb is identified by x and y coordinates of the cell, and the orientation (that is, the cardinal point where the bee is pointing at: North, South, East and West). Bees move from one cell to the other one in single step movements and can rotate left/right within a cell.

The initial position for such a design is 0,0,N, which identifies a bee located in the bottom left corner and facing North. The cell directly to the North from x,y is x,y+1.
In order to guide a bee to its final location, the researcher designed a bio-interface to trigger the following actions:

:small_blue_diamond: Spin 90 degrees left or right, without moving from its current spot: in this case, the bio-interface accepts commands L and R, for left and right rotation respectively

:small_blue_diamond: Move forward one cell in the honeycomb, maintain the same heading: in this case, the bio-interface accepts command M

**:pencil2: INPUT:**

:small_blue_diamond: One line for the honeycomb's upper-right coordinates (lower-left coordinates are assumed to be 0,0), which is used to initialize the honeycomb.

:small_blue_diamond: Two lines per bee:

   :small_blue_diamond: 1st line indicates the initial position and heading where the bee is initially placed

   :small_blue_diamond: 2nd line indicates a stream of instructions to guide the bee

**:pencil: OUTPUT:**

The output for each stream processed is the final position and heading where the bee ended up.
 
**EXAMPLE:**
 
**:pencil2: Test Input:**
 
5 5

1 2 N

LMLMLMLMM

3 3 E

MMRMMRMRRM
 
**:pencil: Expected Output:**
 
1 3 N

5 1 E

### Rest API
Since the bio-interface device is meant to be used by different researchers to conduct experiments, you are asked to design and implement a robust REST API using Flask that allows to operate remotely, re-using the system defined above.
 
### Web UI
Create a Web UI using Angular (latest versions) to visualize:

:small_blue_diamond: Honeycomb grid: the user enters the shape of the honeycomb so it can be initialized and rendered

:small_blue_diamond: Bee tour: the user specifies where the bee starts, where is heading to, and visualizes it in the honeycomb

:small_blue_diamond: Final position: the user enters instructions for a specific bee, and visualizes the final position

# Main Application Description
This repository contains the necessary code to be able to solve the Honeycomb Compass problem. 

Angular was used for the frontend part. In it a component called honeycomb-component was defined. In this component, the honeycomb and the controls that the user can access to change the dimension of the honeycomb, place the bee inside the honeycomb, and obtain the final position of the bee inside the honeycomb according to a series of instructions were established.

To obtain the final position of the bee inside the honeycomb, a REST API was created in Flask, which receives the current position of the bee inside the honeycomb, where it is looking, and the established movement instructions, and from these calculates and returns the new position of the bee inside the honeycomb. 

# Versions used
         Name                Version
 - Angular CLI               12.1.4
 - Node                      14.15.4
 - Package Manager         npm 6.14.10
 - OS                       win32 x64
 - Angular                   12.1.5
 
              Package                               Version
 - @angular-devkit/architect                        0.1201.4
 - @angular-devkit/build-angular                    12.1.4
 - @angular-devkit/core                             12.1.4
 - @angular-devkit/schematics                       12.1.4
 - @angular/cli                                     12.1.4
 - @schematics/angular                              12.1.4
 - rxjs                                             6.6.7
 - typescript                                       4.3.5
 - Flask                                            1.1.2
 - Flask-Cors                                       3.0.10
 - Flask-Jsonpify                                   1.5.0
 - Flask-RESTful                                    0.3.9
 - Flask-SQLAlchemy                                 2.4.0
 - Flask-WTF                                        0.14.2

# :link: Instructions to run the project
The application is hosted on https://honeycomb-compass.web.app/ 

The REST API is hosted on https://honeycomb-compass.herokuapp.com/

API query example: https://honeycomb-compass.herokuapp.com/final_position?xPosBee=1&yPosBee=2&rowsSize=5&columnsSize=5&cardinality=North&directionsInstructions=LMLMLMLMM 

To run the project locally, standing on the path of the code folder in cmd, first you have to run the npm install command to install the modules and then the ng serve --o command to open the application locally.

If you want to run the API locally, it must be placed inside the server.py script, which is inside /src/rest-api, the port=5002 parameter inside the app.run() call. Also in the honeycomb.component.ts file, which is in the path /src/app/components/honeycomb, the value of the REST_API_URL variable must be changed to 'http://127.0.0.1:5002/'