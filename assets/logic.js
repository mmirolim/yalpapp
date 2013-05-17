var map, pointarray, heatmap, marker, i, count;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var arrayslen = restitles.length;
      var infowindow = new google.maps.InfoWindow();
      function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        document.getElementById("searchtext").onkeypress = function (e) {
        if (e.keyCode === 13) {
            searchfortext();
        } }
       
        /*
            Build list of map types.
            You can also use var mapTypeIds = ["roadmap", "satellite", "hybrid", "terrain", "OSM"]
            but static lists sucks when google updates the default list of map types.
         */
            var mapTypeIds = [];
            for(var type in google.maps.MapTypeId) {
                mapTypeIds.push(google.maps.MapTypeId[type]);
            }
            mapTypeIds.push("OSM");

            var mapOptions = {
              center: new google.maps.LatLng(41.3027, 69.2779),
              zoom: 12,
               mapTypeId: "OSM",
               streetViewControl: false,
               mapTypeControlOptions: {
                    mapTypeIds: mapTypeIds
                }
            };

        map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('descriptiontxt'));

            //Define OSM map type pointing at the OpenStreetMap tile server
            map.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));
        markers = new Array(); // Used to store the google markers
 		 for (i = 0; i < arrayslen; i++) {  
     		marker = new google.maps.Marker({
    	    position: taxiData[i],
    	    map: map,
    	  });
     	markers.push(marker); // Add the current marker to the array for later processing

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
       		return function() {
        	infowindow.setContent(restitles[i]);
         	infowindow.open(map, marker);
        	var desc =document.getElementById("descriptiontxt");
          desc.value = taxiData[i].toString();
          console.log(desc.value);
        	desc.style.display ="block";
        	desc.innerHTML = info[i];
        }
      })(marker, i));
    }
    	
    document.addEventListener("deviceready", onDeviceReady, false);
 		 
      }

	 function togglemap() {
	 	var mapcanvas = document.getElementById("map-canvas");
	    if (mapcanvas.style.display == "none") {
	        mapcanvas.style.display="block";
	    } else {
	        mapcanvas.style.display="none";
	    }
	    togglemenu();
      }

	 function togglemenu() {
	 	var menu = document.getElementById("menulist");
	    if (menu.style.display == "block") {
	        menu.style.display="none";
	    } else {
	        menu.style.display="block";
	    }
      }
	// == shows all markers of a particular category, and ensures the checkbox is checked ==
      function togglemarkers() {
        var btnstate = document.getElementById("btntogmarkers");
       // console.log(document.getElementById("btntogmarkers").value);
        if (btnstate.value == "0") {
        for (var i=0; i<arrayslen; i++) {
            markers[i].setVisible(true);
          }
          btnstate.value = "1";
          btnstate.innerHTML = "hide markers";
        } else {
          for (var i=0; i<arrayslen; i++) {
            markers[i].setVisible(false);
          }
          btnstate.value = "0";
          btnstate.innerHTML = "show markers";
         // console.log(document.getElementById("btntogmarkers").value);
        }
        togglemenu();
      }

      // == hides all markers of a particular category, and ensures the checkbox is cleared ==
      function hide() {
        for (var i=0; i<arrayslen; i++) {
            markers[i].setVisible(false);
        }
      }
      
function searchfortext() {
  var searchinput = document.getElementById("searchtext");
  var str = searchinput.value;
  str = str.slice(0,1).toUpperCase()+str.slice(1);
  var found = document.getElementById("searchresults");
  infowindow.close();
  found.innerHTML = '';
  var foundtitles ='';
  hide();
  count =0;
    for (var i=0; i<arrayslen; i++) {
       var searcharr = restitles[i].split("\"");
       //console.log(searcharr[1]);
            if (searcharr[1].search(str) > -1) {
             //console.log(searcharr[1]+'index:i-'+i);
              markers[i].setVisible(true);
              var center = taxiData[i];
              // using global variable:
              foundtitles +='<span class="searchedtxt" onclick="showinfo(this)" value="'+i+'">'+restitles[i]+'</span><br/>';
              count++;
            }else if (count>1) {
				break;
			} else {
				found.style.display="none";
			}
            
        }
        found.innerHTML = foundtitles;
        if (count>=1) {
        	found.style.display="block";
        }

        searchinput.value = str+' ( нашол: '+count+' )';
        searchinput.blur();
        document.getElementById("lastsearch").value =str;
        document.getElementById("descriptiontxt").style.display="none";
        map.panTo(center);

}
  function showinfo(id) {
        var i = id.getAttribute("value");
        var desc =  document.getElementById("descriptiontxt");
       // console.log(id);
       // console.log(parseInt(i));
      	map.panTo(taxiData[i]);
    	desc.style.display="block";
        desc.innerHTML=info[i];
        if (marker.getAnimation() != null) {
		    markers[i].setAnimation(null);
		} else {
        markers[i].setVisible(true);
		    markers[i].setAnimation(google.maps.Animation.BOUNCE);
		    setTimeout(function(){ markers[i].setAnimation(null); }, 1450);
		}
  }
  function toggledesc() {
  		var state = document.getElementsByClassName("desc")[0];
       // console.log(document.getElementById("btntogmarkers").value);
        if (state.value == "show") {
        	state.style.display="none";
        	state.value = "hide";
        } else {
        	state.style.display="block"
        	state.value = "show";
        }          
  }


    // Cordova is ready
    //
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    // onSuccess Geolocation
    //
    var lat,lon,styleMaker;
    function onSuccess(position) {
        //var element = document.getElementById('geolocation');
        if (lat) {
     	   styleMaker.setMap(null);
        };
   		lat = position.coords.latitude;
        lon = position.coords.longitude;
        styleMaker = new StyledMarker({
        	styleIcon:new StyledIcon(StyledIconTypes.MARKER,
        		{color:"36ff00",text:"Я"}),
        	position:new google.maps.LatLng(lat,lon),
        	map:map});  
        styleMaker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ styleMaker.setAnimation(null); }, 1450);
        map.panTo(new google.maps.LatLng(lat,lon));
        togglemenu();
        google.maps.event.addListener(styleMaker, 'click', (function(styleMaker) {
       		return function() {
        	infowindow.setContent('I am here');
         	infowindow.open(map, styleMaker);
        	var desc =document.getElementById("descriptiontxt");
        	desc.style.display="block";
        	desc.innerHTML ='Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          +                                   position.timestamp          + '<br />';
        }
      })(styleMaker));
    }
    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
    }
     function calcRoute(position) {
        var start = lat+','+lon ;
        var end = document.getElementById("descriptiontxt").value;        
        if (null == end) {
          end = "41.3027,69.2779";      
          }  
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
        document.getElementById("descriptiontxt").innerHTML='';
        togglemenu();
      }

      google.maps.event.addDomListener(window, 'load', initialize);