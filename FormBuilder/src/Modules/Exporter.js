var Exporter = (function () {
    function Exporter() {
    }
    Exporter.prototype.Export = function (elements) {
        return JSON.parse(JSON.stringify(elements, this.escapeJSON));
    };
    Exporter.prototype.GetSerializedItems = function (elements) {
        var result = [];
        for (var i in elements) {
            result.push(elements[i].Serialize());
        }
        return result;
    };
    Exporter.prototype.escapeJSON = function (key, val) {
        if (typeof (val) != "string") {
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
    ;
    return Exporter;
}());
//# sourceMappingURL=Exporter.js.map