class FormBuilder
{
    private _ui: UI;
    private _repository: Repository = new Repository();
    private _logger: ILogger;

    constructor(ui: UI, logger?: ILogger, formElements?: AbstractFormElement[])
    {
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

    public Add(element: AbstractFormElement): void
    {
        this._logger.Log('FormBuilder - Adding element:');
        this._logger.Log(element);
        this._repository.Add(element);
        this._logger.Log('FormBuilder - Element added');
    }

    public Import(elements: any[]): void
    {
        this._logger.Log('FormBuilder - Importing');
        this._repository.formElements = (new Importer()).Import(elements);
        this._logger.Log('FormBuilder - Imported');
    }

    public Export(): string
    {
        this._logger.Log('FormBuilder - Exporting');
        var result = (new Exporter()).Export(this._repository.formElements);
        this._logger.Log('FormBuilder - Exported');
        return result;
    }
}