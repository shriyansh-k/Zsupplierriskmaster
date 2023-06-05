sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox", 
    "sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV",
    "sap/m/BusyDialog",
    "sap/m/Column",
	"sap/m/Label",
	"sap/m/ColumnListItem",
	"sap/m/Text", "ns/zsupplierriskmaster/Util/Formatter",

],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller,JSONModel,MessageToast,MessageBox,Export,ExportTypeCSV,BusyDialog,
        Column,Label,ColumnListItem,Text,Formatter) {
		"use strict";

		return Controller.extend("ns.zsupplierriskmaster.controller.zsupplierriskmaster", {
            Formatter: Formatter,
            onInit: function () {
                
                var oModelExpoert = new sap.ui.model.json.JSONModel();
                 sap.ui.getCore().setModel(oModelExpoert, "oModel");
                 var oModel = new JSONModel();
                   this.getView().setModel(oModel);
                 
                var oJsonSupplRisk = new JSONModel();
                this.oBusy = new BusyDialog();
                var oView = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
              oModel.setSizeLimit(10000);
            sap.ui.getCore().setModel(oModel);
            var columnModel = new JSONModel();
			this.getView().setModel(columnModel, "columnModel");
              var aJsonType = {
				"Type": [{
                    "Name": "Supplier Master Data",
                    "Url": "SupplierMasterData"
                },

                {
                    "Name": "Third Party Supplier Mapping",
                    "Url": "SupplierExternalMapping"
                },
                {
                    "Name": "EcoVadis - Business Ratings",
                    "Url": "EcoVadis_Ratings"
                },
                 {
                    "Name": "Dun & Bradstreet",
                    "Url": "DB_Ratings"
                },
                ]
            }
            oJsonSupplRisk.setData(aJsonType);
            oView.setModel(oJsonSupplRisk,"RISK");  
         },

         onHomeIconPress : function(oEvent){
                var oCrossAppNavigator = "";
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService)
                {
                    oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                }
                if(oCrossAppNavigator){
                    oCrossAppNavigator.toExternal({
                        target: { 
                            semanticObject : "zriskhome2", 
                            action: "display"
                        },
                        params : {

                        }
                    });
                }
            },
        onSelectTab : function(oEvent){
                var selectedKey = oEvent.getParameter("key");
                var oCrossAppNavigator = "";
                if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService)
                {
                    oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                }
                if(oCrossAppNavigator && selectedKey == "01"){
                    oCrossAppNavigator.toExternal({
                        target: { 
                            semanticObject : "zassesshomesem", 
                            action: "display"
                        },
                        params : {
                        }

                    });

                }else if(oCrossAppNavigator && selectedKey == "02"){
                    oCrossAppNavigator.toExternal({
                        target: { 
                            semanticObject : "ztest", 
                            action: "display"
                        },
                        params : {
                        }
                    });
                }
            },
        fnFileUploadComplete: function(oEvent) {
            var that = this;                      
          var oFile = oEvent.getParameter("files")[0];
          this.oFile = oFile;
          if (oFile && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function(evt) {
              var strCSV = evt.target.result; //string in CSV 
              that.csvJSON(strCSV);
            };
            reader.readAsText(oFile);
          }

        },
         csvJSON: function(csv) {
          var lines = csv.split("\n");
          var result = [];
          var vtemp  = lines[0].split(",");
          var headers = [];
          
         // var headers = lines[0].split(",");
          for(var i=0;i<vtemp.length;i++){
              var vtemp2 = vtemp[i].replace(/ +/g, "");
              vtemp2 = vtemp2.replace("*","");
              headers.push(vtemp2);
              
        //   headers[i].replace("*","");
       
          }
          for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
            }
            result.push(obj);
          }
          var oStringResult = JSON.stringify(result);
          var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));
           var vlength = oFinalResult.length;
          oFinalResult.splice(vlength - 1,1);
          //return result; //JavaScript object
          this.getView().getModel().setProperty("/", oFinalResult);
         
          
          this.generateTableCsv();
     

        //  MessageToast.show("File Uploaded Successfully")
        },

        /*	Function to create the table dynamically for csv File*/
		generateTableCsv: function () {
			var that = this;
			var oTable = that.getView().byId("Tableid");
			var oModel = that.getView().getModel();
            var oModelData = oModel.getProperty("/");
             var vKey = this.getView().byId("id_SelectRisk").getSelectedKey();
            if(vKey ==="SupplierMasterData"){
            // for(var i=0;i<oModelData.length;i++){
            //   oModelData[i].DateAdded = Formatter.fnDateFormat(oModelData[i].DateAdded);
            // }
           }
            if(vKey ==="SupplierMasterData"){
               
                 if(oModelData.length === 0){
                     MessageBox.warning("File is Empty");
                  }  else{
                  var ColumnsData = Object.keys(oModelData[0]);
               var oColumnNames = [];
                if(ColumnsData[5] ==="Category"){
         
			$.each(ColumnsData, function (i, value) {
				oColumnNames.push({
					Text: ColumnsData[i]
				});
			});
			oModel.setProperty("/columnNames", oColumnNames);
			var columnmodel = that.getView().getModel("columnModel");
            columnmodel.setProperty("/", oColumnNames);
            //that.getView().setModel(columnmodel,"COL");
           // that.getView().setModel(oModelData[0],"ITM");
			var oTemplate = new Column({
				header: new Label({
                    text: "{Text}",
                    wrapping : true,
                    design : "Bold"
                }),
                width : "5rem"
			});
			oTable.bindAggregation("columns", "/columnNames", oTemplate);
			var oItemTemplate = new ColumnListItem();
			var oTableHeaders = oTable.getColumns();
			$.each(oTableHeaders, function (j, value) {
				var oHeaderName = oTableHeaders[j].getHeader().getText();
				oItemTemplate.addCell(new Text({
					text: "{" + oHeaderName + "}"
				}));
			});
			oTable.bindAggregation("items", {
				path: "/",
				template: oItemTemplate

            });
            this.getView().byId("id_Save").setVisible(true);
            this.getView().byId("id_Clear").setVisible(true);
        
         }
                 else{
                     MessageBox.warning("Invalid Template");
                 }
        }
                
            }
            if(vKey==="DB_Ratings"){
               
                   if(oModelData.length === 0){
                     MessageBox.warning("File is Empty");
                  }  else{
                    var ColumnsData = Object.keys(oModelData[0]);
                    var oColumnNames = [];
        if(ColumnsData[1] ==="SER"){
			$.each(ColumnsData, function (i, value) {
				oColumnNames.push({
					Text: ColumnsData[i]
				});
			});
			oModel.setProperty("/columnNames", oColumnNames);
			var columnmodel = that.getView().getModel("columnModel");
            columnmodel.setProperty("/", oColumnNames);
            //that.getView().setModel(columnmodel,"COL");
           // that.getView().setModel(oModelData[0],"ITM");
			var oTemplate = new Column({
				header: new Label({
                    text: "{Text}",
                    wrapping : true,
                    design : "Bold"
                }),
                width : "5rem"
			});
			oTable.bindAggregation("columns", "/columnNames", oTemplate);
			var oItemTemplate = new ColumnListItem();
			var oTableHeaders = oTable.getColumns();
			$.each(oTableHeaders, function (j, value) {
				var oHeaderName = oTableHeaders[j].getHeader().getText();
				oItemTemplate.addCell(new Text({
					text: "{" + oHeaderName + "}"
				}));
			});
			oTable.bindAggregation("items", {
				path: "/",
				template: oItemTemplate

            });
             this.getView().byId("id_Save").setVisible(true);
            this.getView().byId("id_Clear").setVisible(true);

            }
                 else{
                     MessageBox.warning("Invalid Template");
                 }  
           }
           
               
            } 
            if(vKey==="SupplierExternalMapping"){
               
                  if(oModelData.length === 0){
                     MessageBox.warning("File is Empty");
                  }  else{
                    var ColumnsData = Object.keys(oModelData[0]);
               var oColumnNames = [];
                if(ColumnsData[1] ==="Assessor"){
			$.each(ColumnsData, function (i, value) {
				oColumnNames.push({
					Text: ColumnsData[i]
				});
			});
			oModel.setProperty("/columnNames", oColumnNames);
			var columnmodel = that.getView().getModel("columnModel");
            columnmodel.setProperty("/", oColumnNames);
            //that.getView().setModel(columnmodel,"COL");
           // that.getView().setModel(oModelData[0],"ITM");
			var oTemplate = new Column({
				header: new Label({
                    text: "{Text}",
                    wrapping : true,
                    design : "Bold"
                }),
                width : "5rem"
			});
			oTable.bindAggregation("columns", "/columnNames", oTemplate);
			var oItemTemplate = new ColumnListItem();
			var oTableHeaders = oTable.getColumns();
			$.each(oTableHeaders, function (j, value) {
				var oHeaderName = oTableHeaders[j].getHeader().getText();
				oItemTemplate.addCell(new Text({
					text: "{" + oHeaderName + "}"
				}));
			});
			oTable.bindAggregation("items", {
				path: "/",
				template: oItemTemplate

            });

             this.getView().byId("id_Save").setVisible(true);
            this.getView().byId("id_Clear").setVisible(true);
             }
                 else{
                     MessageBox.warning("Invalid Template");
                 }  
        }
   
            }
            if(vKey==="EcoVadis_Ratings"){
              
               if(oModelData.length === 0){
                     MessageBox.warning("File is Empty");
                  }  else{
                var ColumnsData = Object.keys(oModelData[0]);
               var oColumnNames = [];
                if(ColumnsData[4] ==="EthicsScore"){
			$.each(ColumnsData, function (i, value) {
				oColumnNames.push({
					Text: ColumnsData[i]
				});
			});
			oModel.setProperty("/columnNames", oColumnNames);
			var columnmodel = that.getView().getModel("columnModel");
            columnmodel.setProperty("/", oColumnNames);
            //that.getView().setModel(columnmodel,"COL");
           // that.getView().setModel(oModelData[0],"ITM");
			var oTemplate = new Column({
				header: new Label({
                    text: "{Text}",
                    wrapping : true,
                    design : "Bold"
                }),
                width : "5rem"
			});
			oTable.bindAggregation("columns", "/columnNames", oTemplate);
			var oItemTemplate = new ColumnListItem();
			var oTableHeaders = oTable.getColumns();
			$.each(oTableHeaders, function (j, value) {
				var oHeaderName = oTableHeaders[j].getHeader().getText();
				oItemTemplate.addCell(new Text({
					text: "{" + oHeaderName + "}"
				}));
			});
			oTable.bindAggregation("items", {
				path: "/",
				template: oItemTemplate

            });
             this.getView().byId("id_Save").setVisible(true);
                this.getView().byId("id_Clear").setVisible(true);

            }
                 else{
                     MessageBox.warning("Invalid Template");
                 }
        }
                  
            }
   
		},

     fnSelectChange : function(){
          var vRisk = this.getView().byId("id_SelectRisk").getSelectedItem();
           if(vRisk ===null){
                this.getView().byId("id_fileUploader").setEnabled(false);
           } else{
               this.getView().byId("id_fileUploader").setEnabled(true);
           }
       
    },
    handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			aFileTypes.map(function(sType) {
				return "*." + sType;
			});
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose only file type " +
									aFileTypes.join(", "));
    },

        
    onSubmit : function(){
          var vKey = this.getView().byId("id_SelectRisk").getSelectedKey();
           var oModel   = this.getOwnerComponent().getModel();
           var oCont = this;

          var vData = this.getView().getModel().getData();
              if(vKey!=""){
              if(vKey==="DB_Ratings"){
              var oDataSet = [];
              var vBool;
            for(var i=0;i<vData.length;i++){
                    var oPayload =    
            {
            "vendorID": vData[i].VendorID,
            // "supplierLocation": vData[i].SupplierLocation,
            "SER": Number(vData[i].SER),
            "SSI":Number(vData[i].SSI),
            "dbRating1": vData[i].DBRating1,
            "dbPaydex": Number(vData[i].DBPaydex),
            "FSSpercentage": vData[i].FSSPercentage,
            "DUNS": vData[i].DUNSID,
            "SERcomments": vData[i].SERComments,
            "SSIcomments": vData[i].SSIComments,
            "FSScomments": vData[i].FSSComments,
            "legalStructure": vData[i].LegalStructure,
            "familyTree": vData[i].FamilyTree,
            "businessIndicator": vData[i].BusinessIndicator,
            "dbRating2": vData[i].DbRating2,
            "SSIfailRate": vData[i].SSIFailRate,
            "FSS": Number(vData[i].FSS),
            "FSSRiskIncidencePercentage": vData[i].FSSRiskIncidencePercentage,
            "FSSDBscoreOverride": vData[i].FSSDBscoreOverride,
            "employees": Number(vData[i].Employees),
            "ownershipType": vData[i].OwnershipType,
            "operationYears": Number(vData[i].OperationYears),
            "countriesPresent": Number(vData[i].CountriesPresent),
            "industryCode": vData[i].IndustryCode
        };
        oDataSet.push(oPayload);
            }
            var vSER;
            var vSSI;
            var vDBPaydex;
            var vFSS;
            var vEmp;
            var vYear;
            var vCountry;
             for(var k=0;k<oDataSet.length;k++){
                     if(oDataSet[k].vendorID == "" || oDataSet[k].SER == ""){
                         vBool = true;           
                     }
                     if(isNaN(oDataSet[k].SER) && typeof(oDataSet[k].SER)=== "number"){
                        vSER = true;
                     }
                     if(isNaN(oDataSet[k].SSI) && typeof(oDataSet[k].SSI)=== "number"){
                        vSSI = true;
                     }
                     if(isNaN(oDataSet[k].dbPaydex) && typeof(oDataSet[k].dbPaydex)=== "number"){
                        vDBPaydex = true;
                     }
                    //  if(isNaN(oDataSet[k].FSSpercentage) && typeof(oDataSet[k].FSSpercentage)=== "number"){
                    //     vFSSpercentage = true;
                    //  }
                     if(isNaN(oDataSet[k].FSS) && typeof(oDataSet[k].FSS)=== "number"){
                        vFSS = true;
                     }
                      if(isNaN(oDataSet[k].employees) && typeof(oDataSet[k].employees)=== "number"){
                        vEmp = true;
                     }
                     if(isNaN(oDataSet[k].operationYears) && typeof(oDataSet[k].operationYears)=== "number"){
                        vYear = true;
                     }
                      if(isNaN(oDataSet[k].countriesPresent) && typeof(oDataSet[k].countriesPresent)=== "number"){
                        vCountry = true;
                     }
                     
                      if(oDataSet[k].SSI ===""){
                            oDataSet[k].SSI = null;
                     }
                      if(oDataSet[k].dbRating1 ===""){
                            oDataSet[k].dbRating1 = null;
                     }
                      if(oDataSet[k].dbPaydex ===""){
                            oDataSet[k].dbPaydex = null;
                     }
                      if(oDataSet[k].FSSpercentage ===""){
                            oDataSet[k].FSSpercentage = null;
                     }
                      if(oDataSet[k].DUNS ===""){
                            oDataSet[k].DUNS = null;
                     }
                      if(oDataSet[k].SERcomments ===""){
                            oDataSet[k].SERcomments = null;
                     }
                      if(oDataSet[k].SSIcomments ===""){
                            oDataSet[k].SSIcomments = null;
                     }
                      if(oDataSet[k].FSScomments ===""){
                            oDataSet[k].FSScomments = null;
                     }
                      if(oDataSet[k].legalStructure ===""){
                            oDataSet[k].legalStructure = null;
                     }
                     if(oDataSet[k].familyTree ===""){
                            oDataSet[k].familyTree = null;
                     }
                     if(oDataSet[k].businessIndicator ===""){
                            oDataSet[k].businessIndicator = null;
                     }
                     if(oDataSet[k].dbRating2 ===""){
                            oDataSet[k].dbRating2 = null;
                     }
                     if(oDataSet[k].SSIfailRate ===""){
                            oDataSet[k].SSIfailRate = null;
                     }
                      if(oDataSet[k].FSS ===""){
                            oDataSet[k].FSS = null;
                     }
                      if(oDataSet[k].FSSRiskIncidencePercentage ===""){
                            oDataSet[k].FSSRiskIncidencePercentage = null;
                     }
                      if(oDataSet[k].FSSDBscoreOverride ===""){
                            oDataSet[k].FSSDBscoreOverride = null;
                     }
                      if(oDataSet[k].employees ===""){
                            oDataSet[k].employees = null;
                     }
                     if(oDataSet[k].ownershipType ===""){
                            oDataSet[k].ownershipType = null;
                     }
                     if(oDataSet[k].operationYears ===""){
                            oDataSet[k].operationYears = null;
                     }
                     if(oDataSet[k].countriesPresent ===""){
                            oDataSet[k].countriesPresent = null;
                     }
                     if(oDataSet[k].industryCode ===""){
                            oDataSet[k].industryCode = null;
                     }
                }

                if(vBool != true){
                    if(vSER != true){
                    if(vSSI != true){   
                    if(vDBPaydex != true){ 
                    if(vFSS != true){   
                        if(vEmp!= true){
                            if(vYear!= true){
                                if(vCountry!= true){
            oModel.setUseBatch(true);
            sap.ui.core.BusyIndicator.show(0);
          for(var j=0;j<oDataSet.length;j++){
            oModel.update("/DBRatings(vendorID='"+ vData[j].VendorID+"',DUNS='"+vData[j].DUNSID+"')",oDataSet[j],{
      	        success: function(odata, Response) {
                    if(j--=== 1){
                    MessageBox.success("File Uploaded Successfully");
                      oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();

                    } 
            },

                error : function(odata, Response){
                   if(j--=== 1){
                    MessageBox.error(JSON.parse(odata.responseText).error.message.value); 
                    oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();
                   }
                }

           });
        } 
         }
         else{
                      MessageBox.warning("Countries Present Must be a integer!");
             }

      }
         else{
                      MessageBox.warning("Operational Years Must be a integer!");
             }

        }
         else{
                      MessageBox.warning("Employees Must be a integer!");
                }
            }
               else{
                      MessageBox.warning("FSS Must be a integer!");
                } 
                  }else{
                      MessageBox.warning("DBPaydex Must be a integer!");
                } 
                   } else{
                      MessageBox.warning("SSI Must be a integer!");
                }                
            } 
            else{
                      MessageBox.warning("SER Must be a integer!");
                }      
              }
              else{
                   MessageBox.warning("Enter All the required fields!");
               }

              }
        else if(vKey==="SupplierMasterData"){
                var oDataSet = [];
                   var vBool ;
             for(var i=0;i<vData.length;i++){   
                //  var formattedDateAdded = "";
                //  if(vData[i].DateAdded){
                //     var splitDateAdded = vData[0].DateAdded.split("/");
                //     formattedDateAdded = "20"+splitDateAdded[2]+"-"+splitDateAdded[1]+"-"+splitDateAdded[0];
                //  }
                var oPayload = {
                       "vendorID":vData[i].VendorId,
                        "supplierName": vData[i].SupplierName,
                        "supplierLocation":vData[i].SupplierLocation,
                        "address":vData[i].Address,
                        "criticalSupplier":vData[i].CriticalSupplier,
                        "category":vData[i].Category,
                        "dateAdded":vData[i].DateAdded,
                        "contactfirstName":vData[i].ContactFirstName,
                        "contactlastName":vData[i].ContactLastName,
                        "phone":Number(vData[i].Phone),
                        "email":vData[i].Email,
                        // "riskBand":vData[i].RiskBand,
                        "certifications":vData[i].Certifications,
                        "energyIntensityRatio":vData[i].EnergyIntensityRatio
                   }
                   oDataSet.push(oPayload);
                }
                 var vPhone ;

                  for(var k=0;k<oDataSet.length;k++){
                     if(oDataSet[k].supplierName == "" || oDataSet[k].vendorID == "" ){
                         vBool = true;           
                     }
                     if(isNaN(oDataSet[k].phone)){
                        vPhone = true;
                     }
                     if(oDataSet[k].email ===""){
                            oDataSet[k].email = null;
                     }
                      if(oDataSet[k].address ===""){
                            oDataSet[k].address = null;
                     }
                     if(oDataSet[k].supplierLocation ===""){
                            oDataSet[k].supplierLocation = null;
                     }
                     if(oDataSet[k].criticalSupplier ===""){
                            oDataSet[k].criticalSupplier = null;
                     }
                     if(oDataSet[k].category ===""){
                            oDataSet[k].category = null;
                     }
                      if(oDataSet[k].dateAdded ===""){
                            oDataSet[k].dateAdded = null;
                     }
                      if(oDataSet[k].firstName ===""){
                            oDataSet[k].contactName = null;
                     }
                     if(oDataSet[k].lastName ===""){
                        oDataSet[k].contactName = null;
                 }
                      if(oDataSet[k].certifications ===""){
                            oDataSet[k].certifications = null;
                     }
                     if(oDataSet[k].phone ===""){
                            oDataSet[k].phone = null;
                     }
                     if(oDataSet[k].energyIntensityRatio ===""){
                            oDataSet[k].energyIntensityRatio = null;
                     }
                }

                if(vBool != true){
                   if(vPhone != true){
                oModel.setUseBatch(true);
                var vBool ;
                sap.ui.core.BusyIndicator.show(0);
                for(var j=0;j<oDataSet.length;j++){
                    oModel.update("/SupplierMasterData(vendorID='"+vData[j].VendorId+"',supplierName='"+vData[j].SupplierName+"',category='"+vData[j].Category+"',phone="+vData[j].Phone+",email='"+vData[j].Email+"')",oDataSet[j],{
                        success: function(odata, Response) {
                            if(j--=== 1){
                            //vBool = "true";
                            MessageBox.success("File Uploaded Successfully");
                            oCont.getView().byId("id_Save").setVisible(false);
                            oCont.getView().byId("id_Clear").setVisible(false);
                            sap.ui.core.BusyIndicator.hide(0);
                            oCont.onClear();
                            }
                            
                        // MessageBox.success("File Uploaded Successfully"); 
                        },
                        async : false,
                        error : function(odata, Response){
                            if(j--=== 1){
                            //vBool = "false";
                            MessageBox.error(JSON.parse(odata.responseText).error.message.value); 
                            oCont.getView().byId("id_Save").setVisible(false);
                            oCont.getView().byId("id_Clear").setVisible(false);
                            sap.ui.core.BusyIndicator.hide(0);
                            oCont.onClear();
                            }
                        }

           });
        }
        }
    
            else{
                 MessageBox.warning("Phone Number Must be a integer!");
            }
                }else{
                     MessageBox.warning("Enter All the required fields!");
                }
           
              }else if(vKey==="SupplierExternalMapping"){
                 var oDataSet = [];
                 var vBool ;

            for(var i=0;i<vData.length;i++){     
                var oPayload = {
                        "supplierName":vData[i].SupplierName,
                        // "supplierLocation":vData[i].SupplierLocation,
                        "assessor":vData[i].Assessor,
                        "vendorID":vData[i].VendorID
                  }
                  oDataSet.push(oPayload);
                }

                  for(var k=0;k<oDataSet.length;k++){
                     if(oDataSet[k].supplierName == "" || oDataSet[k].supplierLocation == "" ||
                    oDataSet[k].assessor==="" || oDataSet[k].vendorID===""){
                         vBool = true;           
                     }
                }
                 if(vBool != true){
                  oModel.setUseBatch(true);
                 sap.ui.core.BusyIndicator.show(0);
                for(var j=0;j<oDataSet.length;j++){
                   oModel.update("/SupplierExternalMapping(supplierName='"+vData[j].SupplierName+"',assessor='"+vData[j].Assessor+"',vendorID='"+vData[j].VendorID+"')",
                            oDataSet[j],{
      	        success: function(odata, Response) {
                  if(j--=== 1){
                    MessageBox.success("File Uploaded Successfully"); 
                     oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();
                  }
                },

                error : function(odata, Response){
                  //MessageBox.error(JSON.parse(odata.responseText).error.message.value); 
                    if(j--=== 1){
                MessageBox.error(JSON.parse(odata.responseText).error.message.value);
                 oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();
                    }
                }

           });
        }
           }else {
                    MessageBox.warning("Enter All the required fields!");
                }
        }
              else if(vKey==="EcoVadis_Ratings"){
                var oDataSet = [];
                var vBool;
            for(var i=0;i<vData.length;i++){  
                var oPayload = {
                        "vendorID":vData[i].VendorID,
                        // "supplierLocation": vData[i].SupplierLocation,
                        "overallScore":Number(vData[i].OverallScore),
                        "environmentScore":Number(vData[i].EnvironmentScore),
                        "LBRightsScore":Number (vData[i].LBRightsScore),
                        "ethicsScore":Number(vData[i].EthicsScore),
                        "procurementScore":Number(vData[i].ProcurementScore),
                        "currentStage":vData[i].CurrentStage,
                        "progressStatus":vData[i].ProgressStatus,
                        "requestOutcome":vData[i].RequestOutcome,
                        "sharingStatus":vData[i].SharingStatus,
                        "publishedDate":vData[i].PublishedDate,
                        "expired":vData[i].Expired,
                        "scorecardLink":vData[i].ScorecardLink
                  }
                  oDataSet.push(oPayload);
            }

            var vEnvironmentScore;
                   var vOverallScore;
                   var vProcScore;
                   var vLbrightScore;
                   var vEthScore;

                    for(var k=0;k<oDataSet.length;k++){
                     if(oDataSet[k].vendorId == ""  || oDataSet[k].overallScore == "" ){
                         vBool = true;           
                     }
                     if(isNaN(oDataSet[k].environmentScore) && typeof(oDataSet[k].environmentScore)=== "number"){
                        vEnvironmentScore = true;
                     }
                     if(isNaN(oDataSet[k].overallScore) && typeof(oDataSet[k].overallScore)=== "number"){
                        vOverallScore = true;
                     }

                    
                     if(isNaN(oDataSet[k].LBRightsScore) && typeof(oDataSet[k].LBRightsScore)=== "number"){
                        vLbrightScore = true;
                     }
                     if(isNaN(oDataSet[k].ethicsScore) && typeof(oDataSet[k].ethicsScore)=== "number"){
                        vEthScore = true;
                     }
                    if(isNaN(oDataSet[k].procurementScore) && typeof(oDataSet[k].procurementScore)=== "number"){
                        vProcScore = true;
                     }
                     if(oDataSet[k].environmentScore ===""){
                            oDataSet[k].environmentScore = null;
                     }
                     if(oDataSet[k].LBRightsScore ===""){
                            oDataSet[k].LBRightsScore = null;
                     }
                     if(oDataSet[k].ethicsScore ===""){
                            oDataSet[k].ethicsScore = null;
                     }
                     if(oDataSet[k].procurementScore ===""){
                            oDataSet[k].procurementScore = null;
                     }
                     if(oDataSet[k].currentStage ===""){
                            oDataSet[k].currentStage = null;
                     }
                     if(oDataSet[k].progressStatus ===""){
                            oDataSet[k].progressStatus = null;
                     }
                     if(oDataSet[k].requestOutcome ===""){
                            oDataSet[k].requestOutcome = null;
                     }
                     if(oDataSet[k].sharingStatus ===""){
                            oDataSet[k].sharingStatus = null;
                     }
                     if(oDataSet[k].publishedDate ===""){
                            oDataSet[k].publishedDate = null;
                     }
                     if(oDataSet[k].expired ===""){
                            oDataSet[k].expired = null;
                     }
                     if(oDataSet[k].scorecardLink ===""){
                            oDataSet[k].scorecardLink = null;
                     }
                }

                 if(vBool != true){
                       if(vOverallScore != true){
                        if(vEnvironmentScore != true){  
                            if(vLbrightScore!=true){
                                if(vEthScore!=true){ 
                                    if(vProcScore!=true){  
                oModel.setUseBatch(true);  
                sap.ui.core.BusyIndicator.show(0);
            for(var j=0;j<oDataSet.length;j++){
                    oModel.update("/EcoVadisRatings(vendorID='"+ vData[j].VendorID+"')",oDataSet[j],{
      	        success: function(odata, Response) {
                    if(j--=== 1){
                    MessageBox.success("File Uploaded Successfully"); 
                     oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();
                  }
                },

                async: true,

                error : function(odata, Response){
                   if(j--=== 1){
                MessageBox.error(JSON.parse(odata.responseText).error.message.value);
                      oCont.getView().byId("id_Save").setVisible(false);
                      oCont.getView().byId("id_Clear").setVisible(false);
                      sap.ui.core.BusyIndicator.hide(0);
                      oCont.onClear();
                    }
                }
           });
            }     
            
             }
           else{
                MessageBox.warning("Procurement Score Must be a integer!");
           }
        }
           else{
                MessageBox.warning("Ethics Score Must be a integer!");
            }
        }
            else{
                MessageBox.warning("LB RightScore Must be a integer!");
            }
        }
            else {
                 MessageBox.warning("EnviornmentScore Must be a integer!");
            }

        }
        else{
                 MessageBox.warning("OverallScore Must be a integer!");
            }
            
             }else {
                    MessageBox.warning("Enter All the required fields!");
                }
            
              }
           }
    },

    onClear : function(){
         this.getView().byId("id_SelectRisk").setSelectedKey();  
         this.getView().byId("id_fileUploader").setValue();
         this.getView().getModel().setData();
    },

        onDataExport : function(){
            
            var vKey = this.getView().byId("id_SelectRisk").getSelectedKey();
            var oModel = sap.ui.getCore().getModel("oModel");
            if(vKey !=""){
               if(vKey==="SupplierMasterData"){
                   var oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ","
                }),
                
                models: oModel,
                rows: {
					path: ""
				},

				columns: [{
                    name: "*Vendor ID ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "*Supplier Name ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "Supplier Location ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "Address ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "Critical Supplier ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Category ",	
                    template: {
						content: ""
					}
                },
                 {
                    name: "Date Added ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Contact First Name ",
                    template: {
						content: ""
					}
					
                }, {
                    name: "*Contact Last Name ",
                    template: {
						content: ""
					}
					
				},
                 {
                    name: "Phone ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Email ",
                    template: {
						content: ""
					}
					
                },
                //  {
                //     name: "*Risk Band",
                //     template: {
				// 		content: ""
				// 	}
					
                // },
                 {
                    name: "Certifications ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "EnergyIntensity Ratio ",
                    template: {
						content: ""
					}
					
                }
            ]
			});
			console.log(oExport);
			oExport.saveFile("Supplier_Master_Data").catch(function(oError) {

			}).then(function() {
				oExport.destroy();
			});
               }
        else if(vKey ==="DB_Ratings"){
                    var oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ","
                }),
                
                models: oModel,
                rows: {
					path: ""
				},

				columns: [{
                    name: "*Vendor ID ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "*SER ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "SSI ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "DB Rating1 ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "DB Paydex ",	
                    template: {
						content: ""
					}
                },
                 {
                    name: "FSS Percentage ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "*DUNS ID ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "SER Comments ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "SSI Comments ",
                    template: {
						content: ""
					}
                },
                 {
                    name: "FSS Comments ",
                    template: {
						content: ""
                    },	
                },

                 {
                    name: "Legal Structure ",
                    template: {
						content: ""
                    },	
                },
                
                 {
                    name: "Family Tree ",
                    template: {
						content: ""
				    }	
                },
                {
                    name: "Business Indicator ",
                    template: {
						content: ""
					}
					
                },
                {
                    name: "Db Rating2 ",
                    template: {
						content: ""
					}
					
                },
                {
                    name: "SSI FailRate ",
                    template: {
						content: ""
					}
					
                },
                {
                    name: "FSS ",
                    template: {
						content: ""
					}
					
                },
                {
                    name: "FSS RiskIncidence Percentage ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "FSSDBscore Override ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Employees",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Ownership Type ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Operation Years",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Countries Present ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Industry Code ",
                    template: {
						content: ""
					}
					
                }
            ]
			});
			console.log(oExport);
			oExport.saveFile("Dun and Bradstreet").catch(function(oError) {

			}).then(function() {
				oExport.destroy();
			});   
               }
                else if(vKey ==="EcoVadis_Ratings"){
                    var oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ","
                }),
                
                models: oModel,
                rows: {
					path: ""
				},

				columns: [{
                    name: "*Vendor ID ",
                    template: {
						content: ""
					}
					
				}, 
					
				 {
                    name: "*Overall Score ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "Environment Score ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "LBRights Score ",	
                    template: {
						content: ""
					}
                },
                 {
                    name: "Ethics Score ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Procurement Score ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Current Stage ",
                    template: {
						content: ""
					}
					
                },
                 {
                    name: "Progress Status ",
                    template: {
						content: ""
					}
                },
                 {
                    name: "Request Outcome ",
                    template: {
						content: ""
                    },	
                },

                 {
                    name: "Sharing Status ",
                    template: {
						content: ""
                    },	
                },
                
                 {
                    name: "Published Date ",
                    template: {
						content: ""
				    }	
                },
                {
                    name: "Expired ",
                    template: {
						content: ""
					}
					
                },
                {
                    name: "Scorecard Link ",
                    template: {
						content: ""
					}
					
                },
            ]
			});
			console.log(oExport);
			oExport.saveFile("Ecovadis").catch(function(oError) {

			}).then(function() {
				oExport.destroy();
			});   
               }
               else if(vKey ==="SupplierExternalMapping"){
                    var oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "csv",
					separatorChar: ","
                }),
                
                models: oModel,
                rows: {
					path: ""
				},

				columns: [{
                    name: "Supplier Name ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "*Assessor ",
                    template: {
						content: ""
					}
					
				}, {
                    name: "*Vendor ID ",
                    template: {
						content: ""
					}
					
				}, 
            ]
			});
			console.log(oExport);
			oExport.saveFile("Supplier_Third_Party").catch(function(oError) {

			}).then(function() {
				oExport.destroy();
			});   
               }

            }else{
                MessageBox.warning("Select Supplier Risk");
            }	
        }
            
		});
	});
