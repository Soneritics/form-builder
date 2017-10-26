class FormElementPageEnd extends AbstractFormElement
{
    public Type: string = 'FormElementPageEnd';
    public Name: string;
    public HasLabel: boolean = false;
    public Properties: ElementProperties[] = [];

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
            Type: this.Type,
            Name: this.Name
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Name'] !== undefined) {
            this.Name = data['Name'];
        }
    }

}