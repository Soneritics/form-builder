class FormElementTextArea extends AbstractFormElement {
    Type = "FormElementTextArea";
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [
        new ElementProperties("Placeholder", "Placeholder", "text")
    ];
    Placeholder = "";

    CreateAndBindDisplayValue() {
        this._binding.html("<textarea></textarea>");
        this._binding.find("textarea").attr("placeholder", this.Placeholder);
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementTextArea(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Placeholder: this.Placeholder
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["Placeholder"] !== undefined) {
            this.Placeholder = data["Placeholder"];
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }
}