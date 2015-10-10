package in.dream.backend.datahelper;

import in.dream.common.models.FlightModels;
import in.dream.common.models.FlightModels.AxisData;
import in.dream.common.models.FlightModels.DateAxisMinMax;
import in.dream.common.models.FlightModels.FlightSearchResults;
import in.dream.common.models.FlightModels.ItineraryResults;
import in.dream.common.models.FlightModels.Leg;
import in.dream.common.models.FlightModels.Segment;
import in.dream.common.models.FlightModels.Slice;
import in.dream.common.models.FlightModels.TripDetail;
import in.dream.common.utils.JSONUtil;

import java.io.File;
import java.nio.charset.Charset;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.qpxExpress.model.SliceInfo;
import com.google.api.services.qpxExpress.model.TripOption;
import com.google.api.services.qpxExpress.model.TripsSearchResponse;
import com.google.common.io.Files;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class DataConverter {
	private DateTimeFormatter dateTimeFormatter, arrivalConverter, departConverter;
	private DateTimeZone departTimeZone = null, arrivalTimeZone = null;
	private int priceRound = 10;
	private FlightModels flightModels;
	
	public DataConverter(){
		this.flightModels = new FlightModels();
		//2015-08-29T13:20+04:00
		this.dateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mmZ").withOffsetParsed();
	}
	
	public FlightSearchResults getFlightSearchResults(List<TripOption> tripOptions){
		FlightSearchResults flightSearchResults = flightModels.new FlightSearchResults();
		flightSearchResults.itineraryResults = getItineraryResults(tripOptions);
		flightSearchResults.axisData = getAxisData(tripOptions);
		return flightSearchResults;
	}
	
	private AxisData getAxisData(List<TripOption> tripOptions){
		AxisData axisData = flightModels.new AxisData();
		TripOption to;
		double priceMinTmp = 0;
		double priceMaxTmp = 0;
		double tempPrice = 0;
		int tempDuration = 0;
		DateTime tempDate;
		String tempDateString;
		SliceInfo si;
		if (tripOptions.size() > 0) {
			List<DateAxisMinMax> dateAxisMinMaxList = new ArrayList<>();
			for (int i = 0; i < tripOptions.size(); i++) {
				to = tripOptions.get(i);
				tempPrice = Double.parseDouble(to.getSaleTotal().substring(3, to.getSaleTotal().length()));
				if (priceMinTmp == 0 || tempPrice < priceMinTmp)
					priceMinTmp = tempPrice;
				if (priceMaxTmp == 0 || tempPrice > priceMaxTmp)
					priceMaxTmp = tempPrice;
				for (int sl = 0; sl < to.getSlice().size(); sl++) {
					si = to.getSlice().get(sl);
					if(dateAxisMinMaxList.size() <= sl) {
						dateAxisMinMaxList.add(flightModels.new DateAxisMinMax());	
					}
					tempDuration = si.getDuration();
					if(dateAxisMinMaxList.get(sl).durationMin == 0 || dateAxisMinMaxList.get(sl).durationMin > tempDuration){
						dateAxisMinMaxList.get(sl).durationMin = tempDuration;
					}
					if(dateAxisMinMaxList.get(sl).durationMax == 0 || dateAxisMinMaxList.get(sl).durationMax < tempDuration){
						dateAxisMinMaxList.get(sl).durationMax = tempDuration;
					}
					
					tempDateString = to.getSlice().get(sl).getSegment().get(0).getLeg().get(0).getDepartureTime();
					tempDate = parseDate(tempDateString);
					if (dateAxisMinMaxList.get(sl).departMinAsDate == null || tempDate.isBefore(dateAxisMinMaxList.get(sl).departMinAsDate.getMillis())){
						dateAxisMinMaxList.get(sl).departMinAsDate = tempDate;
						dateAxisMinMaxList.get(sl).departMin = getDatePart(tempDateString);						
					}
					if (dateAxisMinMaxList.get(sl).departMaxAsDate == null || tempDate.isAfter(dateAxisMinMaxList.get(sl).departMaxAsDate.getMillis())){
						dateAxisMinMaxList.get(sl).departMaxAsDate = tempDate;
						dateAxisMinMaxList.get(sl).departMax = getDatePart(tempDateString);
					}

					tempDateString = si.getSegment().get(si.getSegment().size() - 1).getLeg()
							.get(si.getSegment().get(si.getSegment().size() - 1).getLeg().size() - 1).getArrivalTime();
					tempDate = parseDate(tempDateString);
					//console.log('arrival ',this.getDatePart(to.slice[sl].segment[to.slice[sl].segment.length-1].leg[to.slice[sl].segment[to.slice[sl].segment.length-1].leg.length - 1].arrivalTime), tempDate);
					if (dateAxisMinMaxList.get(sl).arrivalMinAsDate == null || tempDate.isBefore(dateAxisMinMaxList.get(sl).arrivalMinAsDate.getMillis())){
						dateAxisMinMaxList.get(sl).arrivalMinAsDate = tempDate;
						dateAxisMinMaxList.get(sl).arrivalMin = getDatePart(tempDateString);
					}
					if (dateAxisMinMaxList.get(sl).arrivalMaxAsDate == null || tempDate.isAfter(dateAxisMinMaxList.get(sl).arrivalMaxAsDate.getMillis())){
						dateAxisMinMaxList.get(sl).arrivalMaxAsDate = tempDate;
						dateAxisMinMaxList.get(sl).arrivalMax = getDatePart(tempDateString);
					}
				}
			}
			axisData.dateAxisMinMaxList = dateAxisMinMaxList;
		}
		axisData.priceMin = Math.round((priceMinTmp / priceRound) * priceRound) - priceRound;
		axisData.priceMax = Math.round((priceMaxTmp / priceRound) * priceRound) + priceRound;
		for(DateAxisMinMax damm: axisData.dateAxisMinMaxList){
			damm.departMinFullChart = damm.departMin;
			damm.departMaxFullChart = this.departConverter.print(damm.arrivalMaxAsDate.getMillis());//.withZone(departTimeZone)
			damm.arrivalMinFullChart = this.arrivalConverter.print(damm.departMinAsDate.getMillis());//.withZone(arrivalTimeZone)
			damm.arrivalMaxFullChart = damm.arrivalMax;
		}
		return axisData;
	}
	
	private ItineraryResults getItineraryResults(List<TripOption> tripOptions){
		ItineraryResults itineraryResult = flightModels.new ItineraryResults();
		itineraryResult.trips = new ArrayList<>();
		if(tripOptions.size() > 0){
			TripDetail tripDetail;
			TripOption to;
			SliceInfo si;
			Slice slice;
			Segment seg;
			Leg leg;
			int sliceCount, segmentCount, legCount;
			boolean timeZoneNotFound = true;
			for(int i=0; i<tripOptions.size(); i++) {
				tripDetail = flightModels.new TripDetail();
				to = tripOptions.get(i);
				sliceCount = to.getSlice().size();
				tripDetail.tripId = i;
				tripDetail.saleTotal = Double.parseDouble(to.getSaleTotal().substring(3, to.getSaleTotal().length()));
				tripDetail.slices = new ArrayList<>();
				for(int slicePos = 0;slicePos < sliceCount; slicePos++){
					slice = flightModels.new Slice();
					si = to.getSlice().get(slicePos);
					slice.duration = si.getDuration();
					segmentCount = si.getSegment().size();
					slice.segments = new ArrayList<>();
					slice.departureTime = getDatePart(si.getSegment().get(0).getLeg().get(0).getDepartureTime());
					slice.arrivalTime = getDatePart(si.getSegment().get(si.getSegment().size() - 1).getLeg()
							.get(si.getSegment().get(si.getSegment().size() - 1).getLeg().size() - 1).getArrivalTime());
					if(timeZoneNotFound){
						String tmp = slice.departureTime.substring(slice.departureTime.length()-5, slice.departureTime.length());
						departTimeZone =  DateTimeZone.forOffsetHoursMinutes(Integer.parseInt(tmp.substring(0, 3)), Integer.parseInt(tmp.substring(3, 5)));
						tmp = slice.arrivalTime.substring(slice.arrivalTime.length()-5, slice.arrivalTime.length());
						arrivalTimeZone =  DateTimeZone.forOffsetHoursMinutes(Integer.parseInt(tmp.substring(0, 3)), Integer.parseInt(tmp.substring(3, 5)));
						this.arrivalConverter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mmZ").withZone(arrivalTimeZone);
						this.departConverter = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mmZ").withZone(departTimeZone);
						timeZoneNotFound = false;
						
					}
					slice.arrivalTimeInOrigin = this.arrivalConverter.print(parseDate(slice.arrivalTime).getMillis());//.withZone(departTimeZone)
					for(int segmentPos =0; segmentPos< segmentCount; segmentPos++){
						seg = flightModels.new Segment();
						seg.duration = si.getSegment().get(segmentPos).getDuration();
						if(si.getSegment().get(segmentPos).getConnectionDuration() != null)
							seg.connectionDuration = si.getSegment().get(segmentPos).getConnectionDuration();
						seg.flightCarrier = si.getSegment().get(segmentPos).getFlight().getCarrier();
						legCount = si.getSegment().get(segmentPos).getLeg().size();
						seg.legs = new ArrayList<>();
						for(int legPos=0; legPos < legCount; legPos++){
							leg = flightModels.new Leg();
							leg.duration = si.getSegment().get(segmentPos).getLeg().get(legPos).getDuration();
							if(si.getSegment().get(segmentPos).getLeg().get(legPos).getConnectionDuration() != null)
								leg.connectionDuration = si.getSegment().get(segmentPos).getLeg().get(legPos).getConnectionDuration();
							leg.departTimeInOrigin = this.departConverter.print(parseDate(getDatePart(si.getSegment().get(segmentPos).getLeg().get(legPos).getDepartureTime())).getMillis());
							leg.arrivalTimeInOrigin = this.departConverter.print(parseDate(getDatePart(si.getSegment().get(segmentPos).getLeg().get(legPos).getArrivalTime())).getMillis());
							leg.origin = si.getSegment().get(segmentPos).getLeg().get(legPos).getOrigin();
							leg.destination = si.getSegment().get(segmentPos).getLeg().get(legPos).getDestination();
							seg.legs.add(leg);
						}
						slice.segments.add(seg);
					}
					tripDetail.slices.add(slice);
				}
				tripDetail.html = "<div>"+to.getId()+"<br/>"+to.getSlice().get(0).getSegment().get(0).getLeg().get(0).getDepartureTime()
						+"<br/>"+to.getSlice().get(to.getSlice().size() - 1).getSegment().get(to.getSlice().get(to.getSlice().size() - 1).getSegment().size() - 1).getLeg()
						.get(to.getSlice().get(to.getSlice().size() - 1).getSegment().get(to.getSlice().get(to.getSlice().size() - 1).getSegment().size() - 1).getLeg().size() - 1).getArrivalTime()+"<br/>"+to.getSaleTotal()+"</div>";
				itineraryResult.trips.add(tripDetail);
			}
		}
		return itineraryResult;
	}
	private DateTime parseDate(String str) {
		return dateTimeFormatter.parseDateTime(str);
	}
	private String getDatePart(String str) {
		return str.substring(0, 19) + str.substring(20, str.length());
	}
	public static void main(String[] args) {
		try{
			
			GsonFactory  factory= new GsonFactory();
			List<TripOption> tripOptions = factory.fromString(
					Files.toString(new File("C:/projects/alacarte/backend/data/full_qpx.json"), Charset.forName("UTF-8")), 
					TripsSearchResponse.class).getTrips().getTripOption();
			DataConverter dc = new DataConverter();
			/*
			ItineraryResults res = DataConverter.getItineraryResults(tripOptions);
			System.out.println(JSONUtil.write(res));
			System.out.println(JSONUtil.write(dc.getAxisData(tripOptions)));
			System.out.println(JSONUtil.write(dc.parseDate("2015-08-29T13:20+04:00")));
			*/
			FlightSearchResults fsr = dc.getFlightSearchResults(tripOptions);
			System.out.println(JSONUtil.write(fsr));
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
