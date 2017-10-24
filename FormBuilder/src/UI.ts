class UI
{
    private _container: HTMLElement;
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
        for (var element of repository.formElements) {
            this.AddElement(element);
        }
    }

    private AddElement(element: AbstractFormElement): void
    {
        var row = $('<div class="row draggable"><div class="container"><div class="row wysiwyg"></div><div class="row options"></div></div></div>');

        if (element.HasLabel) {
            $(row).find('.wysiwyg').html('<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div>');
            $(row).find('.label').text(element.Label);
        } else {
            $(row).find('.wysiwyg').html('<div class="col-1 toggler"></div><div class="col value"></div>');
        }

        $(row).find('.value').html(element.getValueHtml());
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
                    var component = $('<input class="form-control" type="text" id="formbuilder-binding-' + ++this._bindingId + '">');
                    break;

                case 'textarea':
                    var component = $('<textarea class="form-control" id="formbuilder-binding-' + ++this._bindingId + '"></textarea>');
                    break;
            }

            if (values[property.Id] !== undefined && values[property.Id] != null) {
                $(component).val(values[property.Id]);
            }

            $(item).find('.formbuilder-optioncontent').append(component);
            $(item).find('.formbuilder-optioncontent').on('keyup', function () {
                element.ProcessValue(property.Id, $(component).val());
            });
            $(result).append(item);
        }

        return result;
    }
}