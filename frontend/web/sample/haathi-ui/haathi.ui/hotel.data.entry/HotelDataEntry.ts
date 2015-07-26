/// <reference path="HotelDateRangeHandler.ts" />
/// <reference path="HotelSuggestHandler.ts" />
/// <reference path="HotelRoomCountHandler.ts" />

module controller{
    export class HotelDataEntry {
        
        private hotelDateRangeHandler: HotelDateRangeHandler;
        private hotelSuggestHandler: HotelSuggestHandler;
        private hotelRoomCountHandler: HotelRoomCountHandler;

        constructor(today: string, suggestUrl: string) {
            this.hotelDateRangeHandler = new HotelDateRangeHandler(today, "#checkIn", "#checkOut");
            this.hotelSuggestHandler = new HotelSuggestHandler("#hotelLocation", "#hotelLocationId", suggestUrl);
            this.hotelRoomCountHandler = new HotelRoomCountHandler();
        }

        public submitHotelSearch() {
            $('#hotelsSearch select:hidden').attr("disabled", true);
        }

    }
}