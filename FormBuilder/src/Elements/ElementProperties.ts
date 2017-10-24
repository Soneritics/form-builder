class ElementProperties
{
    public Label: string;
    public Component: string;
    public Items: { [id: string]: string } = {};

    constructor(label: string, component: string, items?: { [id: string]: string })
    {
        this.Label = label;
        this.Component = component;

        if (items !== undefined && items != null) {
            this.Items = items;
        }
    }
}