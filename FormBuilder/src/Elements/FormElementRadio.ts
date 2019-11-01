class FormElementRadio extends AbstractFormElement
{
    public Type: string = 'FormElementRadio';
    public Properties: ElementProperties[] = [
        new ElementProperties('Value', 'Items', 'items')
    ];
    public Value: string = "id|value";

    public CreateAndBindDisplayValue()
    {
        this._binding.html('')

        var index = 0;
        var rnd = Math.random();
        for (var item of (new ItemSerializer).Serialize(this.Value)) {
            this._binding.append($('<input type="radio" name="radio-' + rnd + '" id="radio-' + index + '-' + rnd + '">'));
            this._binding.append($('<label for="radio-' + (index++) + '-' + rnd + '"></label>').text(item.Value));
            this._binding.append($('<br>'));
        }

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
            Mandatory: this.Mandatory,
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

        if (data['Mandatory'] !== undefined) {
            this.Mandatory = data['Mandatory'];
        }
    }
}