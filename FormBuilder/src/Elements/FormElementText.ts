class FormElementText extends AbstractFormElement {
    Type = "FormElementText";
    HasLabel = false;
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [
        new ElementProperties("Value", "Text", "textarea")
    ];
    Value = "Tekst";

    CreateAndBindDisplayValue() {
        this._binding.css("white-space", "pre");
        this._binding.text(this.Value);
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementText(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Value: this.Value
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }
}