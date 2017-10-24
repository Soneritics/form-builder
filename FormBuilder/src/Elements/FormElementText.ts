class FormElementText extends AbstractFormElement
{
    public Type: string = 'text';
    public Name: string;
    public Label: string = 'Testlabel';

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