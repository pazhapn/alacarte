/// <reference path="../../defi/d3.d.ts"/>

module Flights {
	
	export var parseDate:any = d3.time.format("%Y-%m-%dT%H:%M%Z").parse;
    export var listElement: D3.Selection = d3.select("#flights-list");        
    export var listByConds = {price: 1, duration: 2};
    export var orderByConds = {asc: 1, desc: 2};
    export var dimType = {departTimeDim: 1, arrivalTimeDim: 2, priceDim: 3, durationDim: 4};
    export var currentValues = {listBy: listByConds.price, orderBy: orderByConds.asc, listSize: 10, slicePos: 0};
    export function chartDate(date: Date, minutes: number): Date { return new Date(date.getTime() + minutes*60000)};
}