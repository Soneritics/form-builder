class FormElementCheckbox extends AbstractFormElement
{
    public Type: string = 'FormElementCheckbox';
    public Name: string;
    public HasLabel: boolean = false;
    public Properties: ElementProperties[] = [
        new ElementProperties('Options', 'Items', 'items')
    ];

    public CreateAndBindDisplayValue()
    {
        this._binding.text('checkboxes');
        return this._binding;
    }

    public New(): AbstractFormElement
    {
        return new FormElementCheckbox();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label
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
    }
}