class FormElementTextArea extends AbstractFormElement
{
    public Type: string = 'FormElementTextInput';
    protected IsScoreElement: boolean = false;
    public Properties: ElementProperties[] = [
        new ElementProperties('Placeholder', 'Placeholder', 'text')
    ];
    public Placeholder: string = "";

    public CreateAndBindDisplayValue()
    {
        this._binding.html('<textarea></textarea>');
        this._binding.find('textarea').attr('placeholder', this.Placeholder);
        return this._binding;
    }

    public New(): AbstractFormElement {
        return new FormElementTextArea();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Placeholder: this.Placeholder
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }

        if (data['Placeholder'] !== undefined) {
            this.Placeholder = data['Placeholder'];
        }

        if (data['Mandatory'] !== undefined) {
            this.Mandatory = data['Mandatory'];
        }
    }
}