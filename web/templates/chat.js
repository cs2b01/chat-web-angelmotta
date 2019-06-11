function whoami(){
    $.ajax({
        url:'/current',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            alert(JSON.stringify(response));
            var name = response['name']+" "+response['fullname'];
            $('#cu_name').html("Nombre: "+name);
            $('#cu_username').html("Username: " + response['username'])
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

function allusers(){
    $.ajax({
        url:'/users',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            //alert(JSON.stringify(response));
            var i = 0;
            $.each(response, function(){
                //f = '<div class="alert" onclick=alert('+response[i].id+') >';
                f = '<div class="alert" onclick=showMessages('+response[i].id+') >';
                f = f + response[i].username;
                f = f + '</div>';
                i = i+1;
                $('#allusers').append(f);
            });
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

function allmessages(){
    $.ajax({
        url:'/users',
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            //alert(JSON.stringify(response));
            var i = 0;
            $.each(response, function(){
                f = '<div class="alert" onclick=alert('+response[i].id+') >';
                f = f + response[i].username;
                f = f + '</div>';
                i = i+1;
                $('#allusers').append(f);
            });
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
}

function showMessages(id_other_user){
    //Serializing
    var other_id = JSON.stringify({
        "id": id_other_user
    });
    console.log(other_id)
    $.ajax({
        url:'/showmessages',
        type:'POST',
        contentType:'application/json',
        data : other_id,
        dataType:'json',
        success: function(response){
            //alert(JSON.stringify(response));
            $('#allmessages').html("");
            for(var i in response){
                //console.log(response[i].content)
                messages = '<div>'+ response[i].content + '</div>'
                $('#allmessages').append(messages);
            }
            //$('#action').html(response['statusText']);
        },
        error: function(response){
                alert("Error: no messages");
                //$('#action').html(response['statusText']);
        }
    });
}
