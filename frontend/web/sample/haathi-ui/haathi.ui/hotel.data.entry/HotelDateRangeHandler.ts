/// <reference path="../../../../../definitions/moment/moment.d.ts" />
/// <reference path="../../../../../definitions/jquery/jquery.d.ts" />
/// <reference path="../../../../../definitions/jqueryui/jqueryui.d.ts" />

module controller {
    export class HotelDateRangeHandler {

        private fromMinDate: Moment;
        private toMinDate: Moment;
        private fromMaxDate: Moment;
        private toMaxDate: Moment;
        private fromDate: Moment;
        private toDate: Moment;
        private endElement: JQuery;
        private startElement: JQuery;
        private dateFormat: string = "D, d M, yy"; // CARE, this format and parseDateFormat are related in conversion code
        private parseDateFormat: string = "D MMM, yyyy";

        constructor(today: string, startElementId: string, endElementId: string) {
            this.startElement = $(startElementId);
            this.endElement = $(endElementId);
            this.fromMinDate = moment(today, "MM-DD-YYYY");
            this.toMinDate = this.fromMinDate.clone().add('days', 1);
            this.fromMaxDate = this.fromMinDate.clone().add('years', 1).subtract('days', 1);
            this.toMaxDate = this.fromMinDate.clone().add('years', 1);
            this.createDateElements();
        }

        private parseDisplayTextToMoment(selectedDate: string): Moment {
            //console.log("parseDisplayTextToMoment ", selectedDate);
            //console.log("parseDisplayTextToMoment ", selectedDate.substring(selectedDate.indexOf(",") + 1).trim(), this.parseDateFormat);
            selectedDate = selectedDate.substring(selectedDate.indexOf(",") + 1).trim();
            selectedDate = selectedDate.substring(selectedDate.indexOf(" "), selectedDate.indexOf(",")).trim() + " " +
                selectedDate.substring(0, selectedDate.indexOf(" ")).trim() + 
                selectedDate.substring(selectedDate.indexOf(",")).trim();
            //return moment(selectedDate.substring(selectedDate.indexOf(",") + 1).trim(), this.parseDateFormat);
            return moment(selectedDate);
        }

        private fromDateChanged(selectedDate) {
            //console.log(selectedDate);
            this.fromDate = this.parseDisplayTextToMoment(selectedDate);
            if (this.fromDate) {
                this.endElement.datepicker("option", { minDate: this.fromDate.clone().add('days', 1).toDate() });
            }
            //if (this.toDate && this.toDate.diff(this.fromDate) <= 0) {}
            //console.log("fromDate", this.fromDate.toDate());
        }

        private toDateChanged(selectedDate) {
            //console.log(selectedDate);
            this.toDate = this.parseDisplayTextToMoment(selectedDate);
            if (this.toDate) {
                this.startElement.datepicker("option", { maxDate: this.toDate.clone().subtract('days', 1).toDate() });
            }
            //if (this.toDate && this.toDate.diff(this.fromDate) <= 0) {}
            //console.log("toDate", this.toDate.toDate());
        }


        private createDateElements() {
            //console.log("mindate be ", this.fromMinDate.toDate());
            //console.log("mindate af ", this.toMinDate.toDate());
            this.startElement.datepicker({
                minDate: this.fromMinDate.toDate(),
                maxDate: this.fromMaxDate.toDate(),
                defaultDate: this.fromMinDate.clone().add('days', 1).toDate(),
                numberOfMonths: 2,
                dateFormat: this.dateFormat,
                beforeShow: function (input, inst) {
                    var offset = $(input).offset();
                    var height = $(input).height();
                    window.setTimeout(function () {
                        inst.dpDiv.css({ top: (offset.top + height + 14) + 'px', left: offset.left + 'px' })
                    }, 1);
                },
                onClose: (selectedDate) => this.fromDateChanged(selectedDate)
            });
            this.endElement.datepicker({
                minDate: this.toMinDate.toDate(),
                maxDate: this.toMaxDate.toDate(),
                defaultDate: this.toMinDate.clone().add('days', 1).toDate(),
                numberOfMonths: 2,
                dateFormat: this.dateFormat,
                beforeShow: function (input, inst) {
                    var offset = $(input).offset();
                    var height = $(input).height();
                    window.setTimeout(function () {
                        inst.dpDiv.css({ top: (offset.top + height + 14) + 'px', left: offset.left + 'px' })
                    }, 1);
                },
                onClose: (selectedDate) => this.toDateChanged(selectedDate)
            });
        }
    }
}