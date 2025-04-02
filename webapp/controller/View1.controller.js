sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller,MessageToast,JSONModel) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            this.getView().setModel(new JSONModel(), "workflowModel");
        },

        // Function to get OAuth Token
        getToken: function () {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "https://c1aa51bbtrial.authentication.us10.hana.ondemand.com/oauth/token",  
                    type: "POST",
                    data: {
                        "grant_type": "client_credentials",
                        "client_id": "sb-a2df2484-b5e4-4c69-bc98-f1a0b54f835f!b397768|xsuaa!b49390",
                        "client_secret": "2d1b3fe2-1344-473e-af03-97790a16157a$CwPMbOFAo55i5JTs8V_NhBFIUvmZ7fhzrLm3dgansd0="
                    },
                    success: function (data) {
                        resolve(data.access_token);
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        },
// hii aman
        // Function to trigger the workflow
        onTriggerWorkflow: function () {
            var that = this;

            this.getToken().then(function (token) {
                var sUrl = "/Build_Process_Automation/workflow-rest/v1/workflows/<workflow-id>/instances"; 
                var oPayload = {
                    "definitionId": "us10.c1aa51bbtrial.salesordersmanagementge152407.orderProcessing",
                    "context": {
                        "salesorderdetails": {
                            "material": "",
                            "quantity": 0,
                            "shipToParty": "",
                            "salesOrderType": "",
                            "salesOrganisation": "",
                            "distributionChannel": "",
                            "expectedDeliveryDate": "2025-12-02",
                            "soldToParty": ""
                        }
                    }
                };

                $.ajax({
                    url: sUrl,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(oPayload),
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    success: function (data) {
                        MessageToast.show("Workflow triggered successfully!");
                    },
                    error: function (err) {
                        MessageToast.show("Error triggering workflow: " + err.responseText);
                    }
                });

            }).catch(function (err) {
                MessageToast.show("Failed to get OAuth token: " + err.responseText);
            });
        }
    });
});