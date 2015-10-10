module Flights {
	export class FlightSearchResults{
		public axisData: AxisData;
		public itineraryResults: ItineraryResults;
	}
	export class AxisData{	
		public priceMin: number;
		public priceMax: number;
		public dateAxisMinMaxList: DateAxisMinMax[];
		constructor (){}
	}
	export class DateAxisMinMax{
		constructor (
			public durationMin: number,
			public durationMax: number,
			public departMin: string,
			public departMax: string,
			public departMinFullChart: string,
			public departMaxFullChart: string,
			public arrivalMin: string,
			public arrivalMax: string,
			public arrivalMinFullChart: string,
			public arrivalMaxFullChart: string
		){}		
	}
	export class ItineraryResults{
		public trips: Array<TripDetail>;
		constructor (){}
	}
	export class TripDetail{
		public tripId: number;
		public saleTotal: number;
		public slices: Array<Slice>;
		public html: string;		
		constructor (){}	
	}	
	export class Slice{
		public duration: number;
		public departureTime: string;
		public arrivalTimeInOrigin: string;
		public arrivalTime: string;
		public segments: Array<Segment>;
		constructor(){}
	}
	export class Segment{
		public duration: number;
		public connectionDuration: number;
		public flightCarrier: string;
		public legs: Array<Leg>;
		constructor(){}
	}
	export class Leg{
		public duration: number;
		public connectionDuration: number;
		public departTimeInOrigin: string;
		public arrivalTimeInOrigin: string;
		public origin: string;
		public destination: string;		
		constructor(){}
	}
}