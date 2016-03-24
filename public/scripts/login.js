$(function(){

  $("#login-form").submit((e)=> {
     e.preventDefault();
     var employeeId = $(this).find("input[name='employeeId']").val();
     var password = $(this).find("input[name='password']").val();
     if(employeeId && password){
       $.ajax({
         url : "/login",
         type : "POST",
         data : {
           employeeId : employeeId,
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
