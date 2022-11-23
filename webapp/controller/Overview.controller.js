sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
 ], function (Controller, ODataModel, JSONModel, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
       onInit: function () {
          const that = this;
          const oTable = this.byId("mainTable");
          oTable.setBusy(true);
          const oModel = new ODataModel("./V2/Northwind/Northwind.svc", true);
          oModel.read("/Orders", { // Read from Orders collection
             success: function (oData) {
                const oStore = new JSONModel(oData.results); // Convert oData results to JSON format
                that.getView().setModel(oStore, "main"); // Set main model to current view
                oTable.setBusy(false);
             }
          });
       },
       onSearch: async function () {
          const oTable = this.byId("mainTable");
          const oBinding = oTable.getBinding("items"); // Get binding from table's items
          oTable.setBusy(true);
          const aOrderID = this.byId("filterID").getSelectedKeys();
          const sCustomer = this.byId("filterCustomer").getValue();
          const sDate = this.byId("filterDate").getDateValue();
          var filters = []; // Filtering queries, if there is a value will be read and pushed into filters array to be prepared for binding
          if (aOrderID.length > 0) {
             for (let i = 0; i < aOrderID.length; i++) { // Cycle array of multiple keys to create filters
                var filter = new Filter("OrderID", FilterOperator.EQ, aOrderID[i]);
                filters.push(filter);
             }
          }
          if (sCustomer !== null) {
             var filter = new Filter("ShipName", FilterOperator.Contains, sCustomer);
             filters.push(filter);
          }
          if (sDate !== null) {
             var filter = new Filter("OrderDate", FilterOperator.EQ, sDate.toISOString());
             filters.push(filter);
          }
          oBinding.filter([filters]); // Binding filters to items property of main table
          oTable.setBusy(false);
       },
       onClear: function () {
          this.byId("filterID").setSelectedKeys([]);
          this.byId("filterCustomer").setValue("");
          this.byId("filterDate").setDateValue();
          this.onSearch(); // Call onSearch() fn after clearing filter fields
       },
       onDetail: function (oEvent) {
          const id = oEvent.getSource().getAggregation("cells")[0].getText(); // Get id from event when row is clicked
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("detail", { // Navigate to detail page with id as parameter
             order: id
          });
       }
    });
 });