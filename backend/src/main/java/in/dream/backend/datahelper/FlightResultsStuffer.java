package in.dream.backend.datahelper;

import java.util.Calendar;
import java.util.GregorianCalendar;

import in.dream.common.models.FlightResults;
import in.dream.common.utils.JSONUtil;

public class FlightResultsStuffer {

	public static void main(String[] args) {
		Calendar time = GregorianCalendar.getInstance();
		FlightResults fr = new FlightResults();
		fr.setComplete(true);
		fr.setCurrencySign("$");
		fr.setInfantCount(0);
		fr.setIntlFlight(true);
		fr.setMaxPrice(10000);
		fr.setMinPrice(6000);
		time.set(2015, 9, 3, 6, 30, 0);
		fr.setOnwardLandingEnd(time.getTime());
		try{
			System.out.println(JSONUtil.write(fr));
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
