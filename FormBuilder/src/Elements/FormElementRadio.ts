class FormElementRadio extends AbstractFormElement
{
    public Type: string = 'FormElementRadio';
    public Name: string;
    public HasLabel: boolean = false;
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
        return new FormElementRadio();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            Value: this.Value
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Name'] !== undefined) {
            this.Name = data['Name'];
        }

        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }

        if (data['Value'] !== undefined) {
            this.Value = data['Value'];
        }
    }

}