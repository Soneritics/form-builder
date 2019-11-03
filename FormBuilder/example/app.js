window.onload = function () {
    var scoreCategories = {
        "Categorie 1": "Categorie 1",
        "Categorie 2": "Categorie 2",
        "Categorie 3": "Categorie 3"
    };
    var ui = new UI(document.getElementById("content"));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);
    // Buttons to create form elements
    $("#button-checkbox").on("click", function () { formbuilder.Add(new FormElementCheckbox(scoreCategories)); });
    $("#button-file").on("click", function () { formbuilder.Add(new FormElementFile(scoreCategories)); });
    $("#button-pageend").on("click", function () { formbuilder.Add(new FormElementPageEnd(scoreCategories)); });
    $("#button-radio").on("click", function () { formbuilder.Add(new FormElementRadio(scoreCategories)); });
    $("#button-select").on("click", function () { formbuilder.Add(new FormElementSelect(scoreCategories)); });
    $("#button-text").on("click", function () { formbuilder.Add(new FormElementText(scoreCategories)); });
    $("#button-textarea").on("click", function () { formbuilder.Add(new FormElementTextArea(scoreCategories)); });
    $("#button-textinput").on("click", function () { formbuilder.Add(new FormElementTextInput(scoreCategories)); });
    $("#button-score").on("click", function () { formbuilder.Add(new FormElementScore(scoreCategories)); });
    // Serialize/deserialize
    $("#serialize").on("click", function () { $("#serialized").text(formbuilder.Export()); });
    $("#deserialize").on("click", function () {
        var formElements = [
            new FormElementCheckbox(scoreCategories),
            new FormElementFile(scoreCategories),
            new FormElementPageEnd(scoreCategories),
            new FormElementRadio(scoreCategories),
            new FormElementSelect(scoreCategories),
            new FormElementText(scoreCategories),
            new FormElementTextArea(scoreCategories),
            new FormElementTextInput(scoreCategories),
            new FormElementScore(scoreCategories)
        ];
        formbuilder.Import(JSON.parse($("#deserialize-content").val().toString()), formElements);
    });
};
//# sourceMappingURL=app.js.map