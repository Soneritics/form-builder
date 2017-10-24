window.onload = function () {
    var ui = new UI(document.getElementById('container'));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);

    $('#button-text').on('click', function () { formbuilder.Add(new FormElementText()); });
};
