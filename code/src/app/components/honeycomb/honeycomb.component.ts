import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-honeycomb',
  templateUrl: './honeycomb.component.html',
  styleUrls: ['./honeycomb.component.css']
})
export class HoneycombComponent {
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
  cardinality = "North";
  whereIsHeading = "";

  constructor() { }

  setShapeHoneycomb()
  {
    this.refreshControls();
    this.colArray = [];
    this.rowArray = [];
    for(let i = 0; i < this.columns; i++)
    {
      this.colArray.push(i);
    }
    for(let i = 0; i < this.rows; i++)
    {
      this.rowArray.push(i);
    }
  }

  refreshControls()
  {
    var table = window.document.getElementById("honeycomb")! as HTMLTableElement;
    if(table.rows.length != 0)
    {
      table.rows[this.oldX].cells[this.oldY].setAttribute("style", "background-image: none");
    }
    this.x = 0;
    this.y = 0;
    this.cardinality = "North";
    this.clearWhereIsHeading();
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
      e.target.value = this.rows - 1;
      this.x = this.rows - 1;
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
      e.target.value = this.columns - 1;
      this.y = this.columns - 1;
    }
  }

  setCardinality()
  {
    if(this.cardinality == "North")
    {
      this.cardinality = "South";
    }
    else if(this.cardinality == "South")
    {
      this.cardinality = "East";
    }
    else if(this.cardinality == "East")
    {
      this.cardinality = "West";
    }
    else
    {
      this.cardinality = "North";
    }
  }

  setWhereIsHeading(command: string)
  {
    this.whereIsHeading = this.whereIsHeading + command;
  }

  clearWhereIsHeading()
  {
    this.whereIsHeading = "";
  }

  positionBee()
  {
    var dir = 'https://i.postimg.cc/2yZXhh5n/bee.png';
    var table = window.document.getElementById("honeycomb")! as HTMLTableElement;
    table.rows[this.oldX].cells[this.oldY].setAttribute("style", "background-image: none");
    table.rows[this.x].cells[this.y].setAttribute("style", "background-image: url(" + dir + ");background-repeat: no-repeat;background-position: center; background-size: contain");
    this.oldX = this.x;
    this.oldY = this.y;
  }
}
