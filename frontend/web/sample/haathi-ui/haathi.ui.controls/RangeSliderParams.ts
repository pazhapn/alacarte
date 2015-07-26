module haathi {
    export module ui {
        export module controls {
            export class RangeSliderParams {

                private sliderScaleDiv: string;

                constructor(private sliderDiv: string, private minLimit: number,
                    private maxLimit: number, private minMaxGap: number,
                    private step: number) {
                    if (step > minMaxGap) {
                        throw "minMaxGap should be >= step";
                    }
                    this.sliderScaleDiv = this.sliderDiv+"-scale";
                }

                public getSliderDiv(): string {
                    return this.sliderDiv;
                }

                public getSliderScaleDiv(): string {
                    return this.sliderScaleDiv;
                }

                public getMinLimit(): number {
                    return this.minLimit;
                }

                public getMaxLimit(): number {
                    return this.maxLimit;
                }

                public getMinMaxGap(): number {
                    return this.minMaxGap;
                }

                public getStep(): number {
                    return this.step;
                }
            }
        }
    }
}