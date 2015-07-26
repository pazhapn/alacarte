/// <reference path="../../../../../definitions/moment/moment.d.ts" />
/// <reference path="../../../../../definitions/jquery/jquery.d.ts" />
/// <reference path="../../../../../definitions/jqueryui/jqueryui.d.ts" />

module controller {
    export class HotelSuggestHandler {

        private suggestElement: JQuery;
        private locationElement: JQuery;

        constructor(private suggestElementId: string, private locationId: string, private suggestUrl: string) {
            this.suggestElement = $(suggestElementId);
            this.locationElement = $(locationId);
            this.createSuggestElement();
        }

        private createSuggestElement(): void {
            this.suggestElement.autocomplete({
                source: (request, response) => {
                    $.ajax({
                        url: this.suggestUrl, 
                        data: request,
                        dataType: "json",
                        type: "GET",
                        success: (data) => {
                            //console.log("auto suggest", data);
                            response(data);
                        }
                    });
                },
                select: (event, ui) => {
                    this.locationElement.val(ui.item.id);
                    //console.log(ui.item);
                },
                minLength: 3
            });
        }
    }
}