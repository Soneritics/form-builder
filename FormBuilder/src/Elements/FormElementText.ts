class FormElementText extends AbstractFormElement
{
    public Type: string = 'text';
    public Name: string;
    public Label: string = 'Label';
    public Properties: ElementProperties[] = [];

    public getValueHtml(): string
    {
        return '<input type="text">';
    }

    public Serialize(): any
    {
        // todo
        return { type: 'text' };
    }

    public Deserialize(data: any): void
    {
        // todo
    }

}