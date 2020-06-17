
(function() {
	var arr = []
	
    const tabStorage = {};
    const networkFilters = {
        urls: [
        	// implement whitelist here in format "*.[domain]/*", "*.[domain2]/*", etc
        ]
    };

    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }

   console.log(arr.length)

   const testFunction = () => {
          

               	var request = {
               		url: details.url,
               		method: details.method,
               		requestHeaders: details.requestHeaders,
               		requestBody: details.requestBody
               	}

               	arr.push(request)

   }
    
   
   if (!arr.includes(details.url)) {
   		testFunction(details)
   		} else {
		return
    	 }

        tabStorage[tabId].requests[requestId] = {
            requestId: requestId,
            url: details.url,
            startTime: details.timeStamp,
            status: 'pending'
        };
        console.log(tabStorage[tabId].requests[requestId])
    }, networkFilters, ["requestHeaders", "extraHeaders"]);



     chrome.webRequest.onHeadersReceived.addListener((details)=> {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const sendHeaders = () => {

   	 	var mimeType = ""
        			 for (var i = 0; i < details.responseHeaders.length; ++i) {
        			 	if(details.responseHeaders[i].name.toLowerCase() === "content-type") {
        			 		mimeType = details.responseHeaders[i].value
        			 	}
        			 }

        			
        	let responseObj = {
        		url: details.url,
        		status: details.statusCode,
        		mime: mimeType
        	}
        		for (i=0; i < arr.length; i++) {
        			if (arr[i].url == details.url) {
        				Object.assign(arr[i], responseObj)
        				if (arr[i].mime != "") {
        				console.log(JSON.stringify(arr[i]))
        			}
        			}
        		}

 			 		}

        		if (arr.length >= 500) {
        					let xhr = new XMLHttpRequest();
               				xhr.open("POST", /* <your-server-endpoint-here> */, [true])
               				xhr.setRequestHeader("Content-Type", "application/json")
               				xhr.send(JSON.stringify(arr))
               				arr.length = 0
               				return

        }

        sendHeaders()

        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,           
            status: 'error',
        });
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters,  ["responseHeaders", "extraHeaders"]);



    chrome.webRequest.onErrorOccurred.addListener((details)=> {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,           
            status: 'error',
        });
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.tabs.onActivated.addListener((tab) => {
        const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
        if (!tabStorage.hasOwnProperty(tabId)) {
            tabStorage[tabId] = {
                id: tabId,
                requests: {},
                registerTime: new Date().getTime()
            };
        }
    });
    chrome.tabs.onRemoved.addListener((tab) => {
        const tabId = tab.tabId;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        tabStorage[tabId] = null;
    });
}());
