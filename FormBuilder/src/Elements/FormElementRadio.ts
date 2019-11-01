class FormElementRadio extends AbstractFormElement {
    Type = "FormElementRadio";
    Properties: ElementProperties[] = [
        new ElementProperties("Value", "Items", "items")
    ];
    Value = "id|value";

    CreateAndBindDisplayValue() {
        this._binding.html("");

        let index = 0;
        const rnd = Math.random();
        for (let item of (new ItemSerializer).Serialize(this.Value)) {
            this._binding.append($(`<input type="radio" name="radio-${rnd}" id="radio-${index}-${rnd}">`));
            this._binding.append($(`<label for="radio-${index++}-${rnd}"></label>`).text(item.Value));
            this._binding.append($("<br>"));
        }

        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementRadio();
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