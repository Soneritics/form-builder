﻿class FormElementTextInput extends AbstractFormElement
{
    public Type: string = 'FormElementTextInput';
    public Name: string;
    public Properties: ElementProperties[] = [
        new ElementProperties('Placeholder', 'Placeholder', 'text')
    ];
    public Placeholder: string = "";

    public CreateAndBindDisplayValue()
    {
        this._binding.html('<input type="text">');
        this._binding.find('input').attr('placeholder', this.Placeholder);
        return this._binding;
    }

    public New(): AbstractFormElement {
        return new FormElementTextInput();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            Placeholder: this.Placeholder
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

        if (data['Placeholder'] !== undefined) {
            this.Placeholder = data['Placeholder'];
        }
    }

}