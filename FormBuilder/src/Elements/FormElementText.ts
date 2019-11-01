class FormElementText extends AbstractFormElement
{
    public Type: string = 'FormElementText';
    public HasLabel: boolean = false;
    protected IsScoreElement: boolean = false;
    public Properties: ElementProperties[] = [
        new ElementProperties('Value', 'Text', 'textarea')
    ];
    public Value: string = "Place text here";

    public CreateAndBindDisplayValue()
    {
        this._binding.css('white-space', 'pre');
        this._binding.text(this.Value);
        return this._binding;
    }

    public New(): AbstractFormElement
    {
        return new FormElementText();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Value: this.Value
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Value'] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data['Value']);
        }

        if (data['Mandatory'] !== undefined) {
            this.Mandatory = data['Mandatory'];
        }
    }
}