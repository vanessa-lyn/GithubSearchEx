/*jslint browser: true, devel: true, white: true */
/*global $, jQuery, alert*/

$(function ($) {

    "use strict";

    //adding the css to the page here on the requirement to not edit index.html
    $('head').append("<link href='styles.css' rel='stylesheet' type='text/css'>");
    /////////////////////

    var DEBUG = true
        , gitKeyword
        , jsonData
        , saved = false
        , resultContainer = $('#results')
        , search = $('#search')
        , searchMessage = 'Input Github Search Term and Click Enter'
        , cachedObj = {}
        ;

    function grabNewKeywordData(newKey) {
        $.ajax({
            url: "https://api.github.com/legacy/repos/search/" + newKey,
            success : displayData
        });
    }

    function displayData(data) {
        if (saved === false) {
            if (DEBUG) { console.log('unsaved'); }
            cachedObj[gitKeyword] = data;
        }

        jsonData = data.repositories;

        if (DEBUG) { console.log(jsonData.length); }

        var currentData = "<ul>";
        currentData += "<li><b>Author / Repo</b></li>";

        $.each(jsonData, function (index) {
            // $('<li/>', {
            //     text:  
            // });
            currentData += "<li><a href='#' index='" + index + "'>";
            currentData += jsonData[index].owner;
            currentData += " / ";
            currentData += jsonData[index].name;
            currentData += "</a></li>";
        });

        currentData += "</ul>";
        resultContainer.html(currentData);
    }

    function checkKeyword(currentKeyword) {
        if (cachedObj[currentKeyword]) {
            if (DEBUG) { console.log('exists'); }
            saved = true;
            //display data stored from object
            displayData(cachedObj[currentKeyword]);
        } 
        else {
            saved = false;
            grabNewKeywordData(currentKeyword); 
        }
    }

    function initEventListeners() {
        search.attr('value', searchMessage);

        search.on('focus', function () {
            search.attr('value', ' ');
        });
        search.on('blur', function () {
            if(search.attr('value') === ' ') {
                search.attr('value', searchMessage);
            }
        });

        search.bind('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                gitKeyword = $('#search').val();
                resultContainer.html('');
                checkKeyword(gitKeyword);
            }
        });

        resultContainer.on({
            click: function () {
                var current = $(this).attr('index')
                    , details = "Language: " + jsonData[current].language + "\n";

                details += "Followers: " + jsonData[current].followers + "\n";
                details += "Url: " + jsonData[current].url + "\n";
                details += "Description: " + jsonData[current].description;
                alert(details);
            }
        }, 'li a');
    }
    
    initEventListeners();

});