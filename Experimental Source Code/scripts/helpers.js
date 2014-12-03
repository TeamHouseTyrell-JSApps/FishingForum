$.ajaxSetup({
    headers: {
        "X-Parse-Application-Id": "qMgTURpDZUZXbS8OyDfvICSCMS5YkkpuMn9vIlco",
        "X-Parse-REST-API-Key": "KOWQQ2S9fB5Hx7bNjiv4bskSQrSuZvSniHUpF4Bb",
        "X-Parse-Session-Token": getCookie("sessionToken")
    }
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function logOut(){
    document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem("sessionToken");
}

function getUserByObjectId(objectId){
    $.ajax({
        method: "GET",
        url: 'https://api.parse.com/1/classes/_User/' + objectId,
        success: function(data){
            console.log(data);
        },
        error: errorReport
    });
}

function getTags(){
    var tags = [];
    $.ajax({
        method: "GET",
        async:false,
        url: 'https://api.parse.com/1/classes/tag/',
        success: function(data){
            data.results.forEach(function(item){
                tags.push({"name": item.title, "objectId":item.objectId, "counter": item.counter});
            });
            return (tags);
        },
        error: errorReport
    });
    return tags;
}

function getTagByObjectId(objectId){
    $.ajax({
        method: "GET",
        url: 'https://api.parse.com/1/classes/tag/' + objectId,
        success: function(data){
            console.log(data);
        },
        error: errorReport
    });
}

function getTagsByPopularity(){
    var tags = [];
    $.ajax({
        method: "GET",
        async:false,
        url: 'https://api.parse.com/1/classes/tag/?order=-counter,title',
        success: function(data){
            data.results.forEach(function(item){
                tags.push({"name": item.title, "objectId":item.objectId, "counter": item.counter});
            });
            return (tags);
        },
        error: errorReport
    });
    return tags;
}

function updateTagCount(tagId, currentCount){
    $.ajax({
        method: "PUT",
        async:true,
        url: 'https://api.parse.com/1/classes/tag/' + tagId,
        contentType: "application/json",
        data: JSON.stringify({
            "counter":(currentCount+1)
        }),
        error: errorReport
    });
}


