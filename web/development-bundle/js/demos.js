onmessage = function (event) {  
    var test = {
        "data1": "value1",
        "data2": "value2"
    }
    for (var i = 0; i < event.data; i++) {  
        if (0 === i % 10 ) {
            postMessage(i);  
        }
    }
};  