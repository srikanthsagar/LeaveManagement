$(function(){

 /* will get all users on select employeeId in updateuser page */
 $("#update-employee-form").on("change", "select[name='employeeId']", function(e){
    var id = $(this).val();
    $.ajax({
      url : "/api/user",
      type : "get",
      data : {
        employeeId : id
      },
      success : function(resp){
         $("#msg").text(resp.msg);
         if(resp.sts){
           var data = resp.data[0];
           $("#update-employee-form").find("[name='name']").val(data.name);
           $("#update-employee-form").find("[name='password']").val(data.password);
           $("#update-employee-form").find("[name='managerId']").val(data.managerId);
           $("#update-employee-form").find("[name='role']").val(data.role);
           $("#update-employee-form").find("[name='phone']").val(data.phone);
         }
      }
    });
 });

$("#employee-table").on("click", ".delete-user", function(e){
  e.preventDefault();
  var del = confirm("Are you sure want to delete ?");
  if(del){
    window.open($(this).attr("href"), "_self");
  }
});

makePagination();

function makePagination(){
  var i;
  var path = window.location.pathname;
  if(path != "/users")
     return false;
  var total = $("#total-employees").data("count");
  var perPage = 10 ;
  var pageNo = $("#total-employees").data("page");
  var numOfPages = total / perPage ;
  if(total%perPage > 0)
    numOfPages++;

  for(i=1; i <= numOfPages; i++){
      $("#pagination").append('<a class="page-num '+(i==pageNo ? 'active' : '')+'" href="/users?pageNo='+i+'">'+i+'</a>');
  }
}


});
