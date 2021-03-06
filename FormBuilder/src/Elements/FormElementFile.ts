﻿class FormElementFile extends AbstractFormElement
{
    public Type: string = 'FormElementFile';
    public Name: string;
    public Properties: ElementProperties[] = [
        new ElementProperties('AllowedExtensions', 'Allowed file types', 'text')
    ];
    public AllowedExtensions: string = "doc,docx,pdf";

    public CreateAndBindDisplayValue()
    {
        this._binding.html('<input type="file">');
        return this._binding;
    }

    public New(): AbstractFormElement
    {
        return new FormElementFile();
    }

    public Serialize(): { [id: string]: string }
    {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            AllowedExtensions: this.AllowedExtensions
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

        if (data['AllowedExtensions'] !== undefined) {
            this.AllowedExtensions = data['AllowedExtensions'];
        }
    }

}