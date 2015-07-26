/// <reference path="../../../src/defi/d3.d.ts" />
/// <reference path="../../../src/defi/crossfilter.d.ts" />

module hotelchart {
    export class FilterCheckBox<T, TDimension, TKey, TValue> {
        private checkBoxElements: any[] = [];
        private checkBoxFunctions = [];
        private displayElements: HTMLElement[] = [];

        constructor(private id: string, private hSlicer: CrossFilter.CrossFilter<T>,
            private dimension: CrossFilter.Dimension<T, TDimension>,
            private group: CrossFilter.Group<T, TKey, TValue>,
            private chartsController: ChartsController<T, TDimension, TKey, TValue>) {}

        //TODO clear listeners
        public shutdown(): void {

        }
        public renderCheckBoxes(): void {
            var key;
            var groupAll = this.group.all();
            for (var i = 0; i < this.group.size(); i++) {
                key = groupAll[i].key;
                //console.log("displayElements ", key);
                if (this.displayElements[key] == null) {
                    this.addListener(key);
                }
                this.displayElements[key].textContent = groupAll[i].value.toString();
                if (parseInt(groupAll[i].value.toString(), 10) > 0) {
                    this.checkBoxElements[key].disabled = false;
                } else {
                    this.checkBoxElements[key].disabled = true;
                }
                //console.log("CheckBoxFilter ", key, groupAll[i]);
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
            for (var prop in this.checkBoxElements) {
                if (this.checkBoxElements.hasOwnProperty(prop)) {
                    //console.log("prop: " + prop + " checked: " + this.checkBoxElements[prop].checked+ " value: " + this.checkBoxElements[prop].value);
                    if (this.checkBoxElements[prop].checked) {
                        selectedValues.push(this.checkBoxElements[prop].value);
                    }
                }
            }
            this.dimension.filterFunction(function (d) {
                //console.log(d, selectedValues.indexOf(d+""));
                return selectedValues.indexOf(d + "") > -1;
            });
            this.chartsController.renderAllCharts();
        }
    }
}