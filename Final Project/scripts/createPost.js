require(['modules/headersWithSession'], function (headers) {
    $(document).ready(function(){
        headers;

//Actual Post Creating
        var createdPostData;
        $( "#postForm" ).click(function() {
            debugger;
            var title = $("#postTitle").val();
            var content = $("#postContent").val();
            var status = $( "#category option:selected").attr('id');
            var category = $("#category").val();
            var tags = $("#postTags").val();

            createPost(title, content, status).done(function (data) {
                var createdPostData = data;
                debugger;
                createPostTags(tags, createdPostData.objectId).done(function (data) {
                    window.location.href = '#/forum/' + createdPostData.objectId;
                });

            });


        });

        var categories = getCategories();
        categories.forEach(function(category){
            $("#category").append("<option id='" + category.objectId + "' value='" + category.name + "'>" + category.name + "</option>")
        });

        function createPostTags(tags, objId){
            var tagMetaId = "";
            tags = tags.split(", ");

            tags.forEach(function(tag){
                var tempTag = getTagByName(tag);
                if (tempTag.length != 0){
                    tagMetaId = tempTag[0].objectId;
                    updateTagCount(tempTag[0].objectId, tempTag[0].counter);
                    console.log(tempTag[0].objectId + " " + tempTag[0].counter);
                } else {
                    tagMetaId = createTag(tag);
                }
                createTagMeta(tagMetaId, objId);
            });
            $('#loaderImg').fadeOut();
        }


        function createPost(title, content, status, category){
			var userId = localStorage.getItem("loggedUserId");
            var acl = {};
			acl[userId] = { "read": true, "write": true };
            acl["*"] = { "read":true};
			return $.ajax({
                method: "POST",
                async: false,
                url: 'https://api.parse.com/1/classes/question',
                contentType: "application/json",
                data: JSON.stringify({
                    "title":title,
                    "content":content,
                    "status":{
                        __type:"Pointer",
                        "className":"QuestionRole",
                        "objectId":"JOnNcZIoSE"
                    },
                    "category":
                    {
                        "__type":"Pointer",
                        "className":"category",
                        "objectId":status
                    },
                    "author":
                    {
                        "__type":"Pointer",
                        "className":"_User",
                        "objectId":localStorage.getItem("loggedUserId")
                        // TODO: unquote the real code
                        //hardcoded for test purposes
                        //"objectId":"rLS3fzUsH5"
                    },
                    "rating":0,
                    "viewCounter":0,
                    "ACL":acl
                })
            });
        }

        function getCategories(){
            var categories = [];
            $.ajax({
                method: "GET",
                async:false,
                url: 'https://api.parse.com/1/classes/category/',
                success: function(data){
                    data.results.forEach(function(category){
                        categories.push({"name": category.name, "objectId":category.objectId});
                    });
                    return (categories);
                },
                error: errorReport
            });
            return categories;
        }

        function createTagMeta(tagId, postId){
            $.ajax({
                method: "POST",
                url: 'https://api.parse.com/1/classes/tagsMeta',
                contentType: "application/json",
                data: JSON.stringify({
                    "question":{
                        "__type":"Pointer",
                        "className":"question",
                        "objectId":postId
                    },
                    "tag":{
                        "__type":"Pointer",
                        "className":"tag",
                        "objectId":tagId
                    }
                }),
                error: errorReport
            });
        }

        function getTagByName(name){
            var tags = [];
            $.ajax({
                method: "GET",
                async:false,
                url: encodeURI('https://api.parse.com/1/classes/tag/?where={"title":"' + name + '"}'),
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

        function createTag(name){
            var res;
            $.ajax({
                method: "POST",
                async:false,
                url: 'https://api.parse.com/1/classes/tag',
                contentType: "application/json",
                data: JSON.stringify({
                    "title":name,
                    "counter":1
                }),
                success: function(data) {
                    res = data.objectId;
                },
                error: errorReport
            });
            return res;
        }

        function errorReport(err){
            console.log(err);
        }
    })

    function updateTagCount(tagId, currentCount){
        $.ajax({
            method: "PUT",
            async:false,
            url: 'https://api.parse.com/1/classes/tag/' + tagId,
            contentType: "application/json",
            data: JSON.stringify({
                "counter":(currentCount+1)
            }),
            error: function (er) {
                console.log(er)
            }
        });
    }
})




