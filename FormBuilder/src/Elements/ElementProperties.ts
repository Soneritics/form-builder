class ElementProperties {
    Id: string;
    Label: string;
    Component: string;
    Items: { [id: string]: string } = {};

    constructor(id: string, label: string, component: string, items?: { [id: string]: string }) {
        this.Id = id;
        this.Label = label;
        this.Component = component;

        if (items !== undefined && items != null) {
            this.Items = items;
        }
    }
}