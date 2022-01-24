
sap.ui.controller("zvatSalesOrder.ext.controller.ListReportExt", {

	_navigateTo:function(sem, act, par){
		var crossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService 
	        					&& sap.ushell.Container.getService("CrossApplicationNavigation");
	    if(crossAppNavigator) crossAppNavigator.toExternal({target: { semanticObject: sem,  action: act }, params: par });
	    
	},
	onListNavigationExtension: function(oEvent) {
        var soNr = oEvent.getSource().getBindingContext().getObject().vbeln;
        this._navigateTo("Zvat", "display", { "SalesOrder":soNr} );
    	return true;
	},

	onClickActionZVT_ZVAT_SALES_ORDER1: function (oEvent) {

        this._navigateTo("Zvat", "manage");
	},
	onClickActionZVT_ZVAT_SALES_ORDER2: function (oEvent) {
		var ctx = this.extensionAPI.getSelectedContexts();
		if	(ctx && ctx.length !== 1 ){
			sap.m.MessageBox.error("Bitte eine Zeile auswählen!");
			return;
		}
		var soNr = ctx[0].getObject().vbeln;
        this._navigateTo("Zvat", "change", { "SalesOrder":soNr} );
	},
	onClickActionZVT_ZVAT_SALES_ORDER3: function (oEvent) {
		var ctx = this.extensionAPI.getSelectedContexts();
		if	(ctx && ctx.length !== 1 ){
			sap.m.MessageBox.error("Bitte eine Zeile auswählen!");
			return;
		}
		var soNr = ctx[0].getObject().vbeln;
        this._navigateTo("Zvat", "display", { "SalesOrder":soNr} );
	},
	onClickActionZVT_ZVAT_SALES_ORDER4: function (oEvent) {
		var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var zvatMod = this.getOwnerComponent().getModel('zvat');
		zvatMod.setUseBatch(true);
		zvatMod.setDeferredGroups(["setBB"]);

		var ctx = this.extensionAPI.getSelectedContexts();
		
		if	(!ctx || ctx.length < 1 ){
			sap.m.MessageBox.error("Bitte eine Zeile auswählen!");
			return;
		}
		
		for (var i = 0; i < ctx.length; i++) {
			var soNr = ctx[i].getObject().vbeln;
			zvatMod.update("/billingBlock('" + soNr + "')", {orderNo: soNr, set: true }, {groupId:"setBB" });
		}
		zvatMod.submitChanges( { 
			groupId:"setBB",
			success: function(odata, resp){
				if	( odata.__batchResponses[0].$reported === true ){
					sap.m.MessageBox.error(JSON.parse(odata.__batchResponses[0].response.body).error.message.value);
					return; 
				}
				sap.m.MessageBox.success(i18n.getText("setBillingBlock"));
			},
			error: function(odata, resp) {
				sap.m.MessageBox.error();
			}
		});
	},
	onClickActionZVT_ZVAT_SALES_ORDER5: function (oEvent) {
		var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		var zvatMod = this.getOwnerComponent().getModel('zvat');
		zvatMod.setUseBatch(true);
		zvatMod.setDeferredGroups(["delBB"]);

		var ctx = this.extensionAPI.getSelectedContexts();
		
		if	(!ctx || ctx.length < 1 ){
			sap.m.MessageBox.error("Bitte eine Zeile auswählen!");
			return;
		}
		
		for (var i = 0; i < ctx.length; i++) {
			var soNr = ctx[i].getObject().vbeln;
			zvatMod.update("/billingBlock('" + soNr + "')", {orderNo: soNr, del: true }, {groupId:"delBB" });
		}
		zvatMod.submitChanges( { 
			groupId:"delBB",
			success: function(odata, resp){
				if	( odata.__batchResponses[0].$reported === true ){
					sap.m.MessageBox.error(JSON.parse(odata.__batchResponses[0].response.body).error.message.value);
					return; 
				}
				sap.m.MessageBox.success(i18n.getText("canceledBillingBlock"));
			},
			error: function(odata, resp) {
				sap.m.MessageBox.error();
			}
		});
	},

    onPressVbelnCell:function(ev){
        var soNr = ev.getSource().getBindingContext().getObject().vbeln;
        this._navigateTo("Zvat", "display", { "SalesOrder":soNr} );
    }
});