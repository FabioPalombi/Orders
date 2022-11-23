sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/ui/model/json/JSONModel"
], function (Controller, ODataModel, JSONModel) {
  "use strict";
  return Controller.extend("sap.ui.demo.walkthrough.controller.Detail", {
     onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("detail").attachPatternMatched(this.onRouteMatched, this); // Get routed view from router and send to onRouteMatched() fn
     },
     onRouteMatched: function (oEvent) {
        const id = oEvent.getParameter("arguments").order; // Get id parameter from routing
        this.setData(id); // Send id parameter to setData() fn
     },
     setData: function (id) {
        const that = this;
        const list = this.byId("products");
        list.setBusy(true);
        const oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
        oModel.read("/Orders(" + id + ")", { // Read from Orders collection by id parameter
           success: function (oData) {
              const oStore = new JSONModel(oData); // Convert oData to JSON format
              that.getView().setModel(oStore, "order"); // Set order model to current views
           }
        });
        oModel.read("/Orders(" + id + ")/Order_Details", { // Read from Orders/Order_Details and expanding Product by id parameter
           urlParameters: {
              $expand: "Product"
           },
           success: function (oData) {
              const oStore = new JSONModel(oData.results); // Convert oData results to JSON format
              that.getView().setModel(oStore, "detail"); // Set detail model to current view
              list.setBusy(false);
           }
        });
     },
     onProduct: function (oEvent) {
        const that = this;
        const product = oEvent.getSource().getBindingContext("detail").getProperty("ProductID"); // Get property id from row's binding context
        const oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
        oModel.read("/Products(" + product + ")", { // Read from Products by id property
           urlParameters: {
              $expand: "Category"
           },
           success: function (oData) {
              const oStore = new JSONModel(oData); // Convert oData to JSON format
              that.getView().setModel(oStore, "product"); // Set product model to current view
              const dialog = that.byId("product");
              const image = that.byId("image");
              const picture = that.getView().getModel("product").oData.Category.Picture.substr(104); // Removing unused characters from base64 image
              image.setSrc("data:image/bmp;base64," + picture); // Concatenate base64 declaration with picture string
              dialog.setBusy(false);
           }
        });
        if (!this.pDialog) { // Create dialog if it doesn't exist
           this.pDialog = this.loadFragment({
              name: "sap.ui.demo.walkthrough.view.Product"
           });
        }
        this.pDialog.then(function (oDialog) {
           oDialog.open(); // Open dialog declaration
           const dialog = that.byId("product");
           dialog.setBusy(true);
        });
     },
     onClose: function () {
        this.byId("product").close(); // Close dialog declaration
     },
     onBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("overview");
     }
  });
});