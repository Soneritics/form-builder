abstract class AbstractFormElement implements ISerializable
{
    abstract Serialize(): any;
    abstract Deserialize(data: { [id: string]: string }): void;

    abstract Type: string;
    abstract Name: string;
    abstract Properties: ElementProperties[];
    public Label: string = '';
    public HasLabel: boolean = true;

    abstract getValueHtml(): string;

    constructor(data?: { [id: string]: string })
    {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }

    public ProcessValue(id: string, value: any): void
    {
        this[id] = value;
    }

    public GetDefaultProperties(): ElementProperties[]
    {
        var result: ElementProperties[] = [
            new ElementProperties('Name', 'Name', 'text'),
        ];

        if (this.HasLabel) {
            result.push(new ElementProperties('Label', 'Label', 'text'));
        }

        return result;
    }
}