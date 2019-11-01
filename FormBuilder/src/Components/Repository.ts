class Repository {
    private _formElements = new Array<AbstractFormElement>();
    Events = new EventHandler();

    get formElements(): AbstractFormElement[] {
        return this._formElements;
    }

    set formElements(elements: AbstractFormElement[]) {
        this._formElements = elements;
        this.Events.Trigger("change");
    }

    Add(element: AbstractFormElement): void {
        this._formElements.push(element);
        this.Events.Trigger("change");
    }
}