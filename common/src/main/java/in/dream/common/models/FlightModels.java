package in.dream.common.models;

import java.util.List;

import org.joda.time.DateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class FlightModels {
	public class FlightSearchResults{
		public AxisData axisData;
		public ItineraryResults itineraryResults;
	}
	public class AxisData{	
		public double priceMin;
		public double priceMax;
		public List<DateAxisMinMax> dateAxisMinMaxList;
	}
	public class DateAxisMinMax{
		public int durationMin;
		public int durationMax;
		public String departMin;
		public String departMax;
		public String departMinFullChart;
		public String departMaxFullChart;
		public String arrivalMin;
		public String arrivalMax;
		public String arrivalMinFullChart;
		public String arrivalMaxFullChart;
		
		@JsonIgnore
		public DateTime departMinAsDate;
		@JsonIgnore
		public DateTime departMaxAsDate;
		@JsonIgnore
		public DateTime arrivalMinAsDate;
		@JsonIgnore
		public DateTime arrivalMaxAsDate;
	}
	public class ItineraryResults{
		public List<TripDetail> trips;		
	}
	public class TripDetail{
		public int tripId;
		public double saleTotal;	
		public List<Slice> slices;	
		public String html;		
	}
	public class Slice{
		public int duration;
		public String departureTime;
		public String arrivalTimeInOrigin;
		public String arrivalTime;		
		public List<Segment> segments;
	}
	public class Segment{
		public int duration;
		public int connectionDuration;
		public String flightCarrier;
		public List<Leg> legs;
	}
	public class Leg{
		public int duration;
		public int connectionDuration;
		public String departTimeInOrigin;
		public String arrivalTimeInOrigin;
		public String origin;
		public String destination;		
	}
}