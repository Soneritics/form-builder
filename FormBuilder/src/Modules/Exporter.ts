class Exporter
{
    public Export(elements: ISerializable[], order: Number[]): string
    {
        return JSON.stringify(this.GetSerializedItems(elements, order), this.escapeJSON);
    }

    private GetSerializedItems(elements: ISerializable[], order: Number[]): Array<{ [id: string]: string }> {
        var result = [];

        for (var i of order) {
            var element = elements[i.toString()];
            result.push(element.Serialize());
        }

        return result;
    }

    private escapeJSON(key: string, val: string): string {
        if (typeof(val) != "string") {
            return val;
        }

        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
            .replace(/[\"]/g, '\\"')
            .replace(/\\'/g, "\\'");
    };
}