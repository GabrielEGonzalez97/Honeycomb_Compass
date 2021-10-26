import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-honeycomb',
  templateUrl: './honeycomb.component.html',
  styleUrls: ['./honeycomb.component.css']
})

export class HoneycombComponent
{
  //----------------------------Initializing variables----------------------------
  //--------------Initializing variables to be used as read-only variables--------------
  readonly REST_API_URL = 'https://honeycomb-compass.herokuapp.com/'; //API link used to obtain the final position of the bee in the honeycomb
  readonly MIN_DIMENSION = 0; //Honeycomb cannot have negative rows or columns
  readonly MAX_DIMENSION = 100; //A maximum limit of rows and columns that the panel can have is given
  //-------Cardinalities to use-------
  readonly NORTH = "North";
  readonly SOUTH = "South";
  readonly WEST = "West";
  readonly EAST = "East";
  //-------Link to the urls that contain the images with the rotated positions of the bee-------
  readonly URL_IMG_BEE_NORTH = 'https://i.postimg.cc/s2YhJnWD/bee-north.png';
  readonly URL_IMG_BEE_SOUTH = 'https://i.postimg.cc/43kcVCmS/bee-south.png';
  readonly URL_IMG_BEE_EAST = 'https://i.postimg.cc/wTrLxRHH/bee-east.png';
  readonly URL_IMG_BEE_WEST = 'https://i.postimg.cc/RZnfWCVt/bee-west.png';

  //--------------Honeycomb dimensions--------------
  colArray : number[] = []; //Array containing the value of the honeycomb columns
  rowArray: number[] = []; //Array containing the value of the honeycomb rows
  rowsSize = 5; //Number of rows the user wants the honeycomb to contain
  columnsSize = 5; //Number of columns the user wants the honeycomb to contain

  //--------------Bee variables--------------
  actualXBeePosition = 0; //Current position of the bee in the column
  actualYBeePosition = 0; //Current position of the bee in the row
  oldXBeePosition = 0; //Previous position of the bee in the column
  oldYBeePosition = 0; //Previous position of the bee in the row
  cardinality: Record<string, string> = { //Record containing where the bee is looking and the url of the corresponding image where it is looking
    cardinality: this.NORTH,
    urlImg: this.URL_IMG_BEE_NORTH,
  }; 

  //--------------String where the instructions entered by the user are stored--------------
  directionsInstructions = "";

  //--------------Booleans that let you know if certain sections of the controls area should be shown--------------
  viewStartPositionSection = false;
  viewChangePositionSection = false;
  viewLabelChangePosition = false;
  viewFinalPositionSection = false;
  viewErrorSection = false;

  //--------------JSON that contains the server's response to the API query--------------
  serverData = JSON;

  //----------------------------Constructor of the class----------------------------
  constructor(private httpClient: HttpClient) 
  { 

  }

  //----------------------------Methods----------------------------
  //--------------Set the honeycomb shape--------------
  setShapeHoneycomb()
  {
    this.refreshControls();
    this.colArray = [];
    this.rowArray = [];
    for(let i = 0; i < this.columnsSize + 1; i++)
    {
      this.colArray.push(i);
    }
    for(let i = 0; i < this.rowsSize + 1; i++)
    {
      this.rowArray.push(i);
    }
    this.viewStartPositionSection = true;
  }

  //--------------The controls seen in the front are updated when resizing the honeycomb to avoid inconsistencies--------------
  private refreshControls()
  {
    //-------The sections of the controls that depend on the dimensions of the honeycomb and the bee being in it are hidden-------
    this.viewChangePositionSection = false;
    this.viewLabelChangePosition = false;
    this.viewFinalPositionSection = false;
    this.viewErrorSection = false;

    //-------If the honeycomb exists and the previous position where the bee was is within the current dimensions of the honeycomb, then the image representing the bee in that position is deleted-------
    var honeycomb = this.getHoneycomb();
    if(this.checkHoneycombExist(honeycomb)) 
    {
      if(this.isValidPosition(this.oldXBeePosition, this.oldYBeePosition))
      {
        honeycomb.rows[this.oldXBeePosition].cells[this.oldYBeePosition].setAttribute("style", "background-image: none");
      }
    }

    //-------The variables associated with the bee are reset-------
    this.actualXBeePosition = 0;
    this.actualYBeePosition = 0;
    this.cardinality = {
      cardinality: this.NORTH,
      urlImg: this.URL_IMG_BEE_NORTH,
    }; 

    //-------User-entered bee movement instructions are flushed-------
    this.clearDirectionsInstructions();
  }

  //--------------Returns the table that represents the honeycomb in the front--------------
  private getHoneycomb() : HTMLTableElement
  {
    return window.document.getElementById("honeycomb")! as HTMLTableElement;
  }

  //--------------It is checked if the honeycomb exists--------------
  private checkHoneycombExist(honeycomb: HTMLTableElement) : boolean
  {
    return honeycomb.rows.length != 0;
  }

  //--------------It is checked if the value that the user enters in the front for the columns that the honeycomb will have is within the minimum and maximum limit allowed--------------
  checkHoneycombDimensionsXFront(e: any)
  {
    if(e.target.value < this.MIN_DIMENSION)
    {
      e.target.value = this.MIN_DIMENSION;
      this.rowsSize = this.MIN_DIMENSION;
    }
    else if(e.target.value > this.MAX_DIMENSION)
    {
      e.target.value = this.MAX_DIMENSION;
      this.rowsSize = this.MAX_DIMENSION;
    }
  }

  //--------------It is checked if the value that the user enters in the front for the rows that the honeycomb will have is within the minimum and maximum limit allowed--------------
  checkHoneycombDimensionsYFront(e: any)
  {
    if(e.target.value < this.MIN_DIMENSION)
    {
      e.target.value = this.MIN_DIMENSION;
      this.columnsSize = this.MIN_DIMENSION;
    }
    else if(e.target.value > this.MAX_DIMENSION)
    {
      e.target.value = this.MAX_DIMENSION;
      this.columnsSize = this.MAX_DIMENSION;
    }
  }

  //--------------It is checked if the value that the user enters in the front for the position of the bee in the column is within the minimum and maximum limit allowed--------------
  checkPositionXBee(e: any)
  {
    if(e.target.value < this.MIN_DIMENSION)
    {
      e.target.value = this.MIN_DIMENSION;
      this.actualXBeePosition = this.MIN_DIMENSION;
    }
    else if(e.target.value >= this.rowsSize)
    {
      e.target.value = this.rowsSize;
      this.actualXBeePosition = this.rowsSize;
    }
  }

  //--------------It is checked if the value that the user enters in the front for the position of the bee in the row is within the minimum and maximum limit allowed--------------
  checkPositionYBee(e: any)
  {
    if(e.target.value < this.MIN_DIMENSION)
    {
      e.target.value = this.MIN_DIMENSION;
      this.actualYBeePosition = this.MIN_DIMENSION;
    }
    else if(e.target.value >= this.columnsSize)
    {
      e.target.value = this.columnsSize;
      this.actualYBeePosition = this.columnsSize;
    }
  }

  //--------------The cardinality the bee is looking at is changed according to a previous cardinality--------------
  setCardinality()
  {
    switch(this.cardinality.cardinality) 
    { 
      case this.NORTH: 
      { 
        this.cardinality = {
          cardinality: this.SOUTH,
          urlImg: this.URL_IMG_BEE_SOUTH,
        }; 
        break; 
      } 
      case this.SOUTH: 
      { 
        this.cardinality = {
          cardinality: this.EAST,
          urlImg: this.URL_IMG_BEE_EAST,
        }; 
        break; 
      }
      case this.EAST: 
      { 
        this.cardinality = {
          cardinality: this.WEST,
          urlImg: this.URL_IMG_BEE_WEST,
        }; 
        break; 
      }  
      default: 
      { 
        this.cardinality = {
          cardinality: this.NORTH,
          urlImg: this.URL_IMG_BEE_NORTH,
        }; 
        break; 
      } 
    } 
  }

  //--------------The url of the image corresponding to the cardinality required for the bee is obtained--------------
  private getUrlImg(cardinality: string): string
  {
    switch(cardinality) 
    { 
      case this.NORTH: 
      { 
        return this.URL_IMG_BEE_NORTH;
      } 
      case this.SOUTH: 
      { 
        return this.URL_IMG_BEE_SOUTH;
      }
      case this.EAST: 
      { 
        return this.URL_IMG_BEE_EAST;
      }  
      default: 
      { 
        return this.URL_IMG_BEE_WEST;
      } 
    } 
  }

  //--------------The new instruction desired by the user is added to the string containing the bee movement instructions--------------
  setDirectionsInstructions(newInstruction: string)
  {
    this.viewLabelChangePosition = true;
    this.directionsInstructions = this.directionsInstructions + newInstruction;
  }

  //--------------User-entered bee movement instructions are flushed--------------
  clearDirectionsInstructions()
  {
    this.viewLabelChangePosition = false;
    this.directionsInstructions = "";
  }

  //--------------The bee is placed in the initial position desired by the user--------------
  positionBee()
  {
    this.moveBee(this.actualXBeePosition, this.rowsSize - this.actualYBeePosition);
    this.viewChangePositionSection = true;
  }

  //--------------The bee is moved to a new position within the honeycomb--------------
  private moveBee(newX : number, newY: number)
  {
    this.viewErrorSection = false;

    //-------if the previous position where the bee was is within the current dimensions of the honeycomb, then the image representing the bee in that position is deleted-------
    var honeycomb = this.getHoneycomb();
    if(this.isValidPosition(this.oldXBeePosition, this.oldYBeePosition))
    {
      honeycomb.rows[this.oldYBeePosition].cells[this.oldXBeePosition].setAttribute("style", "background-image: none");
    }

    honeycomb.rows[newY].cells[newX].setAttribute("style", "background-image: url(" + this.cardinality.urlImg + ");background-repeat: no-repeat;background-position: center; background-size: contain");
    this.oldXBeePosition = newX;
    this.oldYBeePosition = newY;
  }

  //--------------It is verified that the required position is within the established dimensions of the honeycomb--------------
  private isValidPosition(x: number, y: number) 
  {
    return ((y >= this.MIN_DIMENSION && y <= this.rowsSize) && (x >= this.MIN_DIMENSION && x <= this.columnsSize))
  }

  //--------------The bee is moved to the final position according to the movement instructions entered by the user--------------
  finalPositionBee()
  {
    //Initialize Params Object
    let params = new HttpParams();

    //Begin assigning parameters
    params = params.append('xPosBee', this.oldXBeePosition);
    params = params.append('yPosBee', this.rowsSize - this.oldYBeePosition);
    params = params.append('rowsSize', this.rowsSize);
    params = params.append('columnsSize', this.columnsSize);
    params = params.append('cardinality', this.cardinality.cardinality);
    params = params.append('directionsInstructions', this.directionsInstructions);

    //Make the API call using the new parameters
    this.httpClient.get(this.REST_API_URL + '/final_position', { params: params }).subscribe(data => {
      this.serverData = data as JSON;
      var serverData = this.serverData as any;
      var newXBeePosition = serverData.xPosBee;
      var newYBeePosition = serverData.yPosBee;
      if(this.isValidPosition(newXBeePosition, newYBeePosition))
      {
        this.actualXBeePosition = newXBeePosition;
        this.actualYBeePosition = newYBeePosition;
        this.cardinality.cardinality = serverData.cardinality;
        this.cardinality.urlImg = this.getUrlImg(this.cardinality.cardinality);
        this.moveBee(this.actualXBeePosition, this.rowsSize - this.actualYBeePosition);
      }
      else
      {
        this.viewErrorSection = true;
      }

      //-------If there is an error, the labels that show the final position are not shown, but an error is shown that the bee went outside the established limits of the honeycomb-------
      if(this.viewErrorSection)
      {
        this.viewFinalPositionSection = false;
      }
      else
      {
        this.viewFinalPositionSection = true;
      }
    })
  }
}
