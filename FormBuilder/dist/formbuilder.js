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
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.Add = function (element) {
        this._formElements.push(element);
    };
    return Repository;
}());
var AbstractFormElement = (function () {
    function AbstractFormElement(data) {
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }
    return AbstractFormElement;
}());
var FormBuilder = (function () {
    function FormBuilder(ui, logger, formElements) {
        this._repository = new Repository();
        if (logger === undefined || logger == null) {
            logger = new NullLogger();
        }
        this._logger = logger;
        this._ui = ui;
        this._logger.Log('FormBuilder - Constructing');
        if (formElements !== undefined && formElements.length > 0) {
            this._repository.formElements = formElements;
        }
        this._logger.Log('FormBuilder - Constructed');
    }
    FormBuilder.prototype.Import = function (elements) {
        this._logger.Log('FormBuilder - Importing');
        this._repository.formElements = (new Importer()).Import(elements);
        this._logger.Log('FormBuilder - Imported');
    };
    FormBuilder.prototype.Export = function () {
        this._logger.Log('FormBuilder - Exporting');
        var result = (new Exporter()).Export(this._repository.formElements);
        this._logger.Log('FormBuilder - Exported');
        return result;
    };
    return FormBuilder;
}());
var ConsoleLogger = (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.Log = function (message) {
        console.log(message);
    };
    return ConsoleLogger;
}());
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
var Importer = (function () {
    function Importer() {
    }
    Importer.prototype.Import = function (elements) {
        var result = new Array();
        return result;
    };
    return Importer;
}());
var NullLogger = (function () {
    function NullLogger() {
    }
    NullLogger.prototype.Log = function (message) { };
    return NullLogger;
}());
var UI = (function () {
    function UI(container) {
        this._container = container;
    }
    return UI;
}());
//# sourceMappingURL=formbuilder.js.map