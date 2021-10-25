import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-honeycomb',
  templateUrl: './honeycomb.component.html',
  styleUrls: ['./honeycomb.component.css']
})

export class HoneycombComponent
{
  colArray : number[] = [];
  rowArray: number[] = [];
  min = 0;
  max = 100;
  rows = 5;
  columns = 5;
  x = 0;
  y = 0;
  oldX = 0;
  oldY = 0;
  north = "North";
  south = "South";
  west = "West";
  east = "East";
  cardinality = this.north;
  whereIsHeading = "";
  imgBeeNorth = 'https://i.postimg.cc/s2YhJnWD/bee-north.png';
  imgBeeSouth = 'https://i.postimg.cc/43kcVCmS/bee-south.png';
  imgBeeEast = 'https://i.postimg.cc/wTrLxRHH/bee-east.png';
  imgBeeWest = 'https://i.postimg.cc/RZnfWCVt/bee-west.png';
  urlImg = this.imgBeeNorth;
  viewStartPositionSection = false;
  viewChangePositionSection = false;
  viewLabelChangePosition = false;
  viewFinalPositionSection = false;
  viewErrorSection = false;
  serverData = JSON;

  constructor(private httpClient: HttpClient) { }

  sayHi() {
    this.httpClient.get('http://127.0.0.1:5002/').subscribe(data => {
      this.serverData = data as JSON;
      console.log(this.serverData);
    })
  }

  setShapeHoneycomb()
  {
    this.refreshControls();
    this.colArray = [];
    this.rowArray = [];
    for(let i = 0; i < this.columns + 1; i++)
    {
      this.colArray.push(i);
    }
    for(let i = 0; i < this.rows + 1; i++)
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
      if(this.isValidPosition(this.oldX, this.oldY))
      {
        honeycomb.rows[this.oldX].cells[this.oldY].setAttribute("style", "background-image: none");
      }
    }
    this.x = 0;
    this.y = 0;
    this.cardinality = this.north;
    this.clearWhereIsHeading();
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
    if(e.target.value < this.min)
    {
      e.target.value = this.min;
      this.rows = this.min;
    }
    else if(e.target.value > this.max)
    {
      e.target.value = this.max;
      this.rows = this.max;
    }
  }

  checkHoneycombDimensionsYFront(e: any)
  {
    if(e.target.value < this.min)
    {
      e.target.value = this.min;
      this.columns = this.min;
    }
    else if(e.target.value > this.max)
    {
      e.target.value = this.max;
      this.columns = this.max;
    }
  }

  checkPositionXBee(e: any)
  {
    if(e.target.value < this.min)
    {
      e.target.value = this.min;
      this.x = this.min;
    }
    else if(e.target.value >= this.rows)
    {
      e.target.value = this.rows;
      this.x = this.rows;
    }
  }

  checkPositionYBee(e: any)
  {
    if(e.target.value < this.min)
    {
      e.target.value = this.min;
      this.y = this.min;
    }
    else if(e.target.value >= this.columns)
    {
      e.target.value = this.columns;
      this.y = this.columns;
    }
  }

  setCardinality()
  {
    switch(this.cardinality) 
    { 
      case this.north: 
      { 
        this.cardinality = this.south;
        break; 
      } 
      case this.south: 
      { 
        this.cardinality = this.east;
        break; 
      }
      case this.east: 
      { 
        this.cardinality = this.west;
        break; 
      }  
      default: 
      { 
        this.cardinality = this.north;
        break; 
      } 
    } 
  }

  setWhereIsHeading(command: string)
  {
    this.viewLabelChangePosition = true;
    this.whereIsHeading = this.whereIsHeading + command;
  }

  clearWhereIsHeading()
  {
    this.viewLabelChangePosition = false;
    this.whereIsHeading = "";
  }

  setUrlImg()
  {
    switch(this.cardinality) 
    { 
      case this.north: 
      { 
        this.urlImg = this.imgBeeNorth;
        break; 
      } 
      case this.south: 
      { 
        this.urlImg = this.imgBeeSouth; 
        break; 
      }
      case this.east: 
      { 
        this.urlImg = this.imgBeeEast;
        break; 
      }  
      default: 
      { 
        this.urlImg = this.imgBeeWest; 
        break; 
      } 
    } 
  }

  positionBee()
  {
    this.moveBee(this.x, this.rows - this.y);
    this.viewChangePositionSection = true;
  }

  private moveBee(newX : number, newY: number)
  {
    var honeycomb = this.getHoneycomb();
    if(this.isValidPosition(this.oldX, this.oldY))
    {
      honeycomb.rows[this.oldY].cells[this.oldX].setAttribute("style", "background-image: none");
    }

    this.setUrlImg();
    this.viewErrorSection = false;
    honeycomb.rows[newY].cells[newX].setAttribute("style", "background-image: url(" + this.urlImg + ");background-repeat: no-repeat;background-position: center; background-size: contain");
    this.oldX = newX;
    this.oldY = newY;
  }

  private isValidPosition(x: number, y: number) 
  {
    return ((y >= this.min && y <= this.rows) && (x >= this.min && x <= this.columns))
  }

  finalPositionBee()
  {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('xPos', this.oldX);
    params = params.append('yPos', this.rows - this.oldY);
    params = params.append('rows', this.rows);
    params = params.append('columns', this.columns);
    params = params.append('cardinality', this.cardinality);
    params = params.append('whereIsHeading', this.whereIsHeading);

    // Make the API call using the new parameters.
    this.httpClient.get('http://127.0.0.1:5002/final_position', { params: params }).subscribe(data => {
      this.serverData = data as JSON;
    })

    var bee = this.serverData as any;
    var newX = bee.xPos;
    var newY = bee.yPos;
    if(this.isValidPosition(newX, newY))
    {
      this.x = newX;
      this.y = newY;
      this.cardinality = bee.cardinality;
      this.moveBee(this.x, this.rows - this.y);
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
  }
}
