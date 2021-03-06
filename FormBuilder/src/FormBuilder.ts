﻿class FormBuilder
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
        this._repository.Events.On('change', (data?: any) => this.OnRepositoryChange(data));
        this._ui.Events.On('orderchange', () => this.OnOrderChange());

        if (formElements !== undefined && formElements.length > 0) {
            this._logger.Log('FormBuilder - Loading form elements');
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

    public Import(elements: Array<{ [id: string]: string }>, availableElements: AbstractFormElement[]): void
    {
        this._logger.Log('FormBuilder - Importing');
        this._repository.formElements = (new Importer(availableElements)).Import(elements);
        this._ui.Build(this._repository);
        this._logger.Log('FormBuilder - Imported');
    }

    public Export(): string
    {
        this._logger.Log('FormBuilder - Exporting');
        var result = (new Exporter()).Export(this._repository.formElements);
        this._logger.Log('FormBuilder - Exported');
        return result;
    }

    private OnRepositoryChange(data?: any): void
    {
        this._logger.Log('FormBuilder - OnRepositoryChange, building UI');
        this._ui.Build(this._repository);
        this._logger.Log(data);
    }

    private OnOrderChange(): void
    {
        this._logger.Log('FormBuilder - OnOrderChange');

        var order: Number[] = this._ui.GetElementOrder();
        var result = [];

        for (var i of order) {
            var element = this._repository.formElements[i.toString()];
            result.push(element);
        }

        this._repository.formElements = result;
    }
}
