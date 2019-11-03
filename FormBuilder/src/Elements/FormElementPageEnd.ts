class FormElementPageEnd extends AbstractFormElement {
    Type = "FormElementPageEnd";
    HasLabel = false;
    Properties: ElementProperties[] = [];
    protected IsScoreElement = false;

    CreateAndBindDisplayValue() {
        this._binding.html("<hr>");
        return this._binding;
    }

    New(): AbstractFormElement {
        return new FormElementPageEnd(this.Scores);
    }

    Serialize(): { [id: string]: string } {
        return {
            Type: this.Type
        };
    }

    Deserialize(data: { [id: string]: string }): void {
    }
}