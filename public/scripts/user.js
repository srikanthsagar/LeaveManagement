$(function(){

  $("#create_employee_form").submit((e)=> {
     e.preventDefault();
     var err = false ;
     var fd = new FormData();

    var formData = $('form').serializeArray();
    $.each(formData,function(key,input){
        if(input.name == "employeeId" || input.name == "password" || input.name == "name"){
          if(!input.value){
            err = true;
            alert("Id, Password & Name mandatory");
            return false;
          }
        }
        fd.append(input.name,input.value);
    });

     if(!err){
       $.ajax({
         url : "/api/user",
         type : "POST",
         data : fd,
         success : function(resp){
            alert(resp.msg);
         }
       });
     }
  });

  $("#leave_application_form").submit((e)=> {
     e.preventDefault();
     var err = false ;
     var fd = new FormData();

    var formData = $('form').serializeArray();
    $.each(formData,function(key,input){
          if(!input.value){
            err = true;
            alert("All fields mandatory");
            return false;
          }
        fd.append(input.name,input.value);
    });

     if(!err){
       $.ajax({
         url : "/api/leave",
         type : "POST",
         data : fd,
         success : function(resp){
            alert(resp.msg);
         }
       });
     }
  });



});
