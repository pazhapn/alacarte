/// <reference path="../../../../definitions/jquery/jquery.d.ts" />
/// <reference path="../../../../definitions/jqueryui/jqueryui.d.ts" />
/// <reference path="RangeSliderParams.ts" />

module haathi {
    export module ui {
        export module controls {
            export class RangeSliderUI {

                private sliderHolder: JQuery;
                private slideHandles: Element[];
                private sliderDiv: HTMLElement;
                private sliderScale: HTMLElement;

                constructor(private sliderParams: RangeSliderParams, private sliderController: RangeSliderController) {
                    this.sliderHolder = $("#"+this.sliderParams.getSliderDiv());
                    this.sliderDiv = document.getElementById(this.sliderParams.getSliderDiv());
                    this.sliderScale = document.getElementById(this.sliderParams.getSliderScaleDiv());
                    this.slideHandles = [];
                    this.sliderHolder
                        .on("mousedown touchstart", (event) => this.sliderMouseDown(event))
                        .slider({
                            range: true,
                            animate: true,
                            min: 0,
                            max: this.sliderParams.getMaxLimit(),
                            step: this.sliderParams.getStep(),
                            values: [this.sliderParams.getMinLimit(), this.sliderParams.getMaxLimit()],
                            slide: (event, ui) => sliderController.slideLimitMinMax(event, ui),
                            create: (event, ui) => this.initializeHandles()
                        });
                }

                private sliderMouseDown(event: any): void {
                    if (event.target.tagName !== this.getSlideHandle(0).tagName) {            
                        //event.stopImmediatePropagation();
                    }
                }

                public notifyHandleChange(handleIndex: number, displayValue: number): void {
                    this.updateHandleDisplay(handleIndex, displayValue);
                }

                public decrementHandleAndUpdateDisplay(handleIndex: number, displayValue: number): void {
                    this.updateHandleDisplay(handleIndex-1, displayValue-this.sliderParams.getMinMaxGap());
                }

                public incrementHandleAndUpdateDisplay(handleIndex: number, displayValue: number): void {
                    console.log("incrementHandleAndUpdateDisplay ", handleIndex+1, displayValue+1);
                    this.updateHandleDisplay(handleIndex + 1, displayValue + this.sliderParams.getMinMaxGap());
                }

                private updateHandleDisplay(handleIndex: number, displayValue: number): void {
                    this.sliderHolder.slider("values", handleIndex +"", displayValue);
                }

                private getSlideHandle(handleIndex: number): Element {
                    return this.slideHandles[handleIndex];
                }

                private initializeHandles(): void {
                    this.slideHandles[0] = this.sliderDiv.querySelector("a:nth-of-type(1)");
                    this.slideHandles[1] = this.sliderDiv.querySelector("a:nth-of-type(2)");
                    this.slideHandles[0].setAttribute("id", "h0-"+this.sliderParams.getSliderDiv());
                    this.slideHandles[1].setAttribute("id", "h1-"+this.sliderParams.getSliderDiv());
                    this.slideHandles[0].setAttribute("class", this.slideHandles[0].getAttribute("class") +
                        " " + this.sliderParams.getSliderDiv() + "-handle ");
                    this.slideHandles[1].setAttribute("class", this.slideHandles[1].getAttribute("class") +
                        " " + this.sliderParams.getSliderDiv() + "-handle ");
                    this.drawScaleLabels();
                }

                private drawScaleLabels(): void {
                    var scaleFragment: DocumentFragment = document.createDocumentFragment();
                    var scaleElement: HTMLElement;
                    var span: HTMLElement
                    for (var i = this.sliderParams.getMinLimit(); i <= this.sliderParams.getMaxLimit(); i++) {
                        span = document.createElement("span");
                        span.innerHTML = i.toString();
                        scaleElement = document.createElement("div");
                        scaleElement.setAttribute("class", this.sliderParams.getSliderDiv() +"-label-ticks");
                        scaleElement.style.left = (Math.round(i / this.sliderParams.getMaxLimit() * 10000) / 100) + "%";
                        scaleElement.appendChild(span);
                        scaleFragment.appendChild(scaleElement);
                    }
                    this.sliderScale.appendChild(scaleFragment);
                }
            }
        }
    }
}