class FormElementHtml extends AbstractFormElement {
    Type = "FormElementHtml";
    HasLabel = false;
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [
        new ElementProperties("Value", "Tekst", "textarea")
    ];
    Value = "Tekst";

    CreateAndBindDisplayValue() {
        this._binding.html(this.Value);
        this._binding.addClass('FormElementHtml');
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementHtml(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Value: this.Value
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }
    }
}