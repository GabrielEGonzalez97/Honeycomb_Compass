import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-honeycomb',
  templateUrl: './honeycomb.component.html',
  styleUrls: ['./honeycomb.component.css']
})
export class HoneycombComponent {
  colArray : number[] = [];
  rowArray: number[] = [];
  columns = 5;
  rows = 5;
  min = 0;
  max = 100;
  cardinality = "North";

  constructor() { }

  setShapeHoneycomb()
  {
    this.checkHoneycombDimensions();
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

  private checkHoneycombDimensions()
  {
    if(this.rows < this.min)
    {
      this.rows = this.min;
    }
    else if(this.rows > this.max)
    {
      this.rows = this.max;
    }

    if(this.columns < this.min)
    {
      this.columns = this.min;
    }
    else if(this.columns > this.max)
    {
      this.columns = this.max;
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
}
