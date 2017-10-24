class EventHandler
{
    private _eventListeners: { [id: string]: Array<((data?: any) => void)> } = {};

    public On(event: string, handler: (data?: any) => void): void
    {
        this.Off(event, handler);

        if (this._eventListeners[event] === undefined || this._eventListeners[event] == null) {
            this._eventListeners[event] = [];
        }

        this._eventListeners[event].push(handler);
    }

    public Off(event: string, handler: (data?: any) => void): void
    {
        if (this._eventListeners[event] != undefined && this._eventListeners[event] != null) {
            this._eventListeners[event] = this._eventListeners[event].filter(e => e !== handler);
        }
    }

    public Trigger(event: string, data?: any): void
    {
        if (this._eventListeners[event] !== undefined || this._eventListeners[event] != null && this._eventListeners[event].length > 0) {
            for (var handler of this._eventListeners[event]) {
                handler(data);
            }
        }
    }
}