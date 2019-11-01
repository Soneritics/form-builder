class FormElementScore extends AbstractFormElement {
    Type = "FormElementScore";
    protected IsScoreElement = false;
    Properties: ElementProperties[] = [];
    Min = "10";
    Max = "100";
    Step = "10";

    constructor(data?: { [id: string]: string }) {
        super(data);

        this.Properties.push(new ElementProperties("Min", "Minimumscore", "select", this.GetMinItems()));
        this.Properties.push(new ElementProperties("Max", "Maximumscore", "select", this.GetMaxItems()));
        this.Properties.push(new ElementProperties("Step", "Stapgrootte", "select", this.GetStepItems()));
    }

    CreateAndBindDisplayValue() {
        const element = $("<select></select>");
        for (let i = +this.Max; i >= +this.Min; i -= +this.Step) {
            const v = +this.Step < 1 ? (Math.round(i * 10) / 10) : i;
            element.append($("<option></option>").val(v).text(v));
        }

        this._binding.html("").append(element);
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementScore();
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Score: this.Score,
            Min: this.Min,
            Max: this.Max,
            Step: this.Step
        };
    }

    Deserialize(data: { [id: string]: string }): void {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }

        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }

        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }

        if (data["Min"] !== undefined) {
            this.Min = data["Min"];
        }

        if (data["Max"] !== undefined) {
            this.Max = data["Max"];
        }

        if (data["Step"] !== undefined) {
            this.Step = data["Step"];
        }
    }

    private GetMinItems(): { [id: string]: string } {
        return {
            "0": "0",
            "1": "1",
            "5": "5",
            "10": "10"
        };
    }

    private GetMaxItems(): { [id: string]: string } {
        return {
            "1": "1",
            "5": "5",
            "10": "10",
            "100": "100"
        };
    }

    private GetStepItems(): { [id: string]: string } {
        return {
            "0.1": "0.1",
            "0.5": "0.5",
            "1": "1",
            "10": "10"
        };
    }
}