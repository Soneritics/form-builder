class FormElementRadio extends AbstractFormElement
{
    public Type: string = 'FormElementRadio';
    public Properties: ElementProperties[] = [
        new ElementProperties('Value', 'Items', 'items')
    ];
    public Value: string = "id|value";

    public CreateAndBindDisplayValue()
    {
        this._binding.text('radiobuttons');
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
            Score: this.Score,
            Label: this.Label,
            Value: this.Value
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Score'] !== undefined) {
            this.Score = data['Score'];
        }

        if (data['Value'] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data['Value']);
        }

        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }
    }
}