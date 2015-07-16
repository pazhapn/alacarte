/// <reference path="definitions/jquery.d.ts"/>

// Module
module AdminHandler {


    // Class
    export class ListPropController {
        // Constructor
        constructor() { }

        public getMedia(id: string): void {
            console.log("getMedia "+id);
            var url: string = "/re/getmedia-"+id;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                success: (data) => {
                    console.log("getMedia data "+data);
                    $("#media-holder-" + id).children().remove();
                    $("#media-holder-" + id).append(data);   
                    $("#media-" + id).show();
                }
            });    
        }

        public getGeoLocation(id: string): void {
            console.log("getGeoLocation "+id);
            $("#geo-" + id).children().remove();
            var url: string = "/cd/get-geo-"+id;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                success: (data) => {
                    console.log("getGeoLocation data "+data);
                    $("#geo-" + id).append(data);   
                    $("#geo-" + id).show();
                }
            });    
        }
    }
}