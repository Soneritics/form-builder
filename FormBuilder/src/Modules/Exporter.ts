class Exporter
{
    Export(elements: ISerializable[]): string
    {
        return JSON.parse(JSON.stringify(elements, this.escapeJSON));
    }

    private GetSerializedItems(elements: ISerializable[]): any {
        var result = [];

        for (var i in elements) {
            result.push(elements[i].Serialize());
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