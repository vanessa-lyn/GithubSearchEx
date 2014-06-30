$(function($){
  $('body').append('sdfsd');
  $('body').append("<script src='jquery.cookie.js' type='text/javascript'></script>");

  var gitKeyword;
  var jsonData;
  var saved = false;
  var resultContainer = $('#results');
  var search = $('#search');
  var cachedObj = {};
  //var storedData = $.cookie('storedData')
  // if($.cookie('storedData')){
  //   alert($.cookie('storedData'));
  // }


  function checkKeyword(currentKeyword){
      if(cachedObj[currentKeyword]){
        console.log('exists');
        saved = true;
        //display data stored from object
        displayData(cachedObj[currentKeyword]);
      }
      else{
        saved = false;
        grabNewKeywordData(currentKeyword); 
      }  
  }

  function grabNewKeywordData(newKey){
     $.ajax({
        url: "https://api.github.com/legacy/repos/search/"+newKey, 
        success : displayData
    })
  }

  function displayData(data) {
    if(saved === false){
      console.log('unsaved');  
      cachedObj[gitKeyword] = data;
      //$.cookie('storedData', cachedObj);

    }
    jsonData = data.repositories;

    console.log(jsonData.length);
    var currentData = "<ul>";
    currentData += "<li><b>Owner / Name</b></li>";
   
    $.each(jsonData, function(index){
        currentData += "<li><a href='#' index='"+index+"'>";
        currentData += jsonData[index].owner;
        currentData += " / ";
        currentData += jsonData[index].name;
        currentData += "</a></li>";
    });
    currentData += "</ul>";
    resultContainer.html(currentData);
  }

  search.bind('keypress', function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) {
        gitKeyword = $('#search').val();
        resultContainer.html('');
        checkKeyword(gitKeyword);
      }  
  });

  resultContainer.on({
        click: function(){
          var current = $(this).attr('index')
          var details = "Language: "+jsonData[current].language+"\n";
          details += "Followers: "+jsonData[current].followers+"\n";
          details += "Url: "+jsonData[current].url+"\n";
          details += "Description: "+jsonData[current].description;
          alert(details);
        }
    },'li a');

  
  

});


