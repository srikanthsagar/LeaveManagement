$(function(){

  $("#create-employee").click(function(){
    var html = '<tr>'+
    '<td contentEditable="true" data-name="name"><br></td><td contentEditable="true" data-name="employeeEmail"><br></td>'+
    '<td contentEditable="true" data-name="password"></td>'+
    '<td contentEditable="true" data-name="managerEmail"><br></td><td contentEditable="true" data-name="role"><br></td><td><br></td>'+
    '<td><button id="save-employee">Save</button></td></tr>';
    $("#create-employee-table").append(html);
  });

  $("#create-employee-table").on("click", "#save-employee", function(e){
      var mandatory = ["name", "employeeEmail", "password"];
      var data = getEmployeeRecord($(this), mandatory);
      if(data){
        console.log(data);
        $.ajax({
          url : "/api/user",
          type : "POST",
          data : data,
          success : function(resp){
             alert(resp.msg);
          }
        });
      }
      else{
        alert("All fields are mandatory");
      }
  });

  function getEmployeeRecord($this, mandatory){
    var currRecord = $this.parents("tr");
    var err = false, data = {};
    currRecord.find("td").each(function(e){
      if($(this).index() < 5){
        if(!$(this).text() && (mandatory.indexOf($(this).data("name")) >= 0) ){
          err = true;
        }
        else{
          data[$(this).data("name")] = $(this).text();
        }
      }
    });
    if(err)
       return false;
    else {
       return data;
    }
  }

  $("#create-employee-table").on("click", ".edit-record", function(){
    var currRecord = $(this).parents("tr");
    var $this = $(this);
    if($(this).text() == "Edit"){
      currRecord.find("td[data-name='name']").attr("contentEditable", "true").focus();
      currRecord.find("td[data-name='managerEmail']").attr("contentEditable", "true");
      currRecord.find("td[data-name='role']").attr("contentEditable", "true");
      $(this).text("Save");
    }
    else if($(this).text() == "Save"){
      var mandatory = ["name"];
      var data = getEmployeeRecord($(this), mandatory);
      if(data){
        $.ajax({
          url : "/api/user",
          type : "PUT",
          data : data,
          success : function(resp){
             alert(resp.msg);
             if(resp.sts){
               currRecord.find("td[data-name='name']").attr("contentEditable", "false");
               currRecord.find("td[data-name='managerEmail']").attr("contentEditable", "false");
               currRecord.find("td[data-name='role']").attr("contentEditable", "false");
               $this.text("Edit");
             }
          }
        });
      }
      else{
        alert(mandatory +" mandatory");
      }
    }

  });

  $("#create-employee-table").on("click", ".delete-record", function(){
    var currRecord = $(this).parents("tr");
      var del = confirm("Are you sure want to delete ? ");
      var employeeEmail = currRecord.find("td[data-name='employeeEmail']").text();
      if(del){
          $.ajax({
            url : "/api/user",
            type : "DELETE",
            data : {
              employeeEmail : employeeEmail
            },
            success : function(resp){
               alert(resp.msg);
               if(resp.sts){
                 currRecord.remove();
               }
            }
          });
      }
  });


  $("#leave-application-form").submit((e)=> {
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

    fd.append("employeeEmail");
    fd.append("managerEmail");

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
