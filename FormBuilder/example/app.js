/// <reference path="../src/ui.ts" />
/// <reference path="../src/formbuilder.ts" />
/// <reference path="../src/modules/consolelogger.ts" />
window.onload = function () {
    var ui = new UI(document.getElementById('container'));
    var logger = new ConsoleLogger();
    var formbuilder = new FormBuilder(ui, logger);
};
//# sourceMappingURL=app.js.map