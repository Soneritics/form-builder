var Repository = (function () {
    function Repository() {
        this._formElements = new Array();
    }
    Object.defineProperty(Repository.prototype, "formElements", {
        get: function () {
            return this._formElements;
        },
        set: function (elements) {
            this._formElements = elements;
            // todo: handlers?
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.Add = function (element) {
        this._formElements.push(element);
        // todo: handlers?
    };
    return Repository;
}());
//# sourceMappingURL=Repository.js.map