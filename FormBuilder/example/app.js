window.onload = function () {
    var ui = new UI(document.getElementById('content'));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);
    // Buttons to create form elements
    $('#button-text').on('click', function () { formbuilder.Add(new FormElementText()); });
    $('#button-textinput').on('click', function () { formbuilder.Add(new FormElementTextInput()); });
    $('#button-textarea').on('click', function () { formbuilder.Add(new FormElementTextArea()); });
    // Serialize/deserialize
    $('#serialize').on('click', function () { $('#serialized').text(formbuilder.Export()); });
    $('#deserialize').on('click', function () {
        var formElements = [
            new FormElementText(),
            new FormElementTextInput(),
            new FormElementTextArea()
        ];
        formbuilder.Import(JSON.parse($('#deserialize-content').val()), formElements);
    });
};
//# sourceMappingURL=app.js.map