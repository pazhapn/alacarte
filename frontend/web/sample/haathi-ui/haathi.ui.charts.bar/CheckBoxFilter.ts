/// <reference path="../../../../definitions/d3/d3.d.ts" />
/// <reference path="../../../../online/js/site/slicer-all.d.ts" />
module chart {
    export class CheckBoxFilter {
        private checkBoxElements: any[] = [];
        private displayElements: HTMLElement[] = [];
        private checkBoxFunctions = [];
        private groupAll;
        private groupSize;
        private filterValues: any[] = [];

        constructor(private id: string, private hSlicer: slicer.Slicer,
            private dimension: slicer.Dimension, private group: slicer.Group, private chartsController: chart.ChartsController) {
                this.groupSize = this.group.size();
                this.groupAll = this.group.all();
                //console.log(this.groupAll);
        }
        //TODO clear listeners
        public shutdown(): void {

        }
        public renderCheckBoxes(): void {
            var key;
            for (var i = 0; i < this.groupSize; i++) {
                key = this.groupAll[i].key;
                //console.log("displayElements ", key);
                if (this.displayElements[key] == null) {
                    this.addListener(key);
                    this.filterValues[i] = key+"";
                }
                this.displayElements[key].textContent = this.groupAll[i].value;
                //console.log("CheckBoxFilter ", key, this.groupAll[i].value);
            }
        }

        private addListener(key: any): void {
            this.displayElements[key] = document.getElementById(this.id + key);
            this.checkBoxElements[key] = document.getElementById(this.id + "-check-" + key);
            this.checkBoxElements[key].value = key;
            this.checkBoxFunctions[key] = () => this.filterCheckBoxes();
            this.checkBoxElements[key].addEventListener("click", this.checkBoxFunctions[key], false);
        }

        private filterCheckBoxes(): void {
            var selectedValues: any[] = [];
            var hasSelectedValue: boolean = false;
            for (var prop in this.checkBoxElements) {
                if (this.checkBoxElements.hasOwnProperty(prop)) {
                    //console.log("prop: " + prop + " checked: " + this.checkBoxElements[prop].checked+ " value: " + this.checkBoxElements[prop].value);
                    if (this.checkBoxElements[prop].checked) {
                        hasSelectedValue = true;
                        selectedValues.push(this.checkBoxElements[prop].value);
                    }
                }
            }
            if (!hasSelectedValue) {
                selectedValues = this.filterValues;
            }
            console.log("selectedValues ",selectedValues);
            this.dimension.filterFunction(function (d) {
                //console.log(d, selectedValues.indexOf(d+""));
                return selectedValues.indexOf(d + "") > -1;
            });
            this.chartsController.reRenderAllChartsPortions();
        }
    }
}