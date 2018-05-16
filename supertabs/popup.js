
/*
 Copyright (c) 2018, Hamed MP
 @thehamedmp

 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL EVAN JEHU BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


// Search the tabs when entering the search keyword.
$(function() {
  $('#search').keyup(function() {
     $('#tabs').empty();
     dumpTabs($('#search').val())
  });
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        
    }
});

function dumpTabs(query){
  var tabs = chrome.tabs.query({},function(tabs){
    // console.log(tabs);
    populateTabs(tabs, query);
  });

}

function populateTabs(tabs, query){
  $('#tabs').append(parseTabs(tabs, query));
}

function parseTabs(tabs, query){
  var list = $('<ul>');
  var i;
  for (i = 0; i < tabs.length; i++) {
    list.append(dumpNode(tabs[i], query));
  }
  return list;
}

function dumpNode(tab, query) {
  if (tab.title) {
    if (query && String(tab.title.toUpperCase() + tab.url.toUpperCase()).indexOf(query.toUpperCase()) == -1) {
      return $('<span></span>');
    }

    var anchor = $('<a>');
    anchor.attr('href', tab.url);
    anchor.attr('style', 'margin-left: 15px; display:inline-block;');
    anchor.text(tab.title.substring(0, 27) + ' ...');
    /*
     * When clicking on a tabs in the extension, a new tab is fired with
     * its url.
     */
    anchor.click(function() {
      chrome.tabs.update(tab.id, {active: true});
      // chrome.tabs.create({url: tab.url});
    });

    var fav = $('<img>', {src: tab.favIconUrl ? tab.favIconUrl : 'assets/icon_32.png', 
                          height:"32px", 
                          width:"32px", 
                          alt:""
                          });
    fav.attr('style', 'vertical-align:middle; height:32px, width:32px; max-width:32px; max-height:32px');

    var span = $('<div>');
    span.attr('style', ' display: flex;');

    if (tab.highlighted){
      anchor.css("background-color", "#f2f2f2");
    }  else {
      anchor.css("background-color", "#fff");
    }
    // anchor.attr('style', ' margin-right: 0px;');

    var options = $('<span> [<a id="deletelink" ' +
        'href="#">Close</a>]</span>');
    var edit =  $('<input>');
    // Show add and edit links when hover over.
        span.hover(function() {
        // span.append(options);
        $('#deletelink').click(function() {
          chrome.tabs.remove(String(tab.id));
          span.parent().remove();
          
         });
        
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append(fav, anchor);
  }
  var li = $(tab.title ? '<li>' : '<div>').append(span);
  return li;
}

document.addEventListener('DOMContentLoaded', () => {
  dumpTabs();
  $('#search').focus();
});

// this is the workaround to make sure the popup display well
// via https://bugs.chromium.org/p/chromium/issues/detail?id=307912
setTimeout(function(){document.getElementById('workaround-4296411').style.display='block';}, 88);
