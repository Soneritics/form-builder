class FormElementFile extends AbstractFormElement {
    Type = "FormElementFile";
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [
        new ElementProperties("AllowedExtensions", "Toegestane bestandstypen", "text")
    ];
    AllowedExtensions = "jpg,jpeg,png";

    CreateAndBindDisplayValue() {
        this._binding.html('<input type="file">');
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementFile();
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Label: this.Label,
            Mandatory: this.Mandatory,
            AllowedExtensions: this.AllowedExtensions
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["AllowedExtensions"] !== undefined) {
            this.AllowedExtensions = data["AllowedExtensions"];
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }

}