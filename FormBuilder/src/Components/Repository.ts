class Repository
{
    private _formElements: AbstractFormElement[] = new Array<AbstractFormElement>();
    public Events: EventHandler = new EventHandler();

    get formElements(): AbstractFormElement[]
    {
        return this._formElements;
    }

    set formElements(elements: AbstractFormElement[])
    {
        this._formElements = elements;
        this.Events.Trigger('change');
    }

    public Add(element: AbstractFormElement): void
    {
        this._formElements.push(element);
        this.Events.Trigger('change');
    }
}
