﻿class UI {
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
        var row = $(`<div class="row draggable" data-index="${repositoryIndex
            }"><div class="container"><div class="row wysiwyg"></div><div class="row options"></div></div></div>`);

        if (element.HasLabel) {
            $(row).find(".wysiwyg")
                .html(
                    '<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div>');
            element.SetLabel($(row).find(".label"));
        } else {
            $(row).find(".wysiwyg").html('<div class="col-1 toggler"></div><div class="col value"></div>');
        }

        $(row).find(".value").append(element.CreateAndBindDisplayValue());
        $(row).find(".toggler")
            .html(
                '<a href="javascript:;"><span><i class="fa fa-arrow-circle-down"></i></span><span><i class="fa fa-arrow-circle-up"></i></a></span>')
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

        $(row).find(".toggler > a > span:last-child").hide();

        $(row).find(".options").append(this.GetOptionsForm(element)).slideUp(0);
        $(this._container).append(row);
    }

    private GetOptionsForm(element: AbstractFormElement) {
        const properties = element.GetDefaultProperties().concat(element.Properties);

        if (properties.length === 0) {
            return $("<em>There are no properties for this element.</em>");
        }

        const values = element.Serialize();
        var result = $('<div class="container"></div>');

        for (let property of properties) {
            const item =
                $(`<div class="row"><div class="col-4">${property.Label
                    }</div><div class="col formbuilder-optioncontent"></div></div>`);

            switch (property.Component) {
            case "text":
                var component =
                    $(`<input class="form-control component" type="text" id="formbuilder-binding-${++this._bindingId
                        }">`);
                break;

            case "textarea":
                var component =
                    $(`<textarea class="form-control component" id="formbuilder-binding-${++this._bindingId
                        }"></textarea>`);
                break;

            case "items":
                const placeholder =
                    "One value per line, the id and text divided by the pipe symbol.\nFor example, in the case of a date field:\n\nmo|Monday\ntu|Tuesday\nwe|Wednesday\netc.";
                var component = $(
                    `<textarea class="form-control component" id="formbuilder-binding-${++this._bindingId
                    }" placeholder="${placeholder
                    }" style="height:160px;"></textarea>`);
                break;

            case "select":
                var component =
                    $(`<select class="form-control component" id="formbuilder-binding-${++this._bindingId}"></select>`);

                for (let i in property.Items) {
                    const option = $("<option></option>");
                    option.text(property.Items[i]);
                    option.attr("value", i);
                    $(component).append(option);
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