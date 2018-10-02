function childrenNames() {
    function MakeRequest(query) {
        var serverUrl = Xrm.Page.context.getClientUrl(); 
        var oDataEndpointUrl = serverUrl + "/XRMServices/2011/OrganizationData.svc/"; 
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

    var parentId = Xrm.Page.data.entity.getId();

    SDK.REST.retrieveMultipleRecords("new_azamorii_2018_child", "$filter=new_Parent/Id eq guid'" + parentId + "'&$select=new_name", onSuccess, errorHandler, onComplete);
    function onSuccess(result) {
        result;

        var arr = [];
        for (var i = 0; i < result.length; i++) {
            arr.push(result[i].new_name);
        }

        Xrm.Page.getAttribute("new_childrennames").setValue(arr.join(", "));
    }

    function errorHandler(error) {
        alert(error.message);
    }

    function onComplete() {
    }
}

