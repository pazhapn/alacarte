/// <reference path="Hotel.ts" />

module chart {
    export class HotelsResponse {
        public static CLOSE_CONNECTION: string = "closeCon";
        public static END_OF_RESULTS: string = "endResults";
        public static RESULT_SET: string = "results";

        constructor(public responseType: string, public hotels: Hotel[]) { }
    }
}