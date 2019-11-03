class FormElementCheckbox extends AbstractFormElement {
    Type = "FormElementCheckbox";
    Properties: ElementProperties[] = [
        new ElementProperties("Value", "Items", "items")
    ];
    Value = "";

    CreateAndBindDisplayValue() {
        this._binding.html("");

        let index = 0;
        const rnd = Math.random();
        for (let item of (new ItemSerializer).Serialize(this.Value)) {
            this._binding.append($(`<input type="checkbox" name="checkbox-${rnd}" id="checkbox-${index}-${rnd}">`));
            this._binding.append($(`<label for="checkbox-${index++}-${rnd}"></label>`).text(item.Value));
            this._binding.append($("<br>"));
        }

        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementCheckbox(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Score: this.Score,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Value: this.Value
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }

        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }

        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }
}