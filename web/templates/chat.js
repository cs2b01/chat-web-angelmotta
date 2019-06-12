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

function currentId(){
    var result_id="";
    $.ajax({
        url:'/current',
        async: false,
        type:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(response){
            //alert(JSON.stringify(response));
            result_id = response['id'];
            console.log(result_id);
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    });
    return result_id;
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
    console.log(id_other_user);
    $('#enviarMsg').on("click", function () {sendMessage(id_other_user);});
    //$("#enviarMsg").off('click').on('click', sendMessage(id_other_user))
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

function sendMessage(other_id){
    console.log(other_id);
    msg = $('#input_message').val();
    $('#input_message').val('');
    var message = JSON.stringify({
        "user_to_id": other_id,
        "content": msg
    });
    $.ajax({
        url:'/sendmessage',
        type:'POST',
        contentType:'application/json',
        data : message,
        dataType:'json',
        success: function(){
            alert("Mensaje enviado");
            alert(JSON.stringify(response));
            //$('#allmessages').html("");
            //$('#action').html(response['statusText']);
        },
        error: function(response){
            alert("Error al enviar Mensaje");
            alert(JSON.stringify(response));
            //alert("Error: Mensaje no enviado");
            //$('#action').html(response['statusText']);
        }
    });
}