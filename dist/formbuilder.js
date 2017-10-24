var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
        this._logger.Log('FormBuilder - Constructing');
        this._repository.Events.On('change', function (data) { return _this.OnRepositoryChange(data); });
        if (formElements !== undefined && formElements.length > 0) {
            this._logger.Log('FormBuilder - Loading form elements');
            this._repository.formElements = formElements;
        }
        this._logger.Log('FormBuilder - Constructed');
    }
    FormBuilder.prototype.Add = function (element) {
        this._logger.Log('FormBuilder - Adding element:');
        this._logger.Log(element);
        this._repository.Add(element);
        this._logger.Log('FormBuilder - Element added');
    };
    FormBuilder.prototype.Import = function (elements, availableElements) {
        this._logger.Log('FormBuilder - Importing');
        this._repository.formElements = (new Importer(availableElements)).Import(elements);
        this._ui.Build(this._repository);
        this._logger.Log('FormBuilder - Imported');
    };
    FormBuilder.prototype.Export = function () {
        this._logger.Log('FormBuilder - Exporting');
        var order = this._ui.GetElementOrder();
        var result = (new Exporter()).Export(this._repository.formElements, order);
        this._logger.Log('FormBuilder - Exported');
        return result;
    };
    FormBuilder.prototype.OnRepositoryChange = function (data) {
        this._logger.Log('FormBuilder - OnRepositoryChange, building UI');
        this._ui.Build(this._repository);
        this._logger.Log(data);
    };
    return FormBuilder;
}());
var UI = (function () {
    function UI(container) {
        this._bindingId = 0;
        this._container = container;
    }
    UI.prototype.Clear = function () {
        $(this._container).html('');
    };
    UI.prototype.Build = function (repository) {
        this.Clear();
        for (var i in repository.formElements) {
            this.AddElement(repository.formElements[i], Number(i));
        }
        $(this._container).sortable();
    };
    UI.prototype.GetElementOrder = function () {
        var result = [];
        $(this._container).find('.draggable').each(function () {
            result.push(Number($(this).data('index')));
        });
        return result;
    };
    UI.prototype.AddElement = function (element, repositoryIndex) {
        var row = $('<div class="row draggable" data-index="' + repositoryIndex + '"><div class="container"><div class="row wysiwyg"></div><div class="row options"></div></div></div>');
        if (element.HasLabel) {
            $(row).find('.wysiwyg').html('<div class="col-4"><div class="row"><div class="col-1 toggler"></div><div class="col label"></div></div></div><div class="col-sm-7 value"></div>');
            element.SetLabel($(row).find('.label'));
        }
        else {
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
    };
    UI.prototype.GetOptionsForm = function (element) {
        var properties = element.GetDefaultProperties().concat(element.Properties);
        if (properties.length === 0) {
            return 'There are no properties for this element.';
        }
        var values = element.Serialize();
        var result = $('<div class="container"></div>');
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
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
            $(component).on('keyup', function () {
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
    };
    return UI;
}());
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
    Exporter.prototype.Export = function (elements, order) {
        return JSON.stringify(this.GetSerializedItems(elements, order), this.escapeJSON);
    };
    Exporter.prototype.GetSerializedItems = function (elements, order) {
        var result = [];
        for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
            var i = order_1[_i];
            var element = elements[i.toString()];
            result.push(element.Serialize());
        }
        return result;
    };
    Exporter.prototype.escapeJSON = function (key, val) {
        if (typeof (val) != "string") {
            return val;
        }
        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
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
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
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
var AbstractFormElement = (function () {
    function AbstractFormElement(data) {
        this.Label = 'Label';
        this.HasLabel = true;
        this._binding = $('<span></span>');
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
        var result = [
            new ElementProperties('Name', 'Name', 'text'),
        ];
        if (this.HasLabel) {
            result.push(new ElementProperties('Label', 'Label', 'text'));
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
var FormElementText = (function (_super) {
    __extends(FormElementText, _super);
    function FormElementText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 'FormElementText';
        _this.HasLabel = false;
        _this.Properties = [
            new ElementProperties('Value', 'Text', 'textarea')
        ];
        _this.Value = "Place text here";
        return _this;
    }
    FormElementText.prototype.CreateAndBindDisplayValue = function () {
        this._binding.css('white-space', 'pre');
        this._binding.text(this.Value);
        return this._binding;
    };
    FormElementText.prototype.New = function () {
        return new FormElementText();
    };
    FormElementText.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            Value: this.Value
        };
    };
    FormElementText.prototype.Deserialize = function (data) {
        if (data['Name'] !== undefined) {
            this.Name = data['Name'];
        }
        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }
        if (data['Value'] !== undefined) {
            this.Value = data['Value'];
        }
    };
    return FormElementText;
}(AbstractFormElement));
var FormElementTextArea = (function (_super) {
    __extends(FormElementTextArea, _super);
    function FormElementTextArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 'FormElementTextInput';
        _this.Properties = [
            new ElementProperties('Placeholder', 'Placeholder', 'text')
        ];
        _this.Placeholder = "";
        return _this;
    }
    FormElementTextArea.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html('<textarea></textarea>');
        this._binding.find('textarea').attr('placeholder', this.Placeholder);
        return this._binding;
    };
    FormElementTextArea.prototype.New = function () {
        return new FormElementTextArea();
    };
    FormElementTextArea.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            Placeholder: this.Placeholder
        };
    };
    FormElementTextArea.prototype.Deserialize = function (data) {
        if (data['Name'] !== undefined) {
            this.Name = data['Name'];
        }
        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }
        if (data['Placeholder'] !== undefined) {
            this.Placeholder = data['Placeholder'];
        }
    };
    return FormElementTextArea;
}(AbstractFormElement));
var FormElementTextInput = (function (_super) {
    __extends(FormElementTextInput, _super);
    function FormElementTextInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 'FormElementTextInput';
        _this.Properties = [
            new ElementProperties('Placeholder', 'Placeholder', 'text')
        ];
        _this.Placeholder = "";
        return _this;
    }
    FormElementTextInput.prototype.CreateAndBindDisplayValue = function () {
        this._binding.html('<input type="text">');
        this._binding.find('input').attr('placeholder', this.Placeholder);
        return this._binding;
    };
    FormElementTextInput.prototype.New = function () {
        return new FormElementTextInput();
    };
    FormElementTextInput.prototype.Serialize = function () {
        return {
            Type: this.Type,
            Name: this.Name,
            Label: this.Label,
            Placeholder: this.Placeholder
        };
    };
    FormElementTextInput.prototype.Deserialize = function (data) {
        if (data['Name'] !== undefined) {
            this.Name = data['Name'];
        }
        if (data['Label'] !== undefined) {
            this.Label = data['Label'];
        }
        if (data['Placeholder'] !== undefined) {
            this.Placeholder = data['Placeholder'];
        }
    };
    return FormElementTextInput;
}(AbstractFormElement));
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
        if (this._eventListeners[event] !== undefined || this._eventListeners[event] != null && this._eventListeners[event].length > 0) {
            for (var _i = 0, _a = this._eventListeners[event]; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(data);
            }
        }
    };
    return EventHandler;
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
            this.Events.Trigger('change');
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.Add = function (element) {
        this._formElements.push(element);
        this.Events.Trigger('change');
    };
    return Repository;
}());
//# sourceMappingURL=formbuilder.js.map