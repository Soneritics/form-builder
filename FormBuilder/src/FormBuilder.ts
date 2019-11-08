class FormBuilder {
    private _ui: UI;
    private _repository = new Repository();
    private _logger: ILogger;

    constructor(ui: UI, logger?: ILogger, formElements?: AbstractFormElement[]) {
        if (logger === undefined || logger == null) {
            logger = new NullLogger();
        }
        this._logger = logger;
        this._ui = ui;

        this._logger.Log("FormBuilder - Constructing");
        this._repository.Events.On("change", (data?: any) => this.OnRepositoryChange(data));
        this._ui.Events.On("orderchange", () => this.OnOrderChange());
        this._ui.Events.On("InitializeDeletion", (data?: any) => this.DeleteElement(data));

        if (formElements !== undefined && formElements.length > 0) {
            this._logger.Log("FormBuilder - Loading form elements");
            this._repository.formElements = formElements;
        }

        this._logger.Log("FormBuilder - Constructed");
    }

    Add(element: AbstractFormElement): void {
        this._logger.Log("FormBuilder - Adding element:");
        this._logger.Log(element);
        this._repository.Add(element);
        this._logger.Log("FormBuilder - Element added");
    }

    Import(elements: Array<{ [id: string]: string }>, availableElements: AbstractFormElement[]): void {
        this._logger.Log("FormBuilder - Importing");
        this._repository.formElements = (new Importer(availableElements)).Import(elements);
        this._ui.Build(this._repository);
        this._logger.Log("FormBuilder - Imported");
    }

    Export(): string {
        this._logger.Log("FormBuilder - Exporting");
        const result = (new Exporter()).Export(this._repository.formElements);
        this._logger.Log("FormBuilder - Exported");
        return result;
    }

    private OnRepositoryChange(data?: any): void {
        this._logger.Log("FormBuilder - OnRepositoryChange, building UI");
        this._ui.Build(this._repository);
        this._logger.Log(data);
    }

    private DeleteElement(data?: any): void {
        this._logger.Log("FormBuilder - InitializeDeletion");
        this._logger.Log(data);
        this._repository.Remove(data.repositoryIndex);
    }

    private OnOrderChange(): void {
        this._logger.Log("FormBuilder - OnOrderChange");

        const order = this._ui.GetElementOrder();
        const result = [];

        for (let i of order) {
            const element = this._repository.formElements[i.toString()];
            result.push(element);
        }

        this._repository.formElements = result;
    }
}