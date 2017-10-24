abstract class AbstractFormElement implements ISerializable
{
    abstract Serialize(): any;
    abstract Deserialize(data: any): void;

    abstract Type: string;
    abstract Name: string;
    abstract Properties: ElementProperties[];
    public Label: string = '';
    public HasLabel: boolean = true;

    abstract getValueHtml(): string;

    constructor(data?: any)
    {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }
}