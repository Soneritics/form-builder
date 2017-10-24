class Repository
{
    private _formElements: AbstractFormElement[] = new Array<AbstractFormElement>();

    get formElements(): AbstractFormElement[]
    {
        return this._formElements;
    }

    set formElements(elements: AbstractFormElement[])
    {
        this._formElements = elements;
        // todo: handlers?
    }

    public Add(element: AbstractFormElement): void
    {
        this._formElements.push(element);
        // todo: handlers?
    }
}
