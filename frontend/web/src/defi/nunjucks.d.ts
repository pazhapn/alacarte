declare module NunjucksModule {
    interface Nunjucks {
        render(template: any, modelData: any): any;
    }
}

declare var nunjucks : NunjucksModule.Nunjucks;