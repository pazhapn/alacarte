/// <reference path="../../defi/d3.d.ts"/>
/// <reference path="../models/FlightModels.ts"/>

/*
/// <reference path="../models/QPXModels.ts"/>
/// <reference path="../ui/UIData.ts"/>
*/

module Flights {
	/*
	export class DataParsers {

		private parseDate = d3.time.format("%Y-%m-%dT%H:%M%Z").parse;
		private priceRound : number = 10;
		
		public createItineraries(flightResults : QPXResults) : ItineraryResults {
			var itinerary: ItineraryResults = new ItineraryResults();
			itinerary.trips = new Array<TripDetail>(flightResults.trips.tripOption.length);
			var trip: TripDetail;
			var slice: Slice;
			var to : TripOption;
			if (flightResults.trips.tripOption.length > 0) {
				var sliceCount: number = flightResults.trips.tripOption[0].slice.length;
				for (var i = 0; i < flightResults.trips.tripOption.length; i++) {
					trip = new TripDetail();
					to =  < TripOption > flightResults.trips.tripOption[i];
					trip.saleTotal = Number(to.saleTotal.substring(3, to.saleTotal.length));				
					trip.slices = new Array<Slice>(sliceCount);
					for(var slicePos = 0; slicePos < sliceCount; slicePos++){
						slice = new Slice(); 
						slice.duration = to.slice[slicePos].duration;
						slice.segments = new Array<Segment>(to.slice[slicePos].segment.length);
						slice.departureTime = this.parseDate(this.getDatePart(to.slice[slicePos].segment[0].leg[0].departureTime));
						slice.arrivalTimeInDest = this.parseDate(this.getDatePart(to.slice[slicePos].segment[to.slice[slicePos].segment.length - 1]
							.leg[to.slice[slicePos].segment[to.slice[slicePos].segment.length - 1].leg.length - 1].arrivalTime));
						trip.slices[slicePos] = slice;
					}
					itinerary.trips[i] = trip
				}
			}else{
				//TODO throw error 
			}
			return itinerary;
		}
		public calculateMinMaxForAxis(flightResults : QPXResults) : AxisData {
			var axisData : AxisData = new AxisData();
			var to : TripOption;
			var priceMinTmp : number = 0;
			var priceMaxTmp : number = 0;
			var tempPrice : number = 0;
			var tempDate : Date;
			if (flightResults.trips.tripOption.length > 0) {
				var dateAxisMinMaxList : DateAxisMinMax[] = new Array < DateAxisMinMax > (flightResults.trips.tripOption[0].slice.length);
				for (var i = 0; i < flightResults.trips.tripOption.length; i++) {
					to =  < TripOption > flightResults.trips.tripOption[i];
					tempPrice = Number(to.saleTotal.substring(3, to.saleTotal.length));
					if (priceMinTmp == 0 || tempPrice < priceMinTmp)
						priceMinTmp = tempPrice;
					if (priceMaxTmp == 0 || tempPrice > priceMaxTmp)
						priceMaxTmp = tempPrice;
					for (var sl = 0; sl < to.slice.length; sl++) {
						if (dateAxisMinMaxList[sl] == null) {
							dateAxisMinMaxList[sl] = new DateAxisMinMax(null, null, null, null);
						}

						tempDate = this.parseDate(this.getDatePart(to.slice[sl].segment[0].leg[0].departureTime));
						//console.log('depart ',this.getDatePart(to.slice[sl].segment[0].leg[0].departureTime), tempDate);
						if (dateAxisMinMaxList[sl].departMin == null || tempDate < dateAxisMinMaxList[sl].departMin)
							dateAxisMinMaxList[sl].departMin = tempDate;
						if (dateAxisMinMaxList[sl].departMax == null || tempDate > dateAxisMinMaxList[sl].departMax)
							dateAxisMinMaxList[sl].departMax = tempDate;

						tempDate = this.parseDate(this.getDatePart(to.slice[sl].segment[to.slice[sl].segment.length - 1].leg[to.slice[sl].segment[to.slice[sl].segment.length - 1].leg.length - 1].arrivalTime));
						//console.log('arrival ',this.getDatePart(to.slice[sl].segment[to.slice[sl].segment.length-1].leg[to.slice[sl].segment[to.slice[sl].segment.length-1].leg.length - 1].arrivalTime), tempDate);
						if (dateAxisMinMaxList[sl].arrivalMin == null || tempDate < dateAxisMinMaxList[sl].arrivalMin)
							dateAxisMinMaxList[sl].arrivalMin = tempDate;
						if (dateAxisMinMaxList[sl].arrivalMax == null || tempDate > dateAxisMinMaxList[sl].arrivalMax)
							dateAxisMinMaxList[sl].arrivalMax = tempDate;
					}
				}
				axisData.dateAxisMinMaxList = dateAxisMinMaxList;
			}
			axisData.priceMin = Math.round((priceMinTmp / this.priceRound) * this.priceRound) - this.priceRound;
			axisData.priceMax = Math.round((priceMaxTmp / this.priceRound) * this.priceRound) + this.priceRound;
			return axisData;
		}

		private getDatePart(str : string) : string {
			return str.slice(0, 19) + str.slice(20, str.length);
		}
		
	}
	*/
	
		/*
		private registerFunctions(): void {
		this.priceMinFn = (to: TripOption):number => Math.round((Number(to.saleTotal.substring(3, to.saleTotal.length)) / this.priceRound) * this.priceRound) - this.priceRound;
		this.priceMaxFn = (to: TripOption):number => Math.round((Number(to.saleTotal.substring(3, to.saleTotal.length)) / this.priceRound) * this.priceRound) + this.priceRound;
		}
		 */
}