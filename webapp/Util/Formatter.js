jQuery.sap.declare("ns.zsupplierriskmaster.Util.Formatter");
ns.zsupplierriskmaster.Util.Formatter = {
   
    fnDateFormat : function(vValue){
            
        // var oDate = sap.ui.core.format.DateFormat.getDateTimeInstance({
		// 		pattern : "yyyy-MM-dd"  
		// 	}) ;
        // var vDate = oDate.format(vValue);
        if(vValue){
            var vDate =  vValue;
        }
         return (vDate.substr(6,2) +"-"+vDate.substr(4,2)+"-"+vDate.substr(0,4));
        }

}