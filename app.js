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

    function initEventListeners() {
        search.attr('value', searchMessage)
        .on('focus', function () {
            search.attr('value', ' ');
        })
        .on('blur', function () {
            if(search.attr('value') === ' ') {
                search.attr('value', searchMessage);
            }
        })
        .bind('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                gitKeyword = $('#search').val();
                resultContainer.html('');
                checkKeyword(gitKeyword);
            }
        });
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

    function grabNewKeywordData(newKey) {
        //ajax request to github's api
        $.ajax({
            url: "https://api.github.com/legacy/repos/search/" + newKey,
            success : displayData
        });
    }
    
    function displayData(data) {
        if (saved === false) {
            if (DEBUG) { console.log('unsaved'); }
            //cache data if this is a new search result
            cachedObj[gitKeyword] = data;
        }

        jsonData = data.repositories;
        if (DEBUG) { console.log(jsonData.length); }

        //create the header for results
        displayResultsHeading();

        //if no results
        if (jsonData <= 0) {
            showNoResultsMessaging();
        } 
        //else print out the results
        else {
            generateResultsList();
        }
    }
    
    //display number of results on page
    function displayResultsHeading() {
        var $resultsHeader = $('<h2/>', {
        text: jsonData.length + ' Results for "' + gitKeyword + '"'
        }).prependTo(resultContainer);
    }

    function showNoResultsMessaging(){
        if (DEBUG) { console.log('no data message'); }
        //add no results message
        var $noResults = $('<p/>', {
            text: 'Try a different search term.'
        }).appendTo(resultContainer);
    }

    function generateResultsList(){
        var $resultsList = $('<ul/>', {'class': 'resultsList'})
            .append( $('<li/>', { 'class': 'list-header',  text: 'Author / Repo' }) );

        $.each(jsonData, function (index) {
            $resultsList.append ($('<li/>', {
                text: jsonData[index].owner + ' / ' + jsonData[index].name,
                'class': 'listing',
                name: index,
                click: showListingDetails
            }) );
        });

        resultContainer.append($resultsList);
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

    initEventListeners();

});