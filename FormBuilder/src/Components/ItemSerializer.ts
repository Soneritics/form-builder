class ItemSerializer {
    Serialize(content: string): Item[] {
        const result = new Array<Item>();

        const lines = this.replaceAll(content, "\r", "").split("\n");
        if (lines.length > 0) {
            let emptyIds = 0;
            for (let line of lines) {
                let item = new Item("", "");
                const split = line.split("|");
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

    DeserializeText(content: string): string {
        console.log(`original: ${content}`);
        console.log(`replaced: ${this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", "")}`);
        return this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", "");
    }

    private replaceAll(content: string, find: string, replace: string): string {
        let replacement = content;
        content = "";
        while (replacement !== content) {
            content = replacement;
            replacement = replacement.replace(find, replace);
        }

        return content;
    }
}