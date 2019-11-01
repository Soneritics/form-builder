class EventHandler {
    private _eventListeners: { [id: string]: Array<((data?: any) => void)> } = {};

    On(event: string, handler: (data?: any) => void): void {
        this.Off(event, handler);

        if (this._eventListeners[event] === undefined || this._eventListeners[event] == null) {
            this._eventListeners[event] = [];
        }

        this._eventListeners[event].push(handler);
    }

    Off(event: string, handler: (data?: any) => void): void {
        if (this._eventListeners[event] != undefined && this._eventListeners[event] != null) {
            this._eventListeners[event] = this._eventListeners[event].filter(e => e !== handler);
        }
    }

    Trigger(event: string, data?: any): void {
        if (this._eventListeners[event] !== undefined ||
            this._eventListeners[event] != null && this._eventListeners[event].length > 0) {
            for (let handler of this._eventListeners[event]) {
                handler(data);
            }
        }
    }
}