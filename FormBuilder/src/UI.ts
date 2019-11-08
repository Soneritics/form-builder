class UI {
    private _container: HTMLElement;
    Events = new EventHandler();
    private _bindingId = 0;

    constructor(container: HTMLElement) {
        this._container = container;
    }

    Clear(): void {
        $(this._container).html("");
    }

    Build(repository: Repository): void {
        this.Clear();
        for (let i in repository.formElements) {
            this.AddElement(repository.formElements[i], Number(i));
        }

        $(this._container).sortable({
            axis: "y",
            forcePlaceholderSize: true,
            stop: () => this.Events.Trigger("orderchange")
        });
    }

    GetElementOrder(): Number[] {
        var result: Number[] = [];

        $(this._container).find(".draggable").each(function() {
            result.push(Number($(this).data("index")));
        });

        return result;
    }

    private AddElement(element: AbstractFormElement, repositoryIndex: number): void {
        var row = $(`<div class="row draggable" data-index="${repositoryIndex}"><div class="container"><div class="row wysiwyg"></div><div class="row options"></div></div></div>`);

        if (element.HasLabel) {
            $(row).find(".wysiwyg").html('<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div><div class="col-sm-1 text-right remover"></div>');
            element.SetLabel($(row).find(".label"));
        } else {
            $(row).find(".wysiwyg").html('<div class="col-1 toggler"></div><div class="col value"></div><div class="col-1 text-right remover"></div>');
        }

        $(row).find(".value").append(element.CreateAndBindDisplayValue());
        $(row).find(".toggler")
            .html('<a href="javascript:;"><span><i class="fa fa-arrow-circle-down"></i></span><span><i class="fa fa-arrow-circle-up"></i></a></span>')
            .find("a").on("click",
                function() {
                    var element = $(this);
                    do {
                        element = $(element).parent();
                    } while (!$(element).hasClass("wysiwyg"));

                    element.next(".options").slideToggle(500);

                    $(row).find(".toggler > a > span").each(function() {
                        if ($(this).is(":visible")) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        }
                    });
                });

        var self = this;
        $(row).find(".remover")
            .html('<a href="javascript:;"><i class="fa fa-trash"></i></a>')
            .find("a").on("click", function() {
                self.Events.Trigger('InitializeDeletion', {repositoryIndex: repositoryIndex});
            });

        $(row).find(".toggler > a > span:last-child").hide();

        var optionsForm = this.GetOptionsForm(element);
        if (optionsForm !== null) {
            $(row).find(".options").append(optionsForm).slideUp(0);
        } else {
            $(row).find(".options").remove();
            $(row).find(".toggler > a > span").hide();
        }

        $(this._container).append(row);
        this.Events.Trigger("ElementAdded", element);
    }

    private GetOptionsForm(element: AbstractFormElement) {
        const properties = element.GetDefaultProperties().concat(element.Properties);

        if (properties.length === 0) {
            return null;
        }

        const values = element.Serialize();
        var result = $('<div class="container"></div>');

        for (let property of properties) {
            const item = $(`<div class="row"><div class="col-4">${property.Label}</div><div class="col formbuilder-optioncontent"></div></div>`);
            var component = null;

            switch (property.Component) {
                case "text":
                    component = $(`<input class="form-control component" type="text" id="formbuilder-binding-${++this._bindingId}">`);
                    break;

                case "textarea":
                    component = $(`<textarea class="form-control component" id="formbuilder-binding-${++this._bindingId}"></textarea>`);
                    break;

                case "items":
                    const placeholder = "Eén keuze per regel.\nIndien een score, gebruik dan het pipe-symbool om score en weergavetekst te scheiden.\n\nBijvoorbeeld:\n\n0|Nee\n5|Soms\n10|Ja";
                    component = $(`<textarea class="form-control component" id="formbuilder-binding-${++this._bindingId}" placeholder="${placeholder}" style="height:160px;"></textarea>`);
                    break;

                case "select":
                    component = $(`<select class="form-control component" id="formbuilder-binding-${++this._bindingId}"></select>`);

                    for (let i in property.Items) {
                        if (property.Items.hasOwnProperty(i)) {
                            const option = $("<option></option>");
                            option.text(property.Items[i]);
                            option.attr("value", i);
                            $(component).append(option);
                        }
                    }

                    break;
            }

            if (values[property.Id] !== undefined && values[property.Id] != null) {
                $(component).val(values[property.Id]);
            }

            $(component).data("property-id", property.Id);

            $(item).find(".formbuilder-optioncontent").append(component);
            $(component).on("keyup change",
                () => {
                    $(result).find(".component").each(function() {
                        element.ProcessValue($(this).data("property-id"), $(this).val());
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