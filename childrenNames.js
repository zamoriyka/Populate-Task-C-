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

    var lookupObject = Xrm.Page.getAttribute("new_childrennames");
    if (lookupObject != null) {
        var lookUpObjectValue = lookupObject.getValue();
        if (lookUpObjectValue != null) {
            var lookupid = lookUpObjectValue[0].id;
        }
    }

    var selectQuery = "/new_azamorii_2018_childSet?&$filter=new_azamorii_2018_childId eq guid'" + lookupid + "' &$select=new_name";

    var oDataResult = null;
    oDataResult = MakeRequest(selectQuery);

    }
