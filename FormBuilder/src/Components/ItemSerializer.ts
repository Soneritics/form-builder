class ItemSerializer
{
    public Serialize(content: string): Item[]
    {
        var result = new Array<Item>();

        var lines = this.replaceAll(content, "\r", "").split("\n");
        if (lines.length > 0) {
            var emptyIds = 0;
            for (var line of lines) {
                var item = new Item("", "");
                var split = line.split("|");
                if (split.length == 1) {
                    item = new Item((emptyIds++).toString(), split[0]);
                } else if (split.length > 1) {
                    item = new Item(split[0], split[1]);
                }

                result.push(item);
            }
        }

        return result;
    }

    public DeserializeText(content: string): string {
        console.log("original: " + content);
        console.log("replaced: " + this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", ""));
        return this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", "");
    }

    private replaceAll(content: string, find: string, replace: string): string {
        var replacement = content;
        content = "";
        while (replacement !== content) {
            content = replacement;
            replacement = replacement.replace(find, replace);
        }

        return content;
    }
}