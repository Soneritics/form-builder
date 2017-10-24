class Importer
{
    public AvailableElements: AbstractFormElement[] = [];

    constructor(availableElements: AbstractFormElement[])
    {
        this.AvailableElements = availableElements;
    }

    public Import(elements: Array<{ [id: string]: string }>): AbstractFormElement[]
    {
        var result: AbstractFormElement[] = new Array<AbstractFormElement>();

        for (var element of elements) {
            var abstractFormElement = this.GetAvailableElement(element.Type);
            abstractFormElement.Deserialize(element);
            result.push(abstractFormElement);
        }

        return result;
    }

    private GetAvailableElement(type: string): AbstractFormElement
    {
        for (var element of this.AvailableElements) {
            if (element.Type === type) {
                return element;
            }
        }

        return null;
    }
}