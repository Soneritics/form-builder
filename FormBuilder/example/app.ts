window.onload = function () {
    var ui = new UI(document.getElementById('content'));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);

    // Buttons to create form elements
    $('#button-text').on('click', function () { formbuilder.Add(new FormElementText()); });

    // Serialize/deserialize
    $('#serialize').on('click', function () { $('#serialized').text(formbuilder.Export()); });
    $('#deserialize').on('click', function () {
        var formElements: AbstractFormElement[] = [
            new FormElementText()
        ];
        formbuilder.Import(JSON.parse($('#deserialize-content').val()), formElements);
    });
};
