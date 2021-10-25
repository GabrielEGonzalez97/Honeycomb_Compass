import { Component, Input } from '@angular/core';

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

  constructor() { }

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
    var honeycomb = this.getHoneycomb();
    if(this.checkHoneycombExist(honeycomb))
    {
      honeycomb.rows[this.oldX].cells[this.oldY].setAttribute("style", "background-image: none");
    }
    this.x = 0;
    this.y = 0;
    this.cardinality = this.north;
    this.urlImg = this.imgBeeNorth;
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
        this.urlImg = this.imgBeeSouth;
        break; 
      } 
      case this.south: 
      { 
        this.cardinality = this.east;
        this.urlImg = this.imgBeeEast; 
        break; 
      }
      case this.east: 
      { 
        this.cardinality = this.west;
        this.urlImg = this.imgBeeWest;
        break; 
      }  
      default: 
      { 
        this.cardinality = this.north;
        this.urlImg = this.imgBeeNorth; 
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

  getLeftActualCardinality() : string
  {
    switch(this.cardinality) 
    { 
      case this.north: 
      { 
        this.urlImg = this.imgBeeWest; 
        return this.west;
      } 
      case this.west: 
      { 
        this.urlImg = this.imgBeeSouth; 
        return this.south; 
      }
      case this.south: 
      { 
        this.urlImg = this.imgBeeEast; 
        return this.east;
      }
      default: 
      { 
        this.urlImg = this.imgBeeNorth; 
        return this.north; 
      } 
    } 
  }

  getRightActualCardinality() : string
  {
    switch(this.cardinality) 
    { 
      case this.north: 
      { 
        this.urlImg = this.imgBeeEast; 
        return this.east;
      } 
      case this.east: 
      { 
        this.urlImg = this.imgBeeSouth; 
        return this.south;
      }
      case this.south: 
      { 
        this.urlImg = this.imgBeeWest; 
        return this.west; 
      }  
      default: 
      { 
        this.urlImg = this.imgBeeNorth; 
        return this.north;
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
    honeycomb.rows[this.oldY].cells[this.oldX].setAttribute("style", "background-image: none");
    honeycomb.rows[newY].cells[newX].setAttribute("style", "background-image: url(" + this.urlImg + ");background-repeat: no-repeat;background-position: center; background-size: contain");
    this.oldX = newX;
    this.oldY = newY;
  }

  finalPositionBee()
  {
    var canMove = true;
    for (let i = 0; i < this.whereIsHeading.length && canMove; i++) 
    {
      const command = this.whereIsHeading.charAt(i);
      if(command == 'L')
      {
        this.cardinality = this.getLeftActualCardinality();
      }
      else if(command == 'R')
      {
        this.cardinality = this.getRightActualCardinality();
      }
      else if(command == 'M')
      {
        switch(this.cardinality) 
        { 
          case this.north: 
          { 
            this.moveBee(this.oldX, this.oldY - 1);
            break;
          } 
          case this.east: 
          { 
            this.moveBee(this.oldX + 1, this.oldY);
            break;
          }
          case this.south: 
          { 
            this.moveBee(this.oldX, this.oldY + 1);
            break;
          }  
          default: 
          { 
            this.moveBee(this.oldX - 1, this.oldY);
            break;
          } 
        } 
      }
    }
    this.viewFinalPositionSection = true;
  }
}
