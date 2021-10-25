import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-honeycomb',
  templateUrl: './honeycomb.component.html',
  styleUrls: ['./honeycomb.component.css']
})

export class HoneycombComponent
{
  readonly REST_API_URL = 'http://127.0.0.1:5002/';
  readonly MIN_DIMENSION = 0;
  readonly MAX_DIMENSION = 100;
  readonly NORTH = "North";
  readonly SOUTH = "South";
  readonly WEST = "West";
  readonly EAST = "East";
  readonly URL_IMG_BEE_NORTH = 'https://i.postimg.cc/s2YhJnWD/bee-north.png';
  readonly URL_IMG_BEE_SOUTH = 'https://i.postimg.cc/43kcVCmS/bee-south.png';
  readonly URL_IMG_BEE_EAST = 'https://i.postimg.cc/wTrLxRHH/bee-east.png';
  readonly URL_IMG_BEE_WEST = 'https://i.postimg.cc/RZnfWCVt/bee-west.png';

  colArray : number[] = [];
  rowArray: number[] = [];
  rowsSize = 5;
  columnsSize = 5;
  actualXBeePosition = 0;
  actualYBeePosition = 0;
  oldXBeePosition = 0;
  oldYBeePosition = 0;

  cardinality: Record<string, string> = {
    cardinality: this.NORTH,
    urlImg: this.URL_IMG_BEE_NORTH,
  }; 
  directionsInstructions = "";

  viewStartPositionSection = false;
  viewChangePositionSection = false;
  viewLabelChangePosition = false;
  viewFinalPositionSection = false;
  viewErrorSection = false;

  serverData = JSON;

  constructor(private httpClient: HttpClient) 
  { 

  }

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

  private refreshControls()
  {
    this.viewChangePositionSection = false;
    this.viewLabelChangePosition = false;
    this.viewFinalPositionSection = false;
    this.viewErrorSection = false;
    var honeycomb = this.getHoneycomb();
    if(this.checkHoneycombExist(honeycomb))
    {
      if(this.isValidPosition(this.oldXBeePosition, this.oldYBeePosition))
      {
        honeycomb.rows[this.oldXBeePosition].cells[this.oldYBeePosition].setAttribute("style", "background-image: none");
      }
    }
    this.actualXBeePosition = 0;
    this.actualYBeePosition = 0;
    this.cardinality = {
      cardinality: this.NORTH,
      urlImg: this.URL_IMG_BEE_NORTH,
    }; 
    this.clearDirectionsInstructions();
  }

  private getHoneycomb() : HTMLTableElement
  {
    return window.document.getElementById("honeycomb")! as HTMLTableElement;
  }

  private checkHoneycombExist(honeycomb: HTMLTableElement) : boolean
  {
    return honeycomb.rows.length != 0;
  }

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

  setDirectionsInstructions(newInstruction: string)
  {
    this.viewLabelChangePosition = true;
    this.directionsInstructions = this.directionsInstructions + newInstruction;
  }

  clearDirectionsInstructions()
  {
    this.viewLabelChangePosition = false;
    this.directionsInstructions = "";
  }

  positionBee()
  {
    this.moveBee(this.actualXBeePosition, this.rowsSize - this.actualYBeePosition);
    this.viewChangePositionSection = true;
  }

  private moveBee(newX : number, newY: number)
  {
    var honeycomb = this.getHoneycomb();
    if(this.isValidPosition(this.oldXBeePosition, this.oldYBeePosition))
    {
      honeycomb.rows[this.oldYBeePosition].cells[this.oldXBeePosition].setAttribute("style", "background-image: none");
    }

    this.viewErrorSection = false;
    honeycomb.rows[newY].cells[newX].setAttribute("style", "background-image: url(" + this.cardinality.urlImg + ");background-repeat: no-repeat;background-position: center; background-size: contain");
    this.oldXBeePosition = newX;
    this.oldYBeePosition = newY;
  }

  private isValidPosition(x: number, y: number) 
  {
    return ((y >= this.MIN_DIMENSION && y <= this.rowsSize) && (x >= this.MIN_DIMENSION && x <= this.columnsSize))
  }

  finalPositionBee()
  {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('xPosBee', this.oldXBeePosition);
    params = params.append('yPosBee', this.rowsSize - this.oldYBeePosition);
    params = params.append('rowsSize', this.rowsSize);
    params = params.append('columnsSize', this.columnsSize);
    params = params.append('cardinality', this.cardinality.cardinality);
    params = params.append('directionsInstructions', this.directionsInstructions);

    // Make the API call using the new parameters.
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
