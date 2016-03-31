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

$("#employee-table").on("click", "th a", function(e){
    e.preventDefault();
    var sortType = 1; //ascending
    if($(this).hasClass("sort-down"))
       sortType = 0; //descending
    var columnNum = $(this).parents("th").index() + 1;
    
    sortTable(columnNum, sortType);      
    
    $("#employee-table").find("th a").removeClass("active");
    $(this).addClass("active");
           
});

function sortTable(columnNum, sortType){
    var data = [];
    var dataWithIndex = {};
    var trNum, tr, num = false;
    $("#employee-table").find("td:nth-child("+columnNum+")").each(function(i, e){
        var val = $(this).data("val");
        if($(this).data("name") == "phone"){
            val = parseInt(val);
            num = true;
        }
        else if(typeof val == "number"){
            val += '';
        }
        data.push(val);
        dataWithIndex[val] = i + 1 ;        
    });
    
    if (num) {
        if(sortType)
           data.sort(function(a, b) { return a - b });
        else
           data.sort(function(a, b) { return b - a });
    }
    else {
        data.sort();
        if (!sortType)
            data.sort().reverse();
    }
    
    $.each(data, function(i, v){
       trNum = dataWithIndex[v];
       tr = $("#employee-table").find("tr").eq(trNum).clone();
       tr.addClass("hideThis");
       $("#employee-table").append(tr);
    });
    
    $("#employee-table").find("tr:not(:first-child)").not(".hideThis").remove();
    $("#employee-table").find("tr").removeClass("hideThis");
}

});
