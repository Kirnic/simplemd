sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/Filter",
   "sap/ui/model/Sorter"
], function (Controller, MessageToast, Filter, Sorter) {
   "use strict";
   return Controller.extend("local.controller.Master", {
       onInit: function() {
           this._oView = this.getView();
       },
       onOpenDialog: function() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(this._oView.getId(), "local.view.CreateDialog", this);
                this._oView.addDependent(this._oDialog);
            }
            this._oDialog.open();
        },

        onCloseDialog: function() {
            oModel.setProperty('/NewTitle', '');
            oModel.setProperty('/NewCounter', undefined);
            this._oDialog.close();
        },

        onEditing: function(oEvent) {
            if (!this._oEditDialog) {
                this._oEditDialog = sap.ui.xmlfragment(this._oView.getId(), "local.view.EditDialog", this);
                this._oView.addDependent(this._oEditDialog);
            }
            var path = oEvent.getSource().getBindingContext().getPath();
            this._editedIndex = path.split('').pop();

            oModel.setProperty('/EditTitle', oEvent.getSource().getTitle());
            oModel.setProperty('/EditCounter', oEvent.getSource().getCounter());

            this._oEditDialog.open();
        },

        onCloseEditDialog: function(oEvent) {
            oModel.setProperty('/EditTitle', '');
            oModel.setProperty('/EditCounter', undefined);
            this._oEditDialog.close();
        },

        onConfirmEdit: function() {
            var editedTitle = oModel.getProperty('/EditTitle');
            var editedCounter = Number(oModel.getProperty('/EditCounter'));

            if (editedTitle) {
                oModel.setProperty('/categories/' + this._editedIndex + '/title', editedTitle);
            }
            if (editedCounter > 0) {
                oModel.setProperty('/categories/' + this._editedIndex + '/counter', editedCounter);
                this.onCloseEditDialog();
            } else {
                MessageToast.show("Некорретное количество. Попробуйте ещё раз");
            }

        },

        onAddCategory: function() {
            var categoryName =  oModel.getProperty('/NewTitle');
            var categoryCounter = Number(oModel.getProperty('/NewCounter'));
            
            if (categoryName && categoryCounter > 0) {
                this._save(categoryName, categoryCounter);
            } else {
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
            var categoryList = this._oView.byId('categoryList');
            var binding = categoryList.getBinding('items');
            binding.filter(filters); 
        },

        onOpenPopover: function(oEvent) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment(this._oView.getId(), "local.view.SortingPopover", this);
                this._oPopover.setPlacement(sap.m.PlacementType.Top);
                this._oView.addDependent(this._oPopover);
            }
            var btn = oEvent.getSource();
            this._oPopover.openBy(btn);
        },

        OnSortByName: function() {
            var categoryList = this._oView.byId('categoryList');
            var sorter = new Sorter('title');
            var items = categoryList.getBinding('items').sort(sorter);
            this._oPopover.close();
        }, 

        OnSortByCounter: function() {
            var categoryList = this._oView.byId('categoryList');
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