var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FormBuilder = (function () {
    function FormBuilder(ui, logger, formElements) {
        var _this = this;
        this._repository = new Repository();
        if (logger === undefined || logger == null) {
            logger = new NullLogger();
        }
        this._logger = logger;
        this._ui = ui;
        this._logger.Log("FormBuilder - Constructing");
        this._repository.Events.On("change", function (data) { return _this.OnRepositoryChange(data); });
        this._ui.Events.On("orderchange", function () { return _this.OnOrderChange(); });
        if (formElements !== undefined && formElements.length > 0) {
            this._logger.Log("FormBuilder - Loading form elements");
            this._repository.formElements = formElements;
        }
        this._logger.Log("FormBuilder - Constructed");
    }
    FormBuilder.prototype.Add = function (element) {
        this._logger.Log("FormBuilder - Adding element:");
        this._logger.Log(element);
        this._repository.Add(element);
        this._logger.Log("FormBuilder - Element added");
    };
    FormBuilder.prototype.Import = function (elements, availableElements) {
        this._logger.Log("FormBuilder - Importing");
        this._repository.formElements = (new Importer(availableElements)).Import(elements);
        this._ui.Build(this._repository);
        this._logger.Log("FormBuilder - Imported");
    };
    FormBuilder.prototype.Export = function () {
        this._logger.Log("FormBuilder - Exporting");
        var result = (new Exporter()).Export(this._repository.formElements);
        this._logger.Log("FormBuilder - Exported");
        return result;
    };
    FormBuilder.prototype.OnRepositoryChange = function (data) {
        this._logger.Log("FormBuilder - OnRepositoryChange, building UI");
        this._ui.Build(this._repository);
        this._logger.Log(data);
    };
    FormBuilder.prototype.OnOrderChange = function () {
        this._logger.Log("FormBuilder - OnOrderChange");
        var order = this._ui.GetElementOrder();
        var result = [];
        for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
            var i = order_1[_i];
            var element = this._repository.formElements[i.toString()];
            result.push(element);
        }
        this._repository.formElements = result;
    };
    return FormBuilder;
}());
var UI = (function () {
    function UI(container) {
        this.Events = new EventHandler();
        this._bindingId = 0;
        this._container = container;
    }
    UI.prototype.Clear = function () {
        $(this._container).html("");
    };
    UI.prototype.Build = function (repository) {
        var _this = this;
        this.Clear();
        for (var i in repository.formElements) {
            this.AddElement(repository.formElements[i], Number(i));
        }
        $(this._container).sortable({
            axis: "y",
            forcePlaceholderSize: true,
            stop: function () { return _this.Events.Trigger("orderchange"); }
        });
    };
    UI.prototype.GetElementOrder = function () {
        var result = [];
        $(this._container).find(".draggable").each(function () {
            result.push(Number($(this).data("index")));
        });
        return result;
    };
    UI.prototype.AddElement = function (element, repositoryIndex) {
        var row = $("<div class=\"row draggable\" data-index=\"" + repositoryIndex + "\"><div class=\"container\"><div class=\"row wysiwyg\"></div><div class=\"row options\"></div></div></div>");
        if (element.HasLabel) {
            $(row).find(".wysiwyg").html('<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div>');
            element.SetLabel($(row).find(".label"));
        }
        else {
            $(row).find(".wysiwyg").html('<div class="col-1 toggler"></div><div class="col value"></div>');
        }
        $(row).find(".value").append(element.CreateAndBindDisplayValue());
        $(row).find(".toggler")
            .html('<a href="javascript:;"><span><i class="fa fa-arrow-circle-down"></i></span><span><i class="fa fa-arrow-circle-up"></i></a></span>')
            .find("a").on("click", function () {
            var element = $(this);
            do {
                element = $(element).parent();
            } while (!$(element).hasClass("wysiwyg"));
            element.next(".options").slideToggle(500);
            $(row).find(".toggler > a > span").each(function () {
                if ($(this).is(":visible")) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        });
        $(row).find(".toggler > a > span:last-child").hide();
        var optionsForm = this.GetOptionsForm(element);
        if (optionsForm !== null) {
            $(row).find(".options").append(optionsForm).slideUp(0);
        }
        else {
            $(row).find(".options").remove();
            $(row).find(".toggler > a > span").hide();
        }
        $(this._container).append(row);
    };
    UI.prototype.GetOptionsForm = function (element) {
        var properties = element.GetDefaultProperties().concat(element.Properties);
        if (properties.length === 0) {
            return null;
        }
        var values = element.Serialize();
        var result = $('<div class="container"></div>');
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            var item = $("<div class=\"row\"><div class=\"col-4\">" + property.Label + "</div><div class=\"col formbuilder-optioncontent\"></div></div>");
            var component = null;
            switch (property.Component) {
                case "text":
                    component = $("<input class=\"form-control component\" type=\"text\" id=\"formbuilder-binding-" + ++this._bindingId + "\">");
                    break;
                case "textarea":
                    component = $("<textarea class=\"form-control component\" id=\"formbuilder-binding-" + ++this._bindingId + "\"></textarea>");
                    break;
                case "items":
                    var placeholder = "Eén keuze per regel.\nIndien een score, gebruik dan het pipe-symbool om score en weergavetekst te scheiden.\n\nBijvoorbeeld:\n\n0|Nee\n5|Soms\n10|Ja";
                    component = $("<textarea class=\"form-control component\" id=\"formbuilder-binding-" + ++this._bindingId + "\" placeholder=\"" + placeholder + "\" style=\"height:160px;\"></textarea>");
                    break;
                case "select":
                    component = $("<select class=\"form-control component\" id=\"formbuilder-binding-" + ++this._bindingId + "\"></select>");
                    for (var i in property.Items) {
                        if (property.Items.hasOwnProperty(i)) {
                            var option = $("<option></option>");
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
            $(component).on("keyup change", function () {
                $(result).find(".component").each(function () {
                    element.ProcessValue($(this).data("property-id"), $(this).val());
                });
                if (element.HasLabel) {
                    element.UpdateLabel();
                }
            });
            $(result).append(item);
        }
        return result;
    };
    return UI;
}());
var EventHandler = (function () {
    function EventHandler() {
        this._eventListeners = {};
    }
    EventHandler.prototype.On = function (event, handler) {
        this.Off(event, handler);
        if (this._eventListeners[event] === undefined || this._eventListeners[event] == null) {
            this._eventListeners[event] = [];
        }
        this._eventListeners[event].push(handler);
    };
    EventHandler.prototype.Off = function (event, handler) {
        if (this._eventListeners[event] != undefined && this._eventListeners[event] != null) {
            this._eventListeners[event] = this._eventListeners[event].filter(function (e) { return e !== handler; });
        }
    };
    EventHandler.prototype.Trigger = function (event, data) {
        if (this._eventListeners[event] !== undefined ||
            this._eventListeners[event] != null && this._eventListeners[event].length > 0) {
            for (var _i = 0, _a = this._eventListeners[event]; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(data);
            }
        }
    };
    return EventHandler;
}());
var Item = (function () {
    function Item(id, value) {
        this.Id = id;
        this.Value = value;
    }
    return Item;
}());
var ItemSerializer = (function () {
    function ItemSerializer() {
    }
    ItemSerializer.prototype.Serialize = function (content) {
        var result = new Array();
        var lines = this.replaceAll(content, "\r", "").split("\n");
        if (lines.length > 0) {
            var emptyIds = 0;
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                var item = new Item("", "");
                var split = line.split("|");
                if (split.length == 1) {
                    item = new Item((emptyIds++).toString(), split[0]);
                }
                else if (split.length > 1) {
                    item = new Item(split[0], split[1]);
                }
                result.push(item);
            }
        }
        return result;
    };
    ItemSerializer.prototype.DeserializeText = function (content) {
        console.log("original: " + content);
        console.log("replaced: " + this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", ""));
        return this.replaceAll(this.replaceAll(content, "\\n", "\n"), "\\r", "");
    };
    ItemSerializer.prototype.replaceAll = function (content, find, replace) {
        var replacement = content;
        content = "";
        while (replacement !== content) {
            content = replacement;
            replacement = replacement.replace(find, replace);
        }
        return content;
    };
    return ItemSerializer;
}());
var Repository = (function () {
    function Repository() {
        this._formElements = new Array();
        this.Events = new EventHandler();
    }
    Object.defineProperty(Repository.prototype, "formElements", {
        get: function () {
            return this._formElements;
        },
        set: function (elements) {
            this._formElements = elements;
            this.Events.Trigger("change");
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.Add = function (element) {
        this._formElements.push(element);
        this.Events.Trigger("change");
    };
    return Repository;
}());
var AbstractFormElement = (function () {
    function AbstractFormElement(data) {
        this.Mandatory = "0";
        this.Label = "Label";
        this.HasLabel = true;
        this.IsScoreElement = true;
        this._binding = $("<span></span>");
        if (data !== undefined && data != null) {
            this.Deserialize(data);
        }
    }
    AbstractFormElement.prototype.ProcessValue = function (id, value) {
        this[id] = value;
        this.CreateAndBindDisplayValue();
    };
    AbstractFormElement.prototype.SetLabel = function (label) {
        this._label = label;
        this.UpdateLabel();
    };
    AbstractFormElement.prototype.UpdateLabel = function () {
        $(this._label).text(this.Label);
    };
    AbstractFormElement.prototype.GetDefaultProperties = function () {
        var result = [];
        if (this.IsScoreElement) {
            result.push(new ElementProperties("Score", "Scorecategorie", "select", { een: "een", twee: "twee" }));
        }
        if (this.HasLabel) {
            result.push(new ElementProperties("Label", "Label", "text"));
            if (this.Type !== "FormElementSelect") {
                result.push(new ElementProperties("Mandatory", "Verplicht", "select", { "0": "Nee", "1": "Ja" }));
            }
        }
        return result;
    };
    return AbstractFormElement;
}());
var ElementProperties = (function () {
    function ElementProperties(id, label, component, items) {
        this.Items = {};
        this.Id = id;
        this.Label = label;
        this.Component = component;
        if (items !== undefined && items != null) {
            this.Items = items;
        }
    }
    return ElementProperties;
}());
var FormElementCheckbox = (function (_super) {
    __extends(FormElementCheckbox, _super);
    function FormElementCheckbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementCheckbox";
        _this.Properties = [
            new ElementProperties("Value", "Items", "items")
        ];
        _this.Value = "";
        return _this;
    }
    FormElementCheckbox.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html("");
        var index = 0;
        var rnd = Math.random();
        for (var _i = 0, _a = (new ItemSerializer).Serialize(this.Value); _i < _a.length; _i++) {
            var item = _a[_i];
            this._binding.append($("<input type=\"checkbox\" name=\"checkbox-" + rnd + "\" id=\"checkbox-" + index + "-" + rnd + "\">"));
            this._binding.append($("<label for=\"checkbox-" + index++ + "-" + rnd + "\"></label>").text(item.Value));
            this._binding.append($("<br>"));
        }
        return this._binding;
    };
    FormElementCheckbox.prototype.New = function () {
        return new FormElementCheckbox();
    };
    FormElementCheckbox.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Score: this.Score,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Value: this.Value
        };
    };
    FormElementCheckbox.prototype.Deserialize = function (data) {
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementCheckbox;
}(AbstractFormElement));
var FormElementFile = (function (_super) {
    __extends(FormElementFile, _super);
    function FormElementFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementFile";
        _this.IsScoreElement = false;
        _this.Properties = [
            new ElementProperties("AllowedExtensions", "Toegestane bestandstypen", "text")
        ];
        _this.AllowedExtensions = "jpg,jpeg,png";
        return _this;
    }
    FormElementFile.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html('<input type="file">');
        return this._binding;
    };
    FormElementFile.prototype.New = function () {
        return new FormElementFile();
    };
    FormElementFile.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Label: this.Label,
            Mandatory: this.Mandatory,
            AllowedExtensions: this.AllowedExtensions
        };
    };
    FormElementFile.prototype.Deserialize = function (data) {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["AllowedExtensions"] !== undefined) {
            this.AllowedExtensions = data["AllowedExtensions"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementFile;
}(AbstractFormElement));
var FormElementPageEnd = (function (_super) {
    __extends(FormElementPageEnd, _super);
    function FormElementPageEnd() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementPageEnd";
        _this.HasLabel = false;
        _this.Properties = [];
        _this.IsScoreElement = false;
        return _this;
    }
    FormElementPageEnd.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html("<hr>");
        return this._binding;
    };
    FormElementPageEnd.prototype.New = function () {
        return new FormElementPageEnd();
    };
    FormElementPageEnd.prototype.Serialize = function () {
        return {
            Type: this.Type
        };
    };
    FormElementPageEnd.prototype.Deserialize = function (data) {
    };
    return FormElementPageEnd;
}(AbstractFormElement));
var FormElementRadio = (function (_super) {
    __extends(FormElementRadio, _super);
    function FormElementRadio() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementRadio";
        _this.Properties = [
            new ElementProperties("Value", "Items", "items")
        ];
        _this.Value = "";
        return _this;
    }
    FormElementRadio.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html("");
        var index = 0;
        var rnd = Math.random();
        for (var _i = 0, _a = (new ItemSerializer).Serialize(this.Value); _i < _a.length; _i++) {
            var item = _a[_i];
            this._binding.append($("<input type=\"radio\" name=\"radio-" + rnd + "\" id=\"radio-" + index + "-" + rnd + "\">"));
            this._binding.append($("<label for=\"radio-" + index++ + "-" + rnd + "\"></label>").text(item.Value));
            this._binding.append($("<br>"));
        }
        return this._binding;
    };
    FormElementRadio.prototype.New = function () {
        return new FormElementRadio();
    };
    FormElementRadio.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Score: this.Score,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Value: this.Value
        };
    };
    FormElementRadio.prototype.Deserialize = function (data) {
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementRadio;
}(AbstractFormElement));
var FormElementScore = (function (_super) {
    __extends(FormElementScore, _super);
    function FormElementScore(data) {
        var _this = _super.call(this, data) || this;
        _this.Type = "FormElementScore";
        _this.IsScoreElement = false;
        _this.Properties = [];
        _this.Min = "10";
        _this.Max = "100";
        _this.Step = "10";
        _this.Properties.push(new ElementProperties("Min", "Minimumscore", "select", _this.GetMinItems()));
        _this.Properties.push(new ElementProperties("Max", "Maximumscore", "select", _this.GetMaxItems()));
        _this.Properties.push(new ElementProperties("Step", "Stapgrootte", "select", _this.GetStepItems()));
        return _this;
    }
    FormElementScore.prototype.CreateAndBindDisplayValue = function () {
        var element = $("<select></select>");
        for (var i = +this.Max; i >= +this.Min; i -= +this.Step) {
            var v = +this.Step < 1 ? (Math.round(i * 10) / 10) : i;
            element.append($("<option></option>").val(v).text(v));
        }
        this._binding.html("").append(element);
        return this._binding;
    };
    FormElementScore.prototype.New = function () {
        return new FormElementScore();
    };
    FormElementScore.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Score: this.Score,
            Min: this.Min,
            Max: this.Max,
            Step: this.Step
        };
    };
    FormElementScore.prototype.Deserialize = function (data) {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
        if (data["Min"] !== undefined) {
            this.Min = data["Min"];
        }
        if (data["Max"] !== undefined) {
            this.Max = data["Max"];
        }
        if (data["Step"] !== undefined) {
            this.Step = data["Step"];
        }
    };
    FormElementScore.prototype.GetMinItems = function () {
        return {
            "0": "0",
            "1": "1",
            "5": "5",
            "10": "10"
        };
    };
    FormElementScore.prototype.GetMaxItems = function () {
        return {
            "1": "1",
            "5": "5",
            "10": "10",
            "100": "100"
        };
    };
    FormElementScore.prototype.GetStepItems = function () {
        return {
            "0.1": "0.1",
            "0.5": "0.5",
            "1": "1",
            "10": "10"
        };
    };
    return FormElementScore;
}(AbstractFormElement));
var FormElementSelect = (function (_super) {
    __extends(FormElementSelect, _super);
    function FormElementSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementSelect";
        _this.HasLabel = true;
        _this.Properties = [
            new ElementProperties("Value", "Items", "items")
        ];
        _this.Value = "";
        return _this;
    }
    FormElementSelect.prototype.CreateAndBindDisplayValue = function () {
        var element = $("<select></select>");
        for (var _i = 0, _a = (new ItemSerializer).Serialize(this.Value); _i < _a.length; _i++) {
            var item = _a[_i];
            element.append($("<option></option>").val(item.Id).text(item.Value));
        }
        this._binding.css("white-space", "pre");
        this._binding.html("").append(element);
        return this._binding;
    };
    FormElementSelect.prototype.New = function () {
        return new FormElementSelect();
    };
    FormElementSelect.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Score: this.Score,
            Label: this.Label,
            Value: this.Value
        };
    };
    FormElementSelect.prototype.Deserialize = function (data) {
        if (data["Score"] !== undefined) {
            this.Score = data["Score"];
        }
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementSelect;
}(AbstractFormElement));
var FormElementText = (function (_super) {
    __extends(FormElementText, _super);
    function FormElementText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementText";
        _this.HasLabel = false;
        _this.IsScoreElement = false;
        _this.Properties = [
            new ElementProperties("Value", "Text", "textarea")
        ];
        _this.Value = "Tekst";
        return _this;
    }
    FormElementText.prototype.CreateAndBindDisplayValue = function () {
        this._binding.css("white-space", "pre");
        this._binding.text(this.Value);
        return this._binding;
    };
    FormElementText.prototype.New = function () {
        return new FormElementText();
    };
    FormElementText.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Value: this.Value
        };
    };
    FormElementText.prototype.Deserialize = function (data) {
        if (data["Value"] !== undefined) {
            this.Value = (new ItemSerializer).DeserializeText(data["Value"]);
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementText;
}(AbstractFormElement));
var FormElementTextArea = (function (_super) {
    __extends(FormElementTextArea, _super);
    function FormElementTextArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementTextInput";
        _this.IsScoreElement = false;
        _this.Properties = [
            new ElementProperties("Placeholder", "Placeholder", "text")
        ];
        _this.Placeholder = "";
        return _this;
    }
    FormElementTextArea.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html("<textarea></textarea>");
        this._binding.find("textarea").attr("placeholder", this.Placeholder);
        return this._binding;
    };
    FormElementTextArea.prototype.New = function () {
        return new FormElementTextArea();
    };
    FormElementTextArea.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Mandatory: this.Mandatory,
            Label: this.Label,
            Placeholder: this.Placeholder
        };
    };
    FormElementTextArea.prototype.Deserialize = function (data) {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Placeholder"] !== undefined) {
            this.Placeholder = data["Placeholder"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementTextArea;
}(AbstractFormElement));
var FormElementTextInput = (function (_super) {
    __extends(FormElementTextInput, _super);
    function FormElementTextInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = "FormElementTextInput";
        _this.IsScoreElement = false;
        _this.Properties = [
            new ElementProperties("Placeholder", "Placeholder", "text")
        ];
        _this.Placeholder = "";
        return _this;
    }
    FormElementTextInput.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html('<input type="text">');
        this._binding.find("input").attr("placeholder", this.Placeholder);
        return this._binding;
    };
    FormElementTextInput.prototype.New = function () {
        return new FormElementTextInput();
    };
    FormElementTextInput.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Label: this.Label,
            Mandatory: this.Mandatory,
            Placeholder: this.Placeholder
        };
    };
    FormElementTextInput.prototype.Deserialize = function (data) {
        if (data["Label"] !== undefined) {
            this.Label = data["Label"];
        }
        if (data["Placeholder"] !== undefined) {
            this.Placeholder = data["Placeholder"];
        }
        if (data["Mandatory"] !== undefined) {
            this.Mandatory = data["Mandatory"];
        }
    };
    return FormElementTextInput;
}(AbstractFormElement));
var ConsoleLogger = (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.Log = function (message) {
        console.log(message);
    };
    return ConsoleLogger;
}());
var Exporter = (function () {
    function Exporter() {
    }
    Exporter.prototype.Export = function (elements) {
        return JSON.stringify(this.GetSerializedItems(elements), this.escapeJSON);
    };
    Exporter.prototype.GetSerializedItems = function (elements) {
        var result = [];
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            result.push(element.Serialize());
        }
        return result;
    };
    Exporter.prototype.escapeJSON = function (key, val) {
        if (typeof (val) != "string") {
            return val;
        }
        return val
            .replace(/[\\]/g, "\\\\")
            .replace(/[\/]/g, "\\/")
            .replace(/[\b]/g, "\\b")
            .replace(/[\f]/g, "\\f")
            .replace(/[\n]/g, "\\n")
            .replace(/[\r]/g, "\\r")
            .replace(/[\t]/g, "\\t")
            .replace(/[\"]/g, '\\"')
            .replace(/\\'/g, "\\'");
    };
    ;
    return Exporter;
}());
var Importer = (function () {
    function Importer(availableElements) {
        this.AvailableElements = [];
        this.AvailableElements = availableElements;
    }
    Importer.prototype.Import = function (elements) {
        var result = new Array();
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            var abstractFormElement = this.GetAvailableElement(element.Type);
            abstractFormElement.Deserialize(element);
            result.push(abstractFormElement);
        }
        return result;
    };
    Importer.prototype.GetAvailableElement = function (type) {
        for (var _i = 0, _a = this.AvailableElements; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element.Type === type) {
                return element.New();
            }
        }
        return null;
    };
    return Importer;
}());
var NullLogger = (function () {
    function NullLogger() {
    }
    NullLogger.prototype.Log = function (message) { };
    return NullLogger;
}());
//# sourceMappingURL=formbuilder.js.map