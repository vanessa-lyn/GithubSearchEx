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

        //create a header and display the number of results
        var $resultsHeader = $('<h2/>', {
            text: jsonData.length + ' Results for "' + gitKeyword + '"'
        }).prependTo(resultContainer);
        
        // //if no results
        if (jsonData <= 0) {
            if (DEBUG) { console.log('no data message'); }
            //add no results message
            var $noResults = $('<p/>', {
                text: 'Try a different search term.'
            }).appendTo(resultContainer);
        } 
        //else print out the results
        else {
            var $resultsList = $('<ul/>', {'class': 'resultsList'})
            .append( $('<li/>', { 'class': 'list-header',  text: 'Author / Repo' }) );

            $.each(jsonData, function (index) {
                $resultsList.append ($('<li/>', {
                    text: jsonData[index].owner + ' / ' + jsonData[index].name,
                    'class': 'listing',
                    name: index,
                    click: showListingDetails
                }) );
            })

            resultContainer.append($resultsList);
        }
    }

    function showListingDetails() {
        var current = $(this).attr('name')
        , details = "Language: " + jsonData[current].language + "\n";

        if (DEBUG) { console.log(jsonData[current]); }

        details += "Followers: " + jsonData[current].followers + "\n";
        details += "Url: " + jsonData[current].url + "\n";
        details += "Description: " + jsonData[current].description;
        alert(details);
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
    }
    
    initEventListeners();

});