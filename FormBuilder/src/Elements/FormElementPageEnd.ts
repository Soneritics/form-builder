class FormElementPageEnd extends AbstractFormElement
{
    public Type: string = 'FormElementPageEnd';
    public HasLabel: boolean = false;
    public Properties: ElementProperties[] = [];
    protected IsScoreElement: boolean = false;

    public CreateAndBindDisplayValue()
    {
        this._binding.html('<hr>');
        return this._binding;
    }

    public New(): AbstractFormElement
    {
        return new FormElementPageEnd();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
    }
}