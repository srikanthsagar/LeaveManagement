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
  var i, pageNumHtml;
  var path = window.location.pathname;
  console.log(path);
  if(path != "/users/" && path != "/users")
     return false;
  var pageDetails = $("#total-employees");   
  var total = pageDetails.data("count");
  var field = pageDetails.data("field");
  var sortType = pageDetails.data("sort");
  var perPage = 10 ;
  var pageNo = pageDetails.data("page");
  var numOfPages = total / perPage ;
  if(total%perPage > 0)
    numOfPages++;

  for(i=1; i <= numOfPages; i++){
      pageNumHtml = '<a class="page-num '+(i==pageNo ? 'active' : '')+'" href="/users?pageNo='+i ;
      if(field)
        pageNumHtml += '&field='+ field ;
      if(sortType)
        pageNumHtml += '&sort='+ sortType ;
      
      pageNumHtml += ' ">'+i+'</a>';     
      
      $("#pagination").append(pageNumHtml);
  }
}

});
