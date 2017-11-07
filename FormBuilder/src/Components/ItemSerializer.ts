class ItemSerializer
{
    public Serialize(content: string): Item[]
    {
        var result = new Array<Item>();

        var lines = content.replace("\r", "").split("\n");
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
}