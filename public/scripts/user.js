$(function(){

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
