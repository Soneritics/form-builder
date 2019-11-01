class FormElementSelect extends AbstractFormElement {
    Type = "FormElementSelect";
    HasLabel = true;
    Properties: ElementProperties[] = [
        new ElementProperties("Value", "Items", "items")
    ];
    Value = "id|value";

    CreateAndBindDisplayValue() {
        const element = $("<select></select>");
        for (let item of (new ItemSerializer).Serialize(this.Value)) {
            element.append($("<option></option>").val(item.Id).text(item.Value));
        }

        this._binding.css("white-space", "pre");
        this._binding.html("").append(element);
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementSelect();
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Score: this.Score,
            Label: this.Label,
            Value: this.Value
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }

        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    }
}