function childrenNames() {
    function MakeRequest(query) {
        var serverUrl = Xrm.Page.context.getClientUrl(); // My organization root url 
        var oDataEndpointUrl = serverUrl + "/XRMServices/2011/OrganizationData.svc/"; // To locate and retrieve data 
        oDataEndpointUrl += query;
        var service = GetRequestObject();

        if (service != null) {
            service.open("GET", oDataEndpointUrl, false);
            service.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            service.setRequestHeader("Accept", "application/json, text/javascript, */*");
            service.send(null);
            var retrieved = JSON.parse(service.responseText).d;
            var results = new Array();
            for (var i = 0; i < retrieved.results.length; i++) {
                results.push(retrieved.results[i]);
            }
            return results;
        }
        return null;
    }

    function GetRequestObject() {
        if (window.XMLHttpRequest) {
            return new window.XMLHttpRequest;
        } else {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP.3.0");
            } catch (ex) {
                return null;
            }
        }
    }

 SDK.REST.retrieveMultipleRecords("new_azamorii_2018_child", "?$select=new_FirstName", onSuccess);
  function onSuccess(result) {
    var recordResult = result[0];
    alert(recordResult);
  }


  // Xrm.WebApi.retrieveMultipleRecords("new_azamorii_2018_child", "?$select=new_FirstName").then(
  //   function success(result) {
  //     for (var i = 0; i < result.entities.length; i++) {
  //       console.log(result.entities[i]);
  //     }
  //   },
  //   function (error) {
  //     console.log(error.message);
  //    
  //   }
  // );

