jQuery.sap.declare("local.Component");

sap.ui.core.UIComponent.extend("local.Component", {
    createContent : function() {
        var oView = sap.ui.view({
            id: "AppId",
            viewName: "local.view.App",
            type: "XML",
            viewData: { component : this }
        });

        oView.setModel(new sap.ui.model.json.JSONModel("data.json"));
        return oView;
    }
});