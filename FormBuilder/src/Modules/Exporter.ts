class Exporter {
    Export(elements: ISerializable[]): string {
        return JSON.stringify(this.GetSerializedItems(elements), this.escapeJSON);
    }

    private GetSerializedItems(elements: ISerializable[]): Array<{ [id: string]: string }> {
        const result = [];

        for (let element of elements) {
            result.push(element.Serialize());
        }

        return result;
    }

    private escapeJSON(key: string, val: string): string {
        if (typeof(val) != "string") {
            return val;
        }

        return val
            .replace(/[\\]/g, "\\\\")
            .replace(/[\b]/g, "\\b")
            .replace(/[\f]/g, "\\f")
            .replace(/[\n]/g, "\\n")
            .replace(/[\r]/g, "\\r")
            .replace(/[\t]/g, "\\t")
            .replace(/[\"]/g, '\\"')
            .replace(/\\'/g, "\\'");
    };
}