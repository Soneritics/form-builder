abstract class AbstractFormElement implements ISerializable
{
    abstract Serialize(): any;
    abstract Deserialize(data: { [id: string]: string }): void;

    public abstract Type: string;

    public Properties: ElementProperties[];
    public Score: string;
    public Label: string = 'Label';
    public HasLabel: boolean = true;
    protected IsScoreElement: boolean = true;
    protected _binding = $('<span></span>');
    private _label;

    abstract CreateAndBindDisplayValue();
    abstract New(): AbstractFormElement;

    constructor(data?: { [id: string]: string })
    {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }

    public ProcessValue(id: string, value: any): void
    {
        this[id] = value;
        this.CreateAndBindDisplayValue();
    }

    public SetLabel(label)
    {
        this._label = label;
        this.UpdateLabel();
    }

    public UpdateLabel()
    {
        $(this._label).text(this.Label);
    }

    public GetDefaultProperties(): ElementProperties[]
    {
        var result: ElementProperties[] = [];

        if (this.IsScoreElement) {
            result.push(new ElementProperties('Score', 'Scorecategorie', 'select', { een: "een", twee: "twee" }));
        }

        if (this.HasLabel) {
            result.push(new ElementProperties('Label', 'Label', 'text'));
        }

        return result;
    }
}