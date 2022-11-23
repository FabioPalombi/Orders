sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/ui/model/json/JSONModel"
], function (UIComponent) {
  "use strict";
  return UIComponent.extend("sap.ui.demo.walkthrough.Component", {
     metadata: { // Manifest (JSON) declaration
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json"
     },
     init: function () {
        UIComponent.prototype.init.apply(this, arguments);
        this.getRouter().initialize(); // Router initialization
     }
  });
});