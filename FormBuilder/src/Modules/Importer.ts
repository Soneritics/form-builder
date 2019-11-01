class Importer {
    AvailableElements: AbstractFormElement[] = [];

    constructor(availableElements: AbstractFormElement[]) {
        this.AvailableElements = availableElements;
    }

    Import(elements: Array<{ [id: string]: string }>): AbstractFormElement[] {
        const result = new Array<AbstractFormElement>();

        for (let element of elements) {
            const abstractFormElement = this.GetAvailableElement(element.Type);
            abstractFormElement.Deserialize(element);
            result.push(abstractFormElement);
        }

        return result;
    }

    private GetAvailableElement(type: string): AbstractFormElement {
        for (let element of this.AvailableElements) {
            if (element.Type === type) {
                return element.New();
            }
        }

        return null;
    }
}