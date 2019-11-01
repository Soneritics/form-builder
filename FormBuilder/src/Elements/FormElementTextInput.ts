class FormElementTextInput extends AbstractFormElement {
    Type = "FormElementTextInput";
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [
        new ElementProperties("Placeholder", "Placeholder", "text")
    ];
    Placeholder = "";

    CreateAndBindDisplayValue() {
        this._binding.html('<input type="text">');
        this._binding.find("input").attr("placeholder", this.Placeholder);
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementTextInput();
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Label: this.Label,
            Mandatory: this.Mandatory,
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