

if (Drupal.jsEnabled) {
	
	document.documentElement.className = 'js';
	document.cookie = 'has_js=1; path=/';

	//$(document).ready(Drupal.attachBehaviors);
	Drupal.attachBehaviors;
    //console.log("Page load?");
}


Drupal.behaviors.oer_analyticsBehavior = function (context) { // added context
	//$("#oer-analytics-button").hide();
	$("#oer-analytics-buttona").text("metrics");
	
	$("#oer-analytics-buttona").click(function () { 
		$("#oer-analytics-button").fadeIn();
		//$("oer-analytics-button").css('display', 'block');
		//$("#oer-analytics-buttona").css('display', 'none');
		$("#oer-analytics-buttona").hide();
	});

	$("#hiddenq").click(function () {
		$("#oer-analytics-button").hide(); //css('display','none');
		$("#oer-analytics-buttona").fadeIn();
		
	});	

        function updateData(load) {
                // begin d3 JavaScript for dashboard -- does this work??
                  var margin = {top: 30, right: 30, bottom: 30, left: 50},
                      width = 800 - margin.left - margin.right,
                      height = 260 - margin.top - margin.bottom;

                  var parseDate = d3.time.format("%Y%m%d").parse;

                  var x = d3.time.scale()
                      .range([0, width]);

                  var y = d3.scale.linear()
                      .range([height, 0]);//.domain([0,300]);

                  var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

                  var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

                  var line = d3.svg.line()
                      .x(function(d) { return x(d.x); })
                      .y(function(d) { return y(d.y); })
                      .interpolate("linear");

                  var svg = d3.select("#totalDownloads").append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var w = width;
            var dt;
            var dls;

            window.full_path = location.href;
            var rdf_path = full_path + "/rdf";
            //var nid; // creates space? -- check js style TODO
            $.get(rdf_path, function( data ) {
              var rdf_feed = data;
              console.log("rdf feed is: " + rdf_feed);
              var patt = /node\\?\/(\d{3,5})/i; // regep for feed/nid
              var interim = rdf_feed.match(patt); // returns match on regexp, we want the second matched group
              window.nid = interim[1]; // the second matched group
              console.log("in jquery get,");
              console.log(window.nid);

              window.url_full = "/oer_analytics/getdashboardinfo/" + window.nid; // add the nid to base url now for re
              console.log(window.url_full);

              var svg_two = d3.select("#courseViews").append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //console.log("right before url full composition,");
            //console.log(window.nid);

            //$ (document).trigger(function () { // doc ready d3 bit

            //var url_full = "/oer_analytics/getdashboardinfo/" + window.nid; // add the nid to base url now for re
            console.log(window.url_full);
            d3.json(window.url_full, function(error, data) {
                    // console logging for debugging -- testing ran out api limits? v possible
                    console.log("can we figure out this data problem?");
                    console.log(window.url_full); // right contxt??
                    // console.log(data);
                    // console.log(data.data);



                    // trying to make sure getting the right data when it's dynamically gotten via the url
                    //var idata = JSON.parse(data.data); 
                    var inner_data = JSON.parse(data.data); //(idata.data);
                    dt = inner_data.course_views.data;
                    dls = inner_data.dls_data;
                    console.log(dt);
                    console.log(dls);
                    // window.path_test = location.href;
                    // console.log(path_test);


            // PASTE IN OTHER AJAX STUFF
                    window.num_nations = inner_data.nations_num.num_nations;
                    window.nations = inner_data.nations;
                    //console.log(window.nations);
                    var curr_data = inner_data.course_views.data;
                    var dls_data = inner_data.dls_data;
                    window.yt_data = inner_data.youtube_metrics.yt_metrics;
                    window.course_views = inner_data.course_views.total_course_views;
                    var totalviews = document.getElementById("totalViews");
                    totalviews.innerHTML = window.course_views;

                    if (yt_data.views >=25) { // another condition better? for now though; TODO decide
                      window.yt_title = document.getElementById("ytMetrics");
                      yt_title.innerHTML = "total YouTube content metrics";
              
                      $("#ytViews").text(yt_data.views);
                      $("#ytLikes").text(yt_data.likes);
                      $("#ytComments").text(yt_data.comments);
    

                    } else {
                      window.yt_title = document.getElementById("ytMetrics");
                      yt_title.innerHTML = "No YouTube content";
                    }

                    window.ntitle = document.getElementById("nations_title");
                    ntitle.innerHTML = "top nations visiting this course of " + window.num_nations + " different nations";

                    // GET countries
                    window.nations_list_area = document.getElementById("top_nations");
                    for (var index = 0; index < nations.length; index++) {
                      var newListItem = document.createElement("li");
                      var nationListVal = document.createTextNode(nations[index]);
                      newListItem.appendChild(nationListVal);
                      nations_list_area.appendChild(newListItem);
                    }

                    // END OTHER AJAX STUFF
                    



                    dt.forEach(function(d) {
                        console.log('DT BEFORE: x is ' + d.x + ', and y is ' + d.y);
                        d.x = parseDate(String(d.x));
                        d.y = d.y;
                        console.log('DT AFTER : x is ' + d.x + ', and y is ' + d.y);
                    });

                   
                    dls.forEach(function(d) {
                        //console.log('DLS BEFORE: x is ' + d.x + ', and y is ' + d.y);
                        d.x = parseDate(String(d.x));
                        d.y = d.y;
                        //console.log('DLS AFTER : x is ' + d.x + ', and y is ' + d.y);
                    });
// new
                    var y_max;
                    try {
                        y_max = d3.max(dt, function(d) {return parseInt(d.y); });
                    }
                    catch(err) {
                        console.log('d3.max d.y ' + err.message);
                    }

                    console.log ('x.domain is '  + d3.extent(dt, function(d) { return d.x; }));
                    console.log ('y_max is ' + y_max);
                    x.domain(d3.extent(dt, function(d) { return d.x; }));
                    y.domain([0, y_max]);
// end new
                    // x.domain(d3.extent(dt, function(d) { return d.x; }));
                    // y.domain([0, d3.max(dt, function(d) {return parseInt(d.y); })]); // unchanged

                    // Draw the x axis line
                    svg_two.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis);

                    // Draw the y axis line
                    svg_two.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                        .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 9)
                          .attr("dy", "1em")
                          .style("text-anchor", "end")
                          .text("Total (views or downloads)");
                    
                    // draw the two paths (lines) on the chart
                      svg_two.append("path")
                        .data(dt)
                        .attr("class", "line")
                        .attr('stroke','blue')
                        .attr('fill','none')
                        .attr("id","dlsline")
                        .attr("d", line(dt));

                      svg_two.append("path")
                        .data(dls)
                        .attr("class", "line")
                        .attr('stroke','green')
                        .attr('fill','none')
                        .attr("id","dlsline")
                        .attr("d", line(dls));
                      
                      var legend = svg_two.append("g")
                              .attr("class", "legend")
                              .attr("x", w - 65)
                              .attr("y", 50)
                              .attr("height", 100)
                              .attr("width", 100)
                              //.attr('transform', 'translate(-20,50)');
                      
                      // add text and legend stuff (?)
                      legend.selectAll('rect')
                                //.data(dataset)
                                //.enter()
                              .append("rect")
                                .attr("x", w - 65)
                                .attr("y", function(d, i){ return i *  20;})
                                .attr("width", 10)
                                .attr("height", 10)
                                .style("fill", function(d) { 
                                  var color = color_hash[dls.indexOf(d)][1];
                                  return color;
                                });
                                
                              
                      legend.selectAll('text')
                                //.data(dataset)
                                //.enter()
                                .append("text")
                                .attr("x", w - 52)
                                .attr("y", function(d, i){ return i *  20 + 9;})
                                .text(function(d) {
                                  var text = color_hash[dls.indexOf(d)][0];
                                  return text;
                                });  
                    });
              
              });

	} // end updateData function

	updateData(1);

	
};



