class UI
{
    private _container: HTMLElement;

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

        $(row).find('.options').html(this.GetOptionsForm(element)).slideUp(0);
        $(this._container).append(row);
    }

    private GetOptionsForm(element: AbstractFormElement): string
    {
        var properties = element.GetDefaultProperties().concat(element.Properties);

        if (properties.length === 0) {
            return 'There are no properties for this element.';
        }

        var values = element.Serialize();
        var result = '<div class="container">';
        for (var property of properties) {
            result += '<div class="row"><div class="col-4">' + property.Label + '</div><div class="col">';

            switch (property.Component) {
                case 'text':
                    var component = '<input class="form-control" type="text">';
                    break;

                case 'textarea':
                    var component = '<textarea class="form-control"></textarea>';
                    break;
            }

            if (values[property.Label] !== undefined && values[property.Label] != null) {
                $(component).val(values[property.Label]);
            }

            result += component;
            result += '</div></div>';
        }

        return result + '</div>';
    }
}