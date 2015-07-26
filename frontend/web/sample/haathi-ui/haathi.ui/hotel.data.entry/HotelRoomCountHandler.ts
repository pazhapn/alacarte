/// <reference path="../../../../../definitions/moment/moment.d.ts" />
/// <reference path="../../../../../definitions/jquery/jquery.d.ts" />
/// <reference path="../../../../../definitions/jqueryui/jqueryui.d.ts" />

module controller {
    export class HotelRoomCountHandler {
        
        private roomCount: number = 5;
        private childCount: number = 5;
        private roomsCountElement: JQuery;
        private roomElements: JQuery[] = [];
        private adultCountElements: JQuery[] = [];
        private childrenCountElements: JQuery[] = [];
        private childAgesElements: JQuery[] = [];
        private childIndAgesElements: any[] = [];

        constructor() {
            this.buildRoomElements();
            this.handleRoomCountChange();
        }

        private buildRoomElements(): void {
            this.roomsCountElement = $("#roomsCount");
            for (var i = 0; i < this.roomCount; i++) {
                this.roomElements[i] = $("#room" + (i + 1));
                this.adultCountElements[i] = $("#room" + (i + 1) + "Adult");
                this.childrenCountElements[i] = $("#room" + (i + 1) + "Child");
                this.childAgesElements[i] = $("#room" + (i + 1) + "ChildAges");                
                this.childIndAgesElements[i] = [];
                for (var j = 0; j < this.childCount; j++) {
                    //console.log("this.childIndAgesElements[i] ", i, this.childIndAgesElements[i]);
                    this.childIndAgesElements[i][j] = $("#room" + (i + 1) + "Child"+(j+1));  
                }
                this.handleChildCountChange(i, this.childrenCountElements[i]);
            }
        }

        private handleChildCountChange(roomNumber: number, childrenCountElement: JQuery): void {
            childrenCountElement.change(() => {
                var childrenCount: number = childrenCountElement.val();
                console.log("childrenCount changed ", roomNumber);
                if (childrenCount > 0) {
                    this.childAgesElements[roomNumber].show();
                } else {
                    this.childAgesElements[roomNumber].hide();
                }
                for (var j = 0; j < this.childCount; j++) {
                    if (j < childrenCount) {
                        this.childIndAgesElements[roomNumber][j].show()
                    } else {
                        this.childIndAgesElements[roomNumber][j].hide()
                    }
                }
            })
        }

        private handleRoomCountChange(): void {
            this.roomsCountElement.change(() => {
                var roomsSelected: number = this.roomsCountElement.val();
                console.log("roomsCount changed ", roomsSelected);
                for (var i = 0; i < this.roomCount; i++) {
                    if (i < roomsSelected) {
                        this.roomElements[i].show();
                        this.adultCountElements[i].show();
                        this.childrenCountElements[i].show();
                    } else {
                        this.roomElements[i].hide();
                        this.adultCountElements[i].hide();
                        this.childrenCountElements[i].hide();
                    }
                }
            })
        }


    }
}