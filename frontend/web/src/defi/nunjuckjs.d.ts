declare module NunjuckJS {
    interface Nunjucks {
        render(template: any, modelData: any): any;
    }
}

declare var nunjucks : NunjuckJS.Nunjucks;