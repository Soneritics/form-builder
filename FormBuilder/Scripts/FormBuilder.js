var FormBuilder = (function () {
    function FormBuilder(ui, formElements) {
        this._repository = new Repository();
        this._ui = ui;
        if (formElements !== undefined && formElements.length > 0) {
            this._repository.formElements = formElements;
        }
    }
    FormBuilder.prototype.Import = function (elements) {
        this._repository.formElements = (new Importer()).Import(elements);
    };
    FormBuilder.prototype.Export = function () {
        return (new Exporter()).Export(this._repository.formElements);
    };
    return FormBuilder;
}());
//# sourceMappingURL=formbuilder.js.map