$(function(){

  $("#login-form").submit((e)=> {
     e.preventDefault();
     var employeeEmail = $(this).find("input[name='employeeEmail']").val();
     var password = $(this).find("input[name='password']").val();
     if(employeeEmail && password){
       $.ajax({
         url : "/login",
         type : "POST",
         data : {
           employeeEmail : employeeEmail,
           password : password
         },
         success : function(resp){
            if(resp.sts)
               window.open("/home", "_self");
         }
       });
     }
     else {
       alert("Id && password mandatory.");
     }
  });

});
