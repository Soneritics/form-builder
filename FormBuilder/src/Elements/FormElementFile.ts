class FormElementFile extends AbstractFormElement
{
    public Type: string = 'FormElementFile';
    protected IsScoreElement: boolean = false;
    public Properties: ElementProperties[] = [
        new ElementProperties('AllowedExtensions', 'Allowed file types', 'text')
    ];
    public AllowedExtensions: string = "jpg,jpeg,png";

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
            Label: this.Label,
            AllowedExtensions: this.AllowedExtensions
        };
    }

    public Deserialize(data: { [id: string]: string }): void
    {
        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }

        if (data['AllowedExtensions'] !== undefined) {
            this.AllowedExtensions = data['AllowedExtensions'];
        }

        if (data['Mandatory'] !== undefined) {
            this.Mandatory = data['Mandatory'];
        }
    }

}