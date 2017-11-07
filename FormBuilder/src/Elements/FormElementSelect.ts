class FormElementSelect extends AbstractFormElement
{
    public Type: string = 'FormElementSelect';
    public Name: string;
    public HasLabel: boolean = true;
    public Properties: ElementProperties[] = [
        new ElementProperties('Value', 'Items', 'items')
    ];
    public Value: string = "id|value";

    public CreateAndBindDisplayValue()
    {
        var element = $('<select></select>');
        for (var item of (new ItemSerializer).Serialize(this.Value)) {
            element.append($('<option></option>').val(item.Id).text(item.Value));
        }

        this._binding.css('white-space', 'pre');
        this._binding.html('').append(element);
        return this._binding;
    }

    public New(): AbstractFormElement
    {
        return new FormElementSelect();
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