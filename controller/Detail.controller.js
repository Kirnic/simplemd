sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/Filter"
], function (Controller, Filter) {
   "use strict";
   return Controller.extend("local.controller.Detail", {
        onSelectionTab: function(oEvent) {
            var categoryList = this.getView().byId('goodsList');
            var binding = categoryList.getBinding('items');
            var sorter = oEvent.getParameter('key');
            if (sorter === "Ok") {
                var filter = new Filter('price', 'LT', 150);
                binding.filter(filter);
            } else if (sorter === "Heavy") {
                var filter = new Filter('price', 'GT', 150);
                binding.filter(filter);
            } else if (sorter === "Overweight") {
                var filter = new Filter('price', 'GT', 350);
                binding.filter(filter);
            } 
        },
        onAddToBucket: function() {
            var categoryList = this.getView().byId('goodsList');
            var items = categoryList.getSelectedItems();
            var message = ""
            items.forEach(function(item) {
                var context =  item.getBindingContext();
                var productName = context.getProperty('title');
                message += productName + '\n';
            });
            message = message || "Ваша корзина пуста";
            sap.m.MessageToast.show(message);
        },
        OnSummarize: function() {
            var categoryList = this.getView().byId('goodsList');
            var items = categoryList.getSelectedItems();
            var sum = 0;
            items.forEach(function(item) {
                var context =  item.getBindingContext();
                var price = context.getProperty('price');
                sum += price;
            });
            this.getView().getModel().setProperty('/summary', sum);
        }
   });
});