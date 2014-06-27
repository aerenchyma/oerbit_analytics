

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
            //var rdf_feed;
            window.nid; // creates space? -- check js style TODO
            $.get(rdf_path, function( data ) {
              //alert( "Get was gotten" );
              //alert(data);
              var rdf_feed = data;
              var patt = /feed\/(\d{3,4})/i; // regep for feed/nid
              var interim = rdf_feed.match(patt); // returns int position in rdf feed
              //alert(interim[1]);
              nid = interim[1];
              // var inter = interim.split("/"); // array of two items now
              // console.log(inter);
              // nid = interim[1];
              // alert(nid);
              //rdf_feed.substring(interim+5,// nid should be the rdf_feed string at that int position + "feed/"

            });

            var svg_two = d3.select("#courseViews").append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            window.url_full = "/oer_analytics/getdashboardinfo/" + window.nid;
            d3.json(url_full, function(error, data) {
                    var inner_data = JSON.parse(data.data);
                    dt = inner_data.course_views.data;
                    window.path_test = location.href;
                    console.log(path_test);
                    dt.forEach(function(d) {
                        //alert(dt);
                        //console.log('DT BEFORE: x is ' + d.x + ', and y is ' + d.y);
                        d.x = parseDate(String(d.x));
                        d.y = d.y;
                        //console.log('DT AFTER : x is ' + d.x + ', and y is ' + d.y);
                    });

                    dls = inner_data.dls_data;
                    dls.forEach(function(d) {
                        //console.log('DLS BEFORE: x is ' + d.x + ', and y is ' + d.y);
                        d.x = parseDate(String(d.x));
                        d.y = d.y;
                        //console.log('DLS AFTER : x is ' + d.x + ', and y is ' + d.y);
                    });


                    // x.domain(d3.extent(dt, function(d) { return d.x; })); //d.x;
                    // y.domain(d3.extent(dt, function(d) { return d.y; }));
                    x.domain(d3.extent(dt, function(d) { return d.x; }));
                    y.domain([0, d3.max(dt, function(d) {return d.y})]);

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
                                .data(dataset)
                                .enter()
                              .append("rect")
                                .attr("x", w - 65)
                                .attr("y", function(d, i){ return i *  20;})
                                .attr("width", 10)
                                .attr("height", 10)
                                .style("fill", function(d) { 
                                  var color = color_hash[dls.indexOf(d)][1];
                                  return color;
                                })
                                ;
                              
                      legend.selectAll('text')
                                .data(dataset)
                                .enter()
                                .append("text")
                                .attr("x", w - 52)
                                .attr("y", function(d, i){ return i *  20 + 9;})
                                .text(function(d) {
                                  var text = color_hash[dls.indexOf(d)][0];
                                  return text;
                                })
                                ;   
              });

	} // end updateData function

	updateData(1);

	// begin JavaScript for dashboard
	  $.ajax({
	    url : '/oer_analytics/getdashboardinfo/1945', 
	    type : 'GET',
	    success: function(data, textStatus, xhr) { 
        	      "use strict"; // still the same?
                      var d = JSON.parse(data);

                // grab all the time series data and things from the json
        	      window.datayay = JSON.parse(d.data);
        	      window.num_nations = window.datayay.nations_num.num_nations;
        	      window.nations = window.datayay.nations;
        	      //console.log(window.nations);
        	      var curr_data = window.datayay.course_views.data;
        	      var dls_data = window.datayay.dls_data;
        	      window.yt_data = window.datayay.youtube_metrics.yt_metrics;
        	      window.course_views = window.datayay.course_views.total_course_views;
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
        	      for (var y = 0; y < nations.length; y++) {
        	        var newListItem = document.createElement("li");
        	        var nationListVal = document.createTextNode(nations[y]);
        	        newListItem.appendChild(nationListVal);
        	        nations_list_area.appendChild(newListItem);
        	      }

	    },
	    error: function() {
	            "use strict"; alert('aw, sad, something is broken');
            }, // is this the same behavior?
	  });

// balanced brackets?? TODO check
};



