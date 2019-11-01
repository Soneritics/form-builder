window.onload = function () {
    var ui = new UI(document.getElementById('content'));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);
    // Buttons to create form elements
    $('#button-checkbox').on('click', function () { formbuilder.Add(new FormElementCheckbox()); });
    $('#button-file').on('click', function () { formbuilder.Add(new FormElementFile()); });
    $('#button-pageend').on('click', function () { formbuilder.Add(new FormElementPageEnd()); });
    $('#button-radio').on('click', function () { formbuilder.Add(new FormElementRadio()); });
    $('#button-select').on('click', function () { formbuilder.Add(new FormElementSelect()); });
    $('#button-text').on('click', function () { formbuilder.Add(new FormElementText()); });
    $('#button-textarea').on('click', function () { formbuilder.Add(new FormElementTextArea()); });
    $('#button-textinput').on('click', function () { formbuilder.Add(new FormElementTextInput()); });
    $('#button-score').on('click', function () { formbuilder.Add(new FormElementScore()); });
    // Serialize/deserialize
    $('#serialize').on('click', function () { $('#serialized').text(formbuilder.Export()); });
    $('#deserialize').on('click', function () {
        var formElements = [
            new FormElementCheckbox(),
            new FormElementFile(),
            new FormElementPageEnd(),
            new FormElementRadio(),
            new FormElementSelect(),
            new FormElementText(),
            new FormElementTextArea(),
            new FormElementTextInput(),
            new FormElementScore()
        ];
        formbuilder.Import(JSON.parse($('#deserialize-content').val()), formElements);
    });
};
//# sourceMappingURL=app.js.map