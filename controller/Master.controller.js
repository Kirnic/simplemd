sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/Filter",
   "sap/ui/model/Sorter"
], function (Controller, MessageToast, Filter, Sorter) {
   "use strict";
   return Controller.extend("local.controller.Master", {
       onOpenDialog: function() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "local.view.CreateDialog", this);
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
        },

        onCloseDialog: function() {
            oModel.setProperty('/title', '');
            oModel.setProperty('/counter', undefined);
            this._oDialog.close();
        },

        onAddCategory: function() {
            var categoryName =  oModel.getProperty('/title');
            var categoryCounter = Number(oModel.getProperty('/counter'));
            
            if (categoryName && categoryCounter > 0) {
                this._save(categoryName, categoryCounter);
            } else {
                oModel.setProperty('/title', '');
                oModel.setProperty('/counter', undefined);
                MessageToast.show("Некорректные данные. Попробуйте ещё раз");
            }
        },

        onSearch: function(oEvent) {
            var filters = [];
            var query = oEvent.getParameter('query');
            if (query) {
                var sorter = new Filter('title', sap.ui.model.FilterOperator.Contains, query);
                filters.push(sorter);
            }
            var categoryList = this.getView().byId('categoryList');
            var binding = categoryList.getBinding('items');
            binding.filter(filters); 
        },

        onOpenPopover: function(oEvent) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment(this.getView().getId(), "local.view.SortingPopover", this);
                this._oPopover.setPlacement(sap.m.PlacementType.Top);
                this.getView().addDependent(this._oPopover);
            }
            var btn = oEvent.getSource();
            this._oPopover.openBy(btn);
        },

        OnSortByName: function() {
            var categoryList = this.getView().byId('categoryList');
            var sorter = new Sorter('title');
            var items = categoryList.getBinding('items').sort(sorter);
            this._oPopover.close();
        }, 

        OnSortByCounter: function() {
            var categoryList = this.getView().byId('categoryList');
            var sorter = new Sorter('counter');
            var items = categoryList.getBinding('items').sort(sorter);
            this._oPopover.close();
        },

        _save(name, counter) {
            var categories = oModel.getProperty('/categories');
            categories.push({
                "title": name,
                "counter": counter
            });
            this.onCloseDialog();
        }
   });
});