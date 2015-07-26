module chart {
    export class UIRequest {
        public static CLIENT_READY: string = "clientReady";
        constructor(private requestId: string, private actionToDo: string) { }
    }
}