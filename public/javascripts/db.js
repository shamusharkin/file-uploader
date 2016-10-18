$('.upload-btn').on('click', function() {

    var http = new XMLHttpRequest();
    var url = "/db";
    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send();

    // console.log('Hit the button')
    // var formData = {};
    // $.ajax({
    //     url: '/db',
    //     type: 'POST',
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     success: function(data) {
    //         console.log('Connected successful!\n' + data);
    //     },
    //     xhr: function() {
    //         console.log('Creating Http Request');
    //
    //         // create an XMLHttpRequest
    //         var xhr = new XMLHttpRequest();
    //         xhr.send();
    //         return xhr;
    //     }
    // });
});
