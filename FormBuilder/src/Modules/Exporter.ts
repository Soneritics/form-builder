class Exporter
{
    public Export(elements: ISerializable[]): string
    {
        console.log(this.GetSerializedItems(elements));
        return JSON.stringify(this.GetSerializedItems(elements), this.escapeJSON);
    }

    private GetSerializedItems(elements: ISerializable[]): Array<{ [id: string]: string }> {
        var result = [];

        for (var element of elements) {
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