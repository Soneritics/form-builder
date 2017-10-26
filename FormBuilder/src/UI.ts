class UI
{
    private _container: HTMLElement;
    public Events: EventHandler = new EventHandler();
    private _bindingId: number = 0;

    constructor(container: HTMLElement)
    {
        this._container = container;
    }

    public Clear(): void
    {
        $(this._container).html('');
    }

    public Build(repository: Repository): void
    {
        this.Clear();
        for (var i in repository.formElements) {
            this.AddElement(repository.formElements[i], Number(i));
        }

        $(this._container).sortable({ stop: () => this.Events.Trigger('orderchange') });
    }

    public GetElementOrder(): Number[]
    {
        var result: Number[] = [];

        $(this._container).find('.draggable').each(function () {
            result.push(Number($(this).data('index')));
        });

        return result;
    }

    private AddElement(element: AbstractFormElement, repositoryIndex: number): void
    {
        var row = $('<div class="row draggable" data-index="' + repositoryIndex + '"><div class="container"><div class="row wysiwyg"></div><div class="row options"></div></div></div>');

        if (element.HasLabel) {
            $(row).find('.wysiwyg').html('<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div>');
            element.SetLabel($(row).find('.label'));
        } else {
            $(row).find('.wysiwyg').html('<div class="col-1 toggler"></div><div class="col value"></div>');
        }

        $(row).find('.value').append(element.CreateAndBindDisplayValue());
        $(row).find('.toggler').html('<a href="javascript:;"><i class="fa fa-arrow-circle-down"></i></a>').find('a').on('click', function () {
            var element = $(this);
            do {
                element = $(element).parent();
            } while (!$(element).hasClass('wysiwyg'));

            element.next('.options').slideToggle(500);
        });

        $(row).find('.options').append(this.GetOptionsForm(element)).slideUp(0);
        $(this._container).append(row);
    }

    private GetOptionsForm(element: AbstractFormElement)
    {
        var properties = element.GetDefaultProperties().concat(element.Properties);

        if (properties.length === 0) {
            return 'There are no properties for this element.';
        }

        var values = element.Serialize();
        var result = $('<div class="container"></div>');

        for (var property of properties) {
            var item = $('<div class="row"><div class="col-4">' + property.Label + '</div><div class="col formbuilder-optioncontent"></div></div>');

            switch (property.Component) {
                case 'text':
                    var component = $('<input class="form-control component" type="text" id="formbuilder-binding-' + ++this._bindingId + '">');
                    break;

                case 'textarea':
                    var component = $('<textarea class="form-control component" id="formbuilder-binding-' + ++this._bindingId + '"></textarea>');
                    break;
            }

            if (values[property.Id] !== undefined && values[property.Id] != null) {
                $(component).val(values[property.Id]);
            }

            $(component).data('property-id', property.Id);

            $(item).find('.formbuilder-optioncontent').append(component);
            $(component).on('keyup', () => {
                $(result).find('.component').each(function () {
                    element.ProcessValue($(this).data('property-id'), $(this).val());
                });

                if (element.HasLabel) {
                    element.UpdateLabel();
                }
            });
            $(result).append(item);
        }

        return result;
    }
}