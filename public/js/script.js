var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var map;
var rectangle;
var allMarkers = [];
var selectedPlage = null;
var allData = [];

var markerPath = 'M56.0345 32.9885C56.0345 42.9309 38.046 65 38.046 65C38.046 65 20 42.931 20 32.9885C20 23.0461 28.0458 15 37.9885 15C47.9886 15.0004 56.0345 23.0462 56.0345 32.9885Z';

$(document).ready(function() {
    var $select = $(".dropdown_position2");
    for (i = 0.1; i <= 20.1; i += 0.1) {
        $select.append($('<option></option>').val(i.toFixed(1)).html(i.toFixed(1)))
    }
    $(".dropdown_position2").val("2.0");
})


function clearMap() {

    if (rectangle && rectangle.setMap) {
        rectangle.setMap(null);
        rectangle = null;
    }

    for (var i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(null);
    }
    allMarkers.length = 0;

}

function resetMap() {
    $('.wrapper').find('input:hidden').val('');
    jQuery('.process_popup').css("display", "none");
    $('#draw_points').prop('disabled', false);
    document.getElementById("pac-input2").value = '';
    document.getElementById("sab_input").value = '';
    document.getElementById('businesslat').value = '';
    document.getElementById('businesslng').value = '';
    document.getElementById('businessplcid').value = '';
    document.getElementById('gridsize').value = 3;
    document.getElementById('distance').value = '2.0';
    var resultName = document.querySelector(".auto_search_box");
    resultName.innerHTML = '<input id="pac-input" type="text" placeholder="Search Location" class="pac-target-input" autocomplete="off">';
    initAutocomplete();
}

function drawRectangle() {


    var distance = document.getElementById("distance").value;
    var gridsize = document.getElementById("gridsize").value;
    var DistanceCheckBox = document.getElementById("togBtn");
    if (DistanceCheckBox.checked == true) {
        var distance = distance * 1.6;
        var distance_type = "M";
    } else {
        var distance_type = "K";
    }

    var markerPoints = gridPoints(gridsize, distance, document.getElementById("businesslat").value, document.getElementById("businesslng").value);


    //sort pins and get bounds 
    markerPoints.sort(function(a, b) {
        return b[1] - a[1];
    });

    const lngfirst = markerPoints[0][1];
    const lnglast = markerPoints[markerPoints.length - 1][1];
    markerPoints.sort(function(a, b) {
        return b[0] - a[0];
    });
    const latfirst = markerPoints[0][0];
    const latlast = markerPoints[markerPoints.length - 1][0];

    var eastbound = lngfirst;
    var westbound = lnglast;
    var northbound = latfirst;
    var southbound = latlast;


    //clear old rectangle and markers

    clearMap();

    //add rectangle using bounds
    rectangle = new google.maps.Rectangle({
        strokeColor: "#2477F6",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "rgba(36, 119, 246, 0.1)",
        fillOpacity: 0.3,
        map,
        bounds: {
            north: northbound,
            south: southbound,
            east: eastbound,
            west: westbound,
        },
    });


}

function createSymbolMarkerOptions(rank) {

    var color;

    if (rank == 1)
        color = '#54AC0E';
    else if (rank == 2)
        color = '#81B70C';
    else if (rank == 3)
        color = '#ADC20B';
    else if (rank == 4)
        color = '#E3CF0B';
    else if (rank == 5)
        color = '#FCD408';
    else if (rank == 6)
        color = '#FAB70B';
    else if (rank == 7)
        color = '#F79C0C';
    else if (rank == 8)
        color = '#F47D0C';
    else if (rank == 9)
        color = '#F15C0B';
    else
        color = '#EA170C';

    return {

        path: markerPath,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: color,
        scale: 1,
        labelOrigin: {
            x: 38,
            y: 35
        },
        anchor: new google.maps.Point(38, 65),
    }
}

function addMarker(location, map, rank, result) {
    // console.log(JSON.stringify(location))
    var eachrow = '';
    var list = JSON.parse(result);
    var point_lat = location.lat;
    var point_long = location.lng;

    const contentString2 =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<div id="bodyContent">' +
        "<div class = 'business_div' style=''>Searched results for this location:<br>Coordinates: " + point_lat + "," + point_long + "</div>" +
        "<ul class = 'business_list' style='list-style:none; padding: 1rem;height: 285px; overflow-y: scroll;'>" + eachrow + "</ul>" +
        "</div>" +
        "</div>";

    let all_html = "";

    var t = 1;
    for (var i = 0; i < list.length; i++) {
        let starsHtml = '';

        for (var r = 1; r <= 5; r++) {
            if (list[i].rating >= r) {
                starsHtml += '<span class="fa fa-star" style="font-size: 14px; color: #FFB443;"></span>';
            } else {
                starsHtml += '<span class="fa fa-star" style="font-size: 14px; color: rgba(25, 35, 58, 0.5);"></span>';
            }
        }

        let backgroundColor = '';

        if (selectedPlage.name == list[i].name || selectedPlage.name == list[i].title) {
            backgroundColor += 'background: rgba(25, 35, 58, 0.05);';
        }

        all_html += '<div _ngcontent-adk-c130="" class="ranking-items ng-star-inserted" style="' + backgroundColor + '">\
            <div _ngcontent-adk-c130="" class="flex items-start justify-between p-4">\
              <div _ngcontent-adk-c130="" class="flex items-start">\
                <p _ngcontent-adk-c130="" class="mr-4 font-bold">' + t + '</p>\
                <div _ngcontent-adk-c130="" class="mr-2">\
                  <p _ngcontent-adk-c130="" class="f14 font-semibold black-87 mb-1">' + (list[i].name || list[i].title) + '</p>\
                  <p _ngcontent-adk-c130="" class="f14 black-60 leading-5">' + (list[i].formatted_address || list[i].address) + '</p>\
                  <div _ngcontent-adk-c130="" class="flex items-center ng-star-inserted">\
                    <span _ngcontent-adk-c130="" class="f14 black-60 mr-1">' + (list[i].rating || 0) + '</span>\
                    ' + starsHtml + ' \
					&nbsp;&nbsp;\
                    <span _ngcontent-adk-c130="" class="f14 black-60">(' + (list[i].user_ratings_total || list[i].reviews || 0) + ')</span>\
                  </div>\
                </div>\
              </div>\
              <div _ngcontent-adk-c130="" class="flex-shrink-0 ng-star-inserted">\
              </div>\
            </div>\
            <div _ngcontent-adk-c130="" class="mx-6 border-b border-gray-300"></div>\
          </div>';

        t++;
    }

    if (list.length == 0) {
        all_html = "<div style='padding: 40px;'>No results</div>";
    }

    const infowindow2 = new google.maps.InfoWindow({
        content: contentString2,
    });
    var marker2 = new google.maps.Marker({
        position: location,
        label: {
            text: ((rank == 0) ? "20+" : rank),
            color: "#FFFFFF",
            fontWeight: '900'
        },
        icon: createSymbolMarkerOptions(rank),
        map: map,

    });

    marker2.addListener("click", () => {
        $("#results_lat").text(point_lat);
        $("#results_lng").text(point_long);
        $("#display_results_wrapper").html(all_html);
        $("#cdk-overlay-4").show();
    });
}




function gridPoints(gridsize, distance, lat, lng) {

    distance = distance * 1000;
    var iteration = (gridsize / 2) - (0.5);
    var oneblockdistance = distance / iteration;
    const EARTH_RADIUS = 6378.1;

    let markers = [];
    var lat = parseFloat(lat);
    var lng = parseFloat(lng);
    markers.push([lat, lng]);
    let additionalmarkers = [];

    for (i = 1; i <= iteration; i++) {

        var currentblockdistance = oneblockdistance * i;


        var p1 = new LatLonSpherical(lat, lng);
        var p2 = p1.destinationPoint(currentblockdistance, 0);


        markers.push([p2._lat, p2._lon]);
        var p3 = p1.destinationPoint(currentblockdistance, 180);
        markers.push([p3._lat, p3._lon]);
        // console.log(markers);
        // console.log(gridsize);
    }

    markers.forEach((marker) => {
        for (i = 1; i <= iteration; i++) {


            currentblockdistance = oneblockdistance * i;
            var p5 = new LatLonSpherical(marker[0], marker[1]);
            var p6 = p5.destinationPoint(currentblockdistance, 90);
            additionalmarkers.push([p6._lat, p6._lon]);
            const p8 = p5.destinationPoint(currentblockdistance, 270);
            additionalmarkers.push([p8._lat, p8._lon]);

        }
    });

    // console.log(additionalmarkers);
    var markerpointers = additionalmarkers.concat(markers);
    // console.log(markerpointers);
    return markerpointers;
}


//Check for results
function interval_ajax(map, ignore_confirmation = false) {
    var scanId = jQuery('#hiddenScanId').val();
    var skip = jQuery('#hiddenSkip').val();
    var size = document.getElementById("gridsize").value;
    if (skip == size * size || scanId == "") {
        // jQuery('#hiddenSkip').val("");
        return false;
    }
    jQuery.ajax({
        url: '/search_place/fetchResults/' + scanId,
        method: 'get',
        dataType: 'json',
        success: function(response) {

            var data = response.data;

            allData = data;

            data.slice(skip).forEach(function(element) {
                var rank = element.rank;
                let rank1 = rank.toString();
                let myLatLng = {
                    lat: element.lat,
                    lng: element.long
                };
                addMarker(myLatLng, map, rank1, element.results, element.lat, element.long);
            });
            if (data.length == size * size) {
                jQuery('.process_popup').css("display", "none");

                if (!ignore_confirmation)
                    jQuery('.popup_close').css("display", "block");

                jQuery('.export_report_div').css("display", "block");
                jQuery('.export_csv_div').css("display", "block");
                $('#draw_points').prop('disabled', false);
            }

            jQuery('#hiddenSkip').val("");
            jQuery('#hiddenSkip').val(data.length);
        },
    });
}

function hide() {
    jQuery('.popup_close').css("display", "none");
    jQuery('.export_report_div').css("display", "none");
    jQuery('.export_csv_div').css("display", "none");
}

//This function is called for saving to server
function scanItemAjax(keyword, business, gridsize, markerPoints, map, actual_distance, distance_type, searchType) {
    return jQuery.ajax({
        url: '/search_place/store',
        method: 'POST',
        dataType: 'json',
        data: {
            keyword: keyword,
            business: business,
            distance_type: distance_type,
            distance: actual_distance,
            gridsize: gridsize,
            gridPoints: markerPoints,
            searchType: searchType,
            autocompleteSearch: selectedPlage.name + ", " + (selectedPlage.formatted_address || selectedPlage.address),
            autocompletePlaceId: selectedPlage.place_id,
            autocompleteLat: ((selectedPlage.gps_coordinates) ? selectedPlage.gps_coordinates.latitude : selectedPlage.geometry.location.lat()),
            autocompleteLng: ((selectedPlage.gps_coordinates) ? selectedPlage.gps_coordinates.longitude : selectedPlage.geometry.location.lng()),
        },
        success: function(response) {
            // console.log(response);
            jQuery('#hiddenScanId').val(response.scanId);
            //check results
            setInterval(interval_ajax, 5000, map);
        },

    });
}


function drawpoints(scan = 0, ignoreAjaxSubmit = false) {


    hide();
    const input_value = document.getElementById("pac-input").value;
    var keyword = document.getElementById("pac-input2").value;

    var distance = document.getElementById("distance").value;
    var actual_distance = distance;
    var DistanceCheckBox = document.getElementById("togBtn");
    var search_type = document.getElementById("togBtn2");
    var gridsize = document.getElementById("gridsize").value;
    var businessplcid = document.getElementById("businessplcid").value;
    // var keyword = document.getElementById("pac-input2").value;

    if (search_type.checked == true) {
        var searchType = "sab";
    } else {
        var searchType = "est";
    }
    if (scan == 1) {

        //we will add the validations here
        if (keyword == "" && input_value == "") {
            document.getElementById("pac-input2").style.borderColor = "red"
            document.getElementById("pac-input").style.borderColor = "red"
            return false;
        }
        if (search_type.checked == true) {
            if (search_type == "") {
                document.getElementById("sab_input").style.borderColor = "red"
                return false;
            }
        } else {
            if (input_value == "") {
                document.getElementById("pac-input").style.borderColor = "red"
                return false;
            }
        }

        if (keyword == "") {
            document.getElementById("pac-input2").style.borderColor = "red"
            return false;
        }
        $('#result').hide();
        $('#draw_points').prop('disabled', true);

        if (!ignoreAjaxSubmit)
            jQuery('.process_popup').css("display", "block");
    }



    if (DistanceCheckBox.checked == true) {
        var distance = distance * 1.6;
        var distance_type = "M";
    } else {
        var distance_type = "K";
    }

    //get all pins
    var markerPoints = gridPoints(gridsize, distance, document.getElementById("businesslat").value, document.getElementById("businesslng").value);

    //draw a rectangle
    drawRectangle();

    //add empty pins without ranking or popup for all places	  
    if (scan == 1) {
        // console.log(markerPoints);
        markerPoints.forEach(markerpoint => {



            const myLatLng = {
                lat: markerpoint[0],
                lng: markerpoint[1]
            };

            const markerp = new google.maps.Marker({
                position: myLatLng,
                map,
                // icon: {url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                icon: {

                    path: markerPath,
                    fillColor: '#7893cf',
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#7893cf',
                    scale: 1,
                    labelOrigin: {
                        x: 38,
                        y: 35
                    },
                    anchor: new google.maps.Point(38, 65),

                },
                label: {
                    text: '?',
                    color: 'white',
                    // fontWeight:"bold",
                },

            });

            allMarkers.push(markerp);

        });
    } else {
        markerPoints.forEach(markerpoint => {



            const myLatLng = {
                lat: markerpoint[0],
                lng: markerpoint[1]
            };

            const markerp = new google.maps.Marker({
                position: myLatLng,
                map,
                icon: {
                    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                    fillColor: 'red',
                    fillOpacity: 0.8,
                    strokeWeight: 1,
                    strokeColor: 'red',
                    anchor: new google.maps.Point(0, 0),
                    strokeWeight: 0,
                    scale: .15
                }
            });

            allMarkers.push(markerp);

        });
    }



    //if its not a scan then add a dragable pin in the centre otherwise keep simple pin

    if (scan != 1) {

        const myLatLng1 = {
            lat: parseFloat(document.getElementById("businesslat").value),
            lng: parseFloat(document.getElementById("businesslng").value)
        };

        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: myLatLng1,
            icon: {

                path: markerPath,
                fillColor: '#7893cf',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#7893cf',
                scale: 1,
                labelOrigin: {
                    x: 38,
                    y: 35
                },
                anchor: new google.maps.Point(38, 65),


            },
            label: {
                text: '?',
                color: 'white',
            },
        });


        marker.addListener("dragend", function(evt) {

            document.getElementById('businesslat').value = evt.latLng.lat();
            document.getElementById('businesslng').value = evt.latLng.lng();
            drawpoints();


        });

        allMarkers.push(marker);

        rectangle.bindTo('center', marker, 'position');

    }




    if (search_type.checked == true) {
        if (scan == 1) {

            if (!ignoreAjaxSubmit)
                scanItemAjax(keyword, $('#hiddenSabBusinessName').val(), gridsize, markerPoints, map, actual_distance, distance_type, searchType);
        }

        setZoomLevel();
    } else {
        const bounds = new google.maps.LatLngBounds();

        service = new google.maps.places.PlacesService(map);
        var request = {
            placeId: businessplcid
        };

        service.getDetails(request, function(place, status) {
            // console.log(place)
            var business = place.name;

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
            // var zoomlevel = map.getZoom();
            // console.log(zoomlevel)
            // map.setZoom((1));

            setZoomLevel();

            // console.log('set zoom')

            if (scan == 1) {

                if (!ignoreAjaxSubmit)
                    scanItemAjax(keyword, business, gridsize, markerPoints, map, actual_distance, distance_type, searchType);
            }
        });
    }




}




function initAutocomplete() {

    // Create an array of styles.
    var styles = [{
        stylers: [{
            lightness: 50
        }]
    }];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });

    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 37.422160,
            lng: -122.084270
        },
        zoom: 15,
        mapTypeId: "roadmap",
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');


    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const options = {

        types: ["establishment"],
    };
    window.searchBox = new google.maps.places.Autocomplete(input, options);

    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("place_changed", () => {

        const place = searchBox.getPlace();
        //places.forEach((place) => {
        if (place.length == 0) {
            return;
        }

        selectedPlage = place;

        console.log('selectedPlage', selectedPlage)

        //   console.log(place.place_id);

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
        }

        document.getElementById('businesslat').value = place.geometry.location.lat();
        document.getElementById('businesslng').value = place.geometry.location.lng();
        document.getElementById('businessplcid').value = place.place_id;
        var pt = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
        map.setCenter(pt);
        clearMap();
        var marker2 = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            draggable: true,
            icon: {

                path: markerPath,
                fillColor: '#e9ebee',
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#e9ebee',
                scale: 1,
                labelOrigin: {
                    x: 38,
                    y: 35
                },
                anchor: new google.maps.Point(38, 65),


            },
        });

        allMarkers.push(marker2);

        marker2.addListener("dragend", function(evt) {

            alert(evt.latLng.lat() + ',' + evt.latLng.lng());
            document.getElementById('businesslat').value = evt.latLng.lat();
            document.getElementById('businesslng').value = evt.latLng.lng();
            drawpoints();


        });

        drawpoints();


    });
    //});


}

window.initAutocomplete = initAutocomplete;


$(document).ready(function() {
    $("#sab_input").hide();

    $("#togBtn2").click(function() {
        if ($(this).is(":checked")) {
            $("#pac-input").hide();
            $("#sab_input").val('');
            $("#sab_input").show();

        } else {
            $("#sab_input").hide();
            $("#result").hide();
            $("#pac-input").show();
        }
    });
});

var delayTimer;

function showResults(value) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
        if (value) {
            let list = '';
            res = document.getElementById("result");
            res.innerHTML = '<i class="fa fa-spin fa-spinner"></i>';
            $('#result').show();
            jQuery.ajax({
                url: '/search_place/autoComplete',
                method: 'POST',
                dataType: 'json',
                data: {
                    keyword: value,
                    value_serp_key: parent.window.RG_GRID_CONFIG.VALUE_SERP_KEY
                },
                success: function(response) {
                    // console.log(response);
                    var data = response.suggestions;
                    if (value === document.getElementById("sab_input").value) {
                        for (i = 0; i < data.length; i++) {
                            list += '<li id="' + data[i].title + '||' + data[i].data_cid + '" class="suggestion_li" onclick="openResult(this.id)">' + data[i].title + '</li>';
                        }

                        res.innerHTML = '<ul style="list-style: none; padding:.1rem;">' + list + '</ul>';
                    }

                },
            });
        }
    }, 1000);
}

function openResult(clicked_id) {

    var res = clicked_id.split("||");
    var data_cid = res['1'];
    $('#result').hide();
    $('#sab_input').val(res['0']);


    jQuery.ajax({
        url: '/search_place/searchPlace',
        method: 'POST',
        dataType: 'json',
        data: {
            keyword: res['0'],
            data_cid: res['1'],
            value_serp_key: parent.window.RG_GRID_CONFIG.VALUE_SERP_KEY
        },
        success: function(response) {
            var data = response.data;
            // console.log(coordinates);

            data.place_details.name = data.place_details.title;
            data.place_details.formatted_address = data.place_details.address;
            data.place_details.place_id = data.place_details.data_cid;
            selectedPlage = data.place_details;

            document.getElementById('businesslat').value = data.place_details.gps_coordinates.latitude;
            document.getElementById('businesslng').value = data.place_details.gps_coordinates.longitude;
            document.getElementById('businessplcid').value = data.place_details.data_id;
            document.getElementById('hiddenSabBusinessName').value = data.place_details.title;
            const c_myLatLng = {
                lat: data.place_details.gps_coordinates.latitude,
                lng: data.place_details.gps_coordinates.longitude
            };
            var pt = new google.maps.LatLng(data.place_details.gps_coordinates.latitude, data.place_details.gps_coordinates.longitude);
            map.setCenter(pt);
            clearMap();
            var marker2 = new google.maps.Marker({
                position: c_myLatLng,
                map: map,
                draggable: true,
                icon: {

                    path: markerPath,
                    fillColor: '#e9ebee',
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#e9ebee',
                    scale: 1,
                    labelOrigin: {
                        x: 38,
                        y: 35
                    },
                    anchor: new google.maps.Point(38, 65),

                },
            });

            allMarkers.push(marker2);
            drawpoints();
        },
    });
}

function exportPdf() {
    var pdfLat = $('#businesslat').val();
    var pdfLong = $('#businesslng').val();
    var pdfGrid = $('#gridsize').val();
    var pdfDistance = $('#distance').val();
    var pdfbusinessName = $('#pac-input').val();
    if (pdfbusinessName == null || pdfbusinessName === '') {
        var pdfbusinessName = $('#sab_input').val();
    }

    var pdfDistanceCheckBox = document.getElementById("togBtn");
    if (pdfDistanceCheckBox.checked == true) {
        var pdfDistance = pdfDistance + "KM";
    } else {
        var pdfDistance = pdfDistance + "Miles";
    }

    var index = pdfbusinessName.indexOf(',');
    var [finalPdfbussName, PdfBussAddress] = [pdfbusinessName.slice(0, index), pdfbusinessName.slice(index + 1)];
    var pdfkeyword = "Keyword: " + $('#pac-input2').val().trim()
    var PdfBussAddress = PdfBussAddress.trim();
    var pdfDetails = pdfGrid + " X " + pdfGrid + " grid " + "|| " + pdfDistance;
    let date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fullDate = `${day}/${month}/${year}.`;
    var scanDate = "Scanned on " + fullDate;
    var elementHTML = document.getElementById('map');

    var pdflocation = pdfLat + ',' + pdfLong;

    // console.log(3);

    $("#map").css('height', '940px');
    $("#map").css('width', '940px');
    $(".gm-fullscreen-control").hide();
    $('#map a[rel="noopener"]').hide();
    $(".gm-bundled-control-on-bottom").hide();
    $("#generating_pdf_wrapper").show();

    // setZoomLevel();

    screenshot(document.querySelector('.gm-style'), {
        x: 0, // this are our custom x y properties
        y: 30,
        width: 900, // final width and height
        height: 840,
        backgroundColor: null,
        allowTaint: false,
        useCORS: true,
        ignoreElements: (node) => {
            return node.nodeName === 'IFRAME';
        },
    }).then(canvas => {
        // const dataUrl = canvas.toDataURL("png");
        // console.log(dataUrl);
        // const win = window.open(dataUrl, '_blank');

        // return;

        // var a = document.createElement('a');
        // // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
        // a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        // a.download = 'somefilename.jpg';
        // a.click();

        // return;

        var pdf = new jsPDF('p', 'pt', 'letter');

        var pageHeight = 980;
        var pageWidth = 900;
        for (var i = 0; i <= 0; i++) {
            var srcImg = canvas;
            var sX = 0;
            var sY = pageHeight * i; // start 1 pageHeight down for every new page
            var sWidth = pageWidth;
            var sHeight = pageHeight;
            var dX = 0;
            var dY = 0;
            var dWidth = pageWidth;
            var dHeight = pageHeight;

            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', pageWidth);
            onePageCanvas.setAttribute('height', pageHeight);
            var ctx = onePageCanvas.getContext('2d');
            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

            var canvasDataURL = onePageCanvas.toDataURL("image/png", 100, 100);
            var width = onePageCanvas.width;
            var height = onePageCanvas.clientHeight;

            if (i > 0) // if we're on anything other than the first page, add another page
                pdf.addPage(); // 8.5" x 12" in pts (inches*72)
            pdf.setPage(i + 1);
            pdf.setFontType("bold");


            let title = "Grid Tracker Report";
            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / 2);
            pdf.text(title, xOffset, 40);

            pdf.setFontType("bold");
            pdf.setFontSize(30);
            pdf.setTextColor('#145DBF')

            let subtitle = 'Grid Ranking Report';
            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(subtitle) * pdf.internal.getFontSize() / 2);
            pdf.text(subtitle, xOffset, 240);

            pdf.setTextColor('#145DBF')
            pdf.setFontSize(16);

            let textBy = 'By Grid Tracker';
            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(textBy) * pdf.internal.getFontSize() / 2);
            pdf.text(textBy, xOffset, 280);

            pdf.setTextColor('100')
            pdf.setFontSize(16);

            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(scanDate) * pdf.internal.getFontSize() / 2);
            pdf.text(scanDate, xOffset, 310);

            pdf.setTextColor('#00000')
            pdf.setFontSize(16);

            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(PdfBussAddress) * pdf.internal.getFontSize() / 2);
            pdf.text(PdfBussAddress, xOffset, 430);

            // pdf.setFontType("normal");
            // pdf.setTextColor('100')
            // pdf.setFontSize(12);
            // pdf.text(50, 455, PdfBussAddress);
            pdf.setTextColor('#145DBF')
            pdf.setFontSize(12);
            pdf.text(50, 480, pdflocation);
            pdf.setTextColor('#00000')
            pdf.setFontSize(14);
            pdf.text(50, 520, pdfDetails);
            pdf.text(50, 545, pdfkeyword);

            pdf.addPage(); // 8.5" x 12" in pts (inches*72)

            pdf.setPage(i + 2); // now we declare that we're working on that page
            pdf.setFontType("bold");
            pdf.setFontSize(24);

            let localScanResultsText = 'Local Scan Results';
            xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(localScanResultsText) * pdf.internal.getFontSize() / 2);
            pdf.text(localScanResultsText, xOffset, 60);

            pdf.addImage(canvasDataURL, 'PNG', 20, 150, (width * .62), (height * .62)); // add content to the page
        }

        // Save the PDF
        pdf.save('grid-report.pdf');

        $("#map").css('width', 'auto');
        $("#map").css('height', '100%');
        $('#map a[rel="noopener"]').show();
        $(".gm-bundled-control-on-bottom").show();
        $("#generating_pdf_wrapper").hide();
    });
}

function generateScreenshot() {
    var pdfLat = $('#businesslat').val();
    var pdfLong = $('#businesslng').val();
    var pdfGrid = $('#gridsize').val();
    var pdfDistance = $('#distance').val();
    var pdfbusinessName = $('#pac-input').val();
    if (pdfbusinessName == null || pdfbusinessName === '') {
        var pdfbusinessName = $('#sab_input').val();
    }

    var pdfDistanceCheckBox = document.getElementById("togBtn");
    if (pdfDistanceCheckBox.checked == true) {
        var pdfDistance = pdfDistance + "KM";
    } else {
        var pdfDistance = pdfDistance + "Miles";
    }

    var index = pdfbusinessName.indexOf(',');
    var [finalPdfbussName, PdfBussAddress] = [pdfbusinessName.slice(0, index), pdfbusinessName.slice(index + 1)];
    var pdfkeyword = "Keyword: " + $('#pac-input2').val().trim()
    var PdfBussAddress = PdfBussAddress.trim();
    var pdfDetails = pdfGrid + " X " + pdfGrid + " grid " + "|| " + pdfDistance;
    let date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fullDate = `${day}/${month}/${year}.`;
    var scanDate = "Scanned on " + fullDate;
    var elementHTML = document.getElementById('map');

    var pdflocation = pdfLat + ',' + pdfLong;

    // console.log(3);

    $("#map").css('width', '900px');
    $("#map").css('height', '700px');
    $(".gm-fullscreen-control").hide();
    $('#map a[rel="noopener"]').hide();
    $(".gm-bundled-control-on-bottom").hide();
    // $("#generating_screensht_wrapper").show();

    // setZoomLevel();

    screenshot(document.querySelector('.gm-style'), {
        x: 0, // this are our custom x y properties
        y: 100,
        width: 900, // final width and height
        height: 480,
        backgroundColor: null,
        allowTaint: false,
        useCORS: true,
        ignoreElements: (node) => {
            return node.nodeName === 'IFRAME';
        },
    }).then(canvas => {
        const dataUrl = canvas.toDataURL("png");

        parent.window.processCompareScreenshotUrl(dataUrl);
    });
}

function screenshot(element, options = {}) {
    // our cropping context
    let cropper = document.createElement('canvas').getContext('2d');
    // save the passed width and height
    let finalWidth = options.width || window.innerWidth;
    let finalHeight = options.height || window.innerHeight;
    // update the options value so we can pass it to h2c
    if (options.x) {
        options.width = finalWidth + options.x;
    }
    if (options.y) {
        options.height = finalHeight + options.y;
    }
    // chain h2c Promise
    return html2canvas(element, options).then(c => {
        // do our cropping
        cropper.canvas.width = finalWidth;
        cropper.canvas.height = finalHeight;
        cropper.drawImage(c, -(+options.x || 0), -(+options.y || 0));
        // return our canvas
        return cropper.canvas;
    });
}

function setZoomLevel() {
    let theDistance = parseFloat($("#distance").val());
    let theZoom;

    if (theDistance > 0 && theDistance <= 2)
        theZoom = 15 - parseFloat($("#distance").val() / 3.95);

    if (theDistance > 2 && theDistance <= 4)
        theZoom = 15 - parseFloat($("#distance").val() / 2.6);

    if (theDistance > 4 && theDistance <= 7)
        theZoom = 15 - parseFloat($("#distance").val() / 2.5);

    if (theDistance > 7 && theDistance <= 12)
        theZoom = 15 - parseFloat($("#distance").val() / 3.2);

    if (theDistance > 12 && theDistance <= 16)
        theZoom = 15 - parseFloat($("#distance").val() / 4);

    if (theDistance > 16 && theDistance <= 18)
        theZoom = 15 - parseFloat($("#distance").val() / 4.6);

    if (theDistance > 18 && theDistance <= 20)
        theZoom = 15 - parseFloat($("#distance").val() / 4.9);

    if (window.outerWidth < 700)
        theZoom = theZoom - 1.5;

    if (parent.window.RG_GRID_ACTION && parent.window.RG_GRID_ACTION.ACTION == 'view' && parent.window.RG_GRID_ACTION.SUB_ACTION && parent.window.RG_GRID_ACTION.SUB_ACTION == 'generate_screenshot')
        theZoom = theZoom - 1;

    map.setZoom(theZoom);
}

function exportCsv() {
    // console.log('allData', allData);

    let csv = 'Business:, "' + jQuery("#pac-input").val() + '"\n';
    csv += 'Keyword:, "' + jQuery("#pac-input2").val() + '"\n';

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds();

    csv += 'Report Date:, "' + currentdate + '"\n';
    csv += 'Grid Size:, ' + jQuery("#gridsize option:selected").text().replace(' grid', '') + '\n';
    csv += 'Radius:, ' + jQuery("#distance").val() + ' ' + ((document.getElementById("togBtn").checked) ? 'km' : 'mi') + '\n';

    for (var i in allData) {
        let item = allData[i];

        console.log('item', item);

        csv += '\n';
        csv += 'Data Point:, ' + (parseInt(i) + 1) + '\n';
        csv += 'Latitude:, ' + item.lat + '\n';
        csv += 'Longitude:, ' + item.long + '\n';
        csv += 'Search URL:, "https://www.google.com/maps/search/?api=1&query=' + item.lat + ',' + item.long + '"\n';

        csv += 'Rank,Business,Address,Place ID,Rating,Reviews,Google URL,Distance From Center Point,Distance From Data Point\n';

        let businesses = JSON.parse(item.results);

        for (var j in businesses) {
            let business = businesses[j];

            let google_url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(business.title || business.name) + "&query_place_id=" + business.place_id;

            let biz_lat, biz_long;

            if (business.gps_coordinates) {
                biz_lat = business.gps_coordinates.latitude;
                biz_long = business.gps_coordinates.longitude;
            } else {
                biz_lat = business.geometry.location.lat;
                biz_long = business.geometry.location.lng;
            }

            let distanceFromCenterPoint = getDistanceFromLatLonInKm(biz_lat, biz_long, selectedPlage.geometry.location.lat(), selectedPlage.geometry.location.lng());

            if (document.getElementById("togBtn").checked) {
                distanceFromCenterPoint = distanceFromCenterPoint + "km";
            } else {
                distanceFromCenterPoint = (distanceFromCenterPoint / 1.6).toFixed(2);
                distanceFromCenterPoint = distanceFromCenterPoint + "mi";
            }

            let distanceFromDataPoint = getDistanceFromLatLonInKm(biz_lat, biz_long, item.lat, item.long);

            if (document.getElementById("togBtn").checked) {
                distanceFromDataPoint = distanceFromDataPoint + "km";
            } else {
                distanceFromDataPoint = (distanceFromDataPoint / 1.6).toFixed(2);
                distanceFromDataPoint = distanceFromDataPoint + "mi";
            }

            csv += business.position + ',"' + (business.title || business.name) + '","' + (business.address || business.formatted_address) + '",' + business.place_id + ',' + (business.rating || 0) + ',' + (business.user_ratings_total || business.reviews || 0) + ',' + google_url + ',' + distanceFromCenterPoint + ',' + distanceFromDataPoint + '\n';
        }
    }

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate); // "17-6-2022"

    const anchor = document.createElement('a');
    anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    anchor.target = '_blank';
    anchor.download = jQuery("#pac-input").val().toLowerCase().replace(/\ /g, "-") + ' - ' + jQuery("#pac-input2").val().toLowerCase().replace(/\ /g, "-") + " " + currentDate + ".csv";
    anchor.click();
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function generateSerpScreenshot() {
    var scanId = jQuery('#hiddenScanId').val();
    if (scanId == "") {
        return false;
    }

    jQuery('#generateSerpScreenshotBtn').prop('disabled', true);
    jQuery('generateSerpScreenshotBtn i').removeClass('fa-image');
    jQuery('generateSerpScreenshotBtn i').addClass('fa-spin').addClass('fa-spinner');

    jQuery.ajax({
        url: '/search_place/generate_serp_screenshot/' + scanId,
        method: 'get',
        dataType: 'json',
        success: function(response) {

            var data = response.data;

        }
    });
}