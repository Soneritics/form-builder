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
//# sourceMappingURL=FormBuilder.js.map