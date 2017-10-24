class FormElementText extends AbstractFormElement
{
    public Type: string = 'FormElementText';
    public Name: string;
    public HasLabel: boolean = false;
    public Properties: ElementProperties[] = [
        new ElementProperties('Value', 'Text', 'textarea')
    ];
    public Value: string = "Place text here";

    public getValueHtml(): string
    {
        return $('<span></span>').text(this.Value).html();
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
    }

}