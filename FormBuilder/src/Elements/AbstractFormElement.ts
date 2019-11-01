abstract class AbstractFormElement implements ISerializable {
    abstract Serialize(): any;

    abstract Deserialize(data: { [id: string]: string }): void;

    abstract Type: string;

    Properties: ElementProperties[];
    Score: string;
    Mandatory = "0";
    Label = "Label";
    HasLabel = true;
    protected IsScoreElement = true;
    protected _binding = $("<span></span>");
    private _label;

    abstract CreateAndBindDisplayValue();

    abstract New(): AbstractFormElement;

    constructor(data?: { [id: string]: string }) {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }

    ProcessValue(id: string, value: any): void {
        this[id] = value;
        this.CreateAndBindDisplayValue();
    }

    SetLabel(label) {
        this._label = label;
        this.UpdateLabel();
    }

    UpdateLabel() {
        $(this._label).text(this.Label);
    }

    GetDefaultProperties(): ElementProperties[] {
        const result: ElementProperties[] = [];

        if (this.IsScoreElement) {
            result.push(new ElementProperties("Score", "Scorecategorie", "select", { een: "een", twee: "twee" }));
        }

        if (this.HasLabel) {
            result.push(new ElementProperties("Label", "Label", "text"));

            if (this.Type !== "FormElementSelect") {
                result.push(new ElementProperties("Mandatory", "Verplicht", "select", { "0": "Nee", "1": "Ja" }));
            }
        }

        return result;
    }
}