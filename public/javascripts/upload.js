//http://markdawson.tumblr.com/post/18359176420/asynchronous-file-uploading-using-express-and-node-js

$(document).ready(function() {

    //status('Choose a file :)');

    // Check to see when a user has selected a file
    /*
    var timerId;
    timerId = setInterval(function() {
        if($('#userInput').val() !== '') {
            clearInterval(timerId);

            $('#uploadForm').submit();
        }
    }, 500);*/

    $('#uploadForm').submit(function() {
       // status('uploading the file ...');
        
        $(this).ajaxSubmit({
            // Note: can't use JSON otherwise IE8 will pop open a dialog
            // window trying to download the JSON as a file
            dataType: 'text',
            
            error: function(xhr) {
               // status('Error: ' + xhr.status);
            },
            
            success: function(response) {
              try {
                  response = $.parseJSON(response);
              }
              catch(e) {
                 // status('Bad response from server');
                  return;
              }

              if(response.error) {
                // status('Problem writing file');
                  return;
              }

              var imageUrlOnServer = response.path;
              $('#back').submit();
              
             // status('Success, file uploaded.');// to: ' + imageUrlOnServer);
              //$('<img/>').attr('src', imageUrlOnServer).appendTo($('body'));
            }
        });
        
        // Have to stop the form from submitting and causing
        // a page refresh - don't forget this
        return false;
    });

    function status(message) {
        $('#status').text(message);
    }
});
