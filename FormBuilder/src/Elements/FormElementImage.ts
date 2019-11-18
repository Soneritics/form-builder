class FormElementImage extends AbstractFormElement {
    Type = "FormElementImage";
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [];

    CreateAndBindDisplayValue() {
        this._binding.html('<input type="file">');
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementImage(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Label: this.Label,
            Mandatory: this.Mandatory
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }

}