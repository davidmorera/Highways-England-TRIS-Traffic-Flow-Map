(function() {

	var d3 = Plotly.d3;

	var WIDTH_IN_PERCENT_OF_PARENT = 100,
		HEIGHT_IN_PERCENT_OF_PARENT = 105;

	var gd3 = d3.select('body')
		.append('div')
		.style({
			width: WIDTH_IN_PERCENT_OF_PARENT + '%',
			'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
			
			height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
			'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
		});

	var gd = gd3.node();

	var yearto = ( (new Date()).getFullYear() ) ;
	var yearfrom = 2010;
	
	
	var webtrisid = 8741;

	var url = "https://he-tris-proxy.herokuapp.com/api/webtris?sites=" + webtrisid + "&start_date=0101" + yearfrom + "&end_date=0101" + yearto;
	
	Plotly.d3.json(url, function(data){
		years = data.AnnualReportBody.map(function(d) { return d.Year; });
		
		aadt = data.AnnualReportBody.map(function(d) { return d.AnnualReportAverages.ADT24Hour; });
		per =  data.AnnualReportBody.map(function(d) { return d.AnnualReportAverages.ADT24LargeVehiclePercentage; });

		aadt = aadt.map(Number);

		aadt_hgv = [];
		aadt_car = [];

		per_hgv = per.map(Number);
		per_car = per_hgv.map( function(value) { return 100 - value; } );

		for (var i = 0; i < aadt.length; i++) {
			aadt_hgv.push( Math.round(aadt[i] * per_hgv[i]/100) );
			aadt_car.push( Math.round(aadt[i] * per_car[i]/100) );
		}

		var trace1 = {
		  x: years,
		  y: aadt_car,
		  mode: 'lines+markers',
		  name:'Car',
		  marker: {
			size: 12, 
			opacity: 0.5,
			color: 'rgba(255,127,0,0.7)'
		  }
		};
			
		var trace2 = {
		  x: years,
		  y: aadt_hgv,
		  mode: 'lines+markers',
		  name:'HGV',
		  marker: {
			size: 12, 
			opacity: 0.5,
			color: 'rgba(152,78,163,0.7)'
		  }
		};
			
		var trace3 = {
		  x: years,
		  y: per_car,
		  name:'% Cars',
		  type: 'bar',
		  marker: {
			color: 'rgba(255,127,0,0.7)'
		  },
		  opacity: 0.9
		};
			
		var trace4 = {
		  x: years,
		  y: per_hgv,
		  name:'% HGVs',
		  type: 'bar',
		  marker: {
			color: 'rgba(152,78,163,0.7)'
		  },
		  opacity: 0.9
		};
			
		var trace5 = {
		  x: years,
		  y: aadt,
		  mode: 'lines+markers',
		  name:'Car',
		  line: {
			width: 2,
			color: 'rgba(31,119,180,0.7)'
		  },
		  marker: {
			size: 12, 
			opacity: 0.5
		  }
		};
			
		
		var data_01 = [trace1,trace2];
		var data_02 = [trace3,trace4];
		var data_03 = [trace5]

		var layout_01 = {
		  title: 'By vehicle type. Counter ID: ' + webtrisid,
		  titlefont: {size: 14},
		  font: {
			family: 'Arial, monospace',
			size: 12
		  },
		  width: 360,
		  height: 220,
		  margin: {l:30,r:0,t:30,b:30},
		  xaxis: {
			dtick: 1
		  },
			showlegend: false
		};
			
		var layout_02 = {
		  title: 'By vehicle type %. Counter ID: ' + webtrisid,
		  titlefont: {size: 14},
		  font: {
			family: 'Arial, monospace',
			size: 12
		  },
		  width: 360,
		  height: 220,
		  margin: {l:30,r:5,t:30,b:30},		  
		  barmode: 'stack',
		  xaxis: {
			dtick: 1
		  },
		  yaxis: {
			type: 'linear',
			ticksuffix: '%'
		  },
			showlegend: false
		};
			
		var layout_03 = {
		  title: 'All vehicles. Counter: ' + webtrisid,
		  titlefont: {size: 14},
		  font: {
			family: 'Arial, monospace',
			size: 12
		  },
		  width: 360,
		  height: 220,
		  margin: {l:30,r:0,t:30,b:30},
		  xaxis: {
			dtick: 1
		  },
			showlegend: false
		};
			

		Plotly.newPlot('plotdiv_01', data_01, layout_01, {displayModeBar : false});
		Plotly.newPlot('plotdiv_02', data_02, layout_02, {displayModeBar : false});
		Plotly.newPlot('plotdiv_03', data_03, layout_03, {displayModeBar : false});	
		
	});
	
	
	
	
	Plotly.d3.csv('webtris_loc.csv', function(err, rows){
		  
		function unpack(rows, key) {
			return rows.map(function(row) { return row[key]; });
		}

		var listofYears  = ['2019','2018','2017','2016','2015','2014','2013','2012','2011','2010']
			  
		var wbtID = unpack(rows, 'webtrisID'),
			ctID = unpack(rows, 'counterID'),
			ctDirection = unpack(rows, 'directionBound'),
			ctRoad = unpack(rows, 'roadNumber'),
			ctType = unpack(rows, 'carriagewayType'),
			ctTypeID = unpack(rows, 'carriagewayTypeID'),
			
			ctaadfa2019 = unpack(rows, 'aadf_2019'),ctaadfa2018 = unpack(rows, 'aadf_2018'),ctaadfa2017 = unpack(rows, 'aadf_2017'),
			ctaadfa2016 = unpack(rows, 'aadf_2016'),ctaadfa2015 = unpack(rows, 'aadf_2015'),ctaadfa2014 = unpack(rows, 'aadf_2014'),
			ctaadfa2013 = unpack(rows, 'aadf_2013'),ctaadfa2012 = unpack(rows, 'aadf_2012'),ctaadfa2011 = unpack(rows, 'aadf_2011'),
			ctaadfa2010 = unpack(rows, 'aadf_2010'),
			
			ctaadfc2019 = unpack(rows, 'aadf_car_2019'),ctaadfc2018 = unpack(rows, 'aadf_car_2018'),ctaadfc2017 = unpack(rows, 'aadf_car_2017'),
			ctaadfc2016 = unpack(rows, 'aadf_car_2016'),ctaadfc2015 = unpack(rows, 'aadf_car_2015'),ctaadfc2014 = unpack(rows, 'aadf_car_2014'),
			ctaadfc2013 = unpack(rows, 'aadf_car_2013'),ctaadfc2012 = unpack(rows, 'aadf_car_2012'),ctaadfc2011 = unpack(rows, 'aadf_car_2011'),
			ctaadfc2010 = unpack(rows, 'aadf_car_2010'),
			  
			ctaadfh2019 = unpack(rows, 'aadf_hgv_2019'),ctaadfh2018 = unpack(rows, 'aadf_hgv_2018'),ctaadfh2017 = unpack(rows, 'aadf_hgv_2017'),
			ctaadfh2016 = unpack(rows, 'aadf_hgv_2016'),ctaadfh2015 = unpack(rows, 'aadf_hgv_2015'),ctaadfh2014 = unpack(rows, 'aadf_hgv_2014'),
			ctaadfh2013 = unpack(rows, 'aadf_hgv_2013'),ctaadfh2012 = unpack(rows, 'aadf_hgv_2012'),ctaadfh2011 = unpack(rows, 'aadf_hgv_2011'),
			ctaadfh2010 = unpack(rows, 'aadf_hgv_2010'),
			  
			ctphgv2019 = unpack(rows, 'pHGV_2019'),ctphgv2018 = unpack(rows, 'pHGV_2018'),ctphgv2017 = unpack(rows, 'pHGV_2017'),
			ctphgv2016 = unpack(rows, 'pHGV_2016'),ctphgv2015 = unpack(rows, 'pHGV_2015'),ctphgv2014 = unpack(rows, 'pHGV_2014'),
			ctphgv2013 = unpack(rows, 'pHGV_2013'),ctphgv2012 = unpack(rows, 'pHGV_2012'),ctphgv2011 = unpack(rows, 'pHGV_2011'),
			ctphgv2010 = unpack(rows, 'pHGV_2010'),
			 
			cLat = unpack(rows, 'Lat'),
			cLon = unpack(rows, 'Long'),
			color = ["rgba(255,65,54,0.7)"],
			ctSize = [],
			hoverText = [],
			scale = 2500,
			  
			btwYearS = 2019,
			btwYearE = 2019,			  
			traceNo = 0,
			  
			vehDisp = 'a',
			
			cpSize = [],
			cphoverText = [],
			cpColor=[];


		// Default map 2016
		setMap('2019');
		  
		// Set map function
		function setMap(chosenYear) {
			var currentAADF = eval('ctaadfa' + chosenYear);
			var currentpHGV = eval('ctphgv' + chosenYear);
			  
			var compSAADF = eval('ctaadfa' + btwYearS);
			var compEAADF = eval('ctaadfa' + btwYearE);
		  

			  // variables setting
			for ( var i = 0 ; i < ctID.length; i++) {
				  				  
				if (currentAADF[i].length > 0) {
					var currentSize = currentAADF[i] / scale;
					var currentText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] + "<br>Flow: " + Math.floor(currentAADF[i]) +  
										"<br>HGV: " + currentpHGV[i] + "%";
				} else {
					var currentSize = '';
					var currentText = '';
				};
				  		  
				if (compSAADF[i].length > 0 && compEAADF[i].length > 0) {
					if ( (compSAADF[i] > compEAADF[i] ) && (((compSAADF[i] - compEAADF[i]) / compSAADF[i]) < 3) && (((compSAADF[i] - compEAADF[i]) / compSAADF[i]) > 0) ) {		
						var compareSize = (((compSAADF[i] - compEAADF[i]) / compSAADF[i])*100);
						var compareText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] + "<br>Flow Change: -" + (((compSAADF[i] - compEAADF[i]) / compSAADF[i])*100).toFixed(1) + "%";
						var compareColor = 'rgba(77,146,33,0.7)';
					} else if (compSAADF[i] > compEAADF[i] && (((compSAADF[i] - compEAADF[i]) / compSAADF[i])) >= 3) {
						var compareSize = 0;
						var compareText = '';
						var compareColor = 'rgba(255,255,255,0)';
					} else if (compSAADF[i] < compEAADF[i] && (((compEAADF[i] - compSAADF[i]) / compSAADF[i]) < 3) && (((compEAADF[i] - compSAADF[i]) / compSAADF[i]) > 0) ) {
						var compareSize = ((compEAADF[i] - compSAADF[i]) / compSAADF[i])*100;
						var compareText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] + "<br>Flow Change: +" + (((compEAADF[i] - compSAADF[i]) / compSAADF[i])*100).toFixed(1) + "%";
						var compareColor = 'rgba(197,27,125,0.7)';
					} else if (compSAADF[i] < compEAADF[i] && (((compEAADF[i] - compSAADF[i]) / compSAADF[i])) >= 3) {
						var compareSize = 0;
						var compareText = '';
						var compareColor = 'rgba(255,255,255,0)';
					} else {
						var compareSize = 0;
						var compareText = '';
						var compareColor = 'rgba(255,255,255,0)'; 
					}							
				} else {
					  	var compareSize = 0;
						var compareText = '';
						var compareColor = 'rgba(255,255,255,0)';
				};

				ctSize.push(currentSize);
				hoverText.push(currentText);
				  
				cpSize.push(compareSize);
				cphoverText.push(compareText);
				cpColor.push(compareColor);
			}

			// variables for comparison between years map
			var trace1 = {
				type: 'scattermapbox',
				mode: 'markers',
				lon: cLon,
				lat: cLat,
				hoverinfo: 'text',
				counteridtxt: wbtID,
				text: hoverText,
				marker: {
				  size: ctSize,
				  color: 'rgba(31,119,180,0.8)',
				  sizemin: 3
				}};		  
			  
			var trace2 = {
				type: 'scattermapbox',
				mode: 'markers',
				visible: false,
				lon: cLon,
				lat: cLat,
				hoverinfo: 'text',
				counteridtxt: wbtID,
				text: cphoverText,
				marker: {
				  size: cpSize,
				  color: cpColor,
				  sizemin: 3
				}};
			
			var data   = [trace1,trace2];
			  
			var layout = {
				margin: {l:0,r:0,b:0,t:0,pad:0},
				mapbox: {
				  bearing: 5,
				  center: {
					lon: -2.3895264,
					lat: 53.479465
				  },
				  zoom: 10,
				  style:'light'
				},
				showlegend: false
				}

				Plotly.setPlotConfig({
				  mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIzdHE0MGFxNXVubTRxczZ2YmUxaCJ9.hwWZful0U2CQxit4ItNsiQ'
				})

				Plotly.newPlot(gd, data, layout, {showLink: false,displayModeBar : false});		
				
			};
			
			var innerContainer = document.querySelector('[data-num="0"'),
				plotEl = innerContainer.querySelector('.gd'),
				yearSelector = innerContainer.querySelector('#yeardata');
				eyearSelector = innerContainer.querySelector('#btweyear');
				toggleButton = innerContainer.querySelector('#togglebtn');
				vehicleButton = innerContainer.querySelector('#vehicleSelector');
				networkButton = innerContainer.querySelector('#networkSelector');
		
			function assignOptions(textArray, selector) {
			  for (var i = 0; i < textArray.length;  i++) {
				  var currentOption = document.createElement('option');
				  currentOption.text = textArray[i];
				  selector.appendChild(currentOption);
			  }
			}
			
			assignOptions(listofYears, yearSelector);
			
			assignOptions(listofYears, eyearSelector);			
					
			function updateYear(chosenYear,vehType) {
				var ctSize = []
				var hoverText = []
				
				var currentAADF = eval('ctaadf' + vehType + chosenYear);
				var currentpHGV = eval('ctphgv' + chosenYear);

			    var trace1 = [{type: 'scattermapbox',mode: 'markers',lon: cLon,lat: cLat,hoverinfo: 'text',text: hoverText,	marker: {size: ctSize, color: 'rgba(31,119,180,0.8)',		  sizemin: 3}}]			  		  
			  
				for ( var i = 0 ; i < currentAADF.length; i++) {
					  if (currentAADF[i].length > 0) {
						  var currentSize = currentAADF[i] / scale;
						  var currentText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] + "<br>Flow: " + Math.floor(currentAADF[i]) +  
										"<br>HGV: " + currentpHGV[i] + "%";
					  } else {
						  var currentSize = '';
						  var currentText = '';
					  };
					  ctSize.push(currentSize);
					  hoverText.push(currentText);
									  
				}
				
				gd.data[0].marker.size = ctSize;
				gd.data[0].text = hoverText;
								
				Plotly.redraw(gd);
			};
			
			function updateCompare(chosenSYear,chosenEYear,vehType) {
				var cpSize = []
				var cphoverText = []
				var cpColor = []
				
			    var trace2 = [{type: 'scattermapbox',mode: 'markers',lon: cLon,lat: cLat,hoverinfo: 'text',text: cphoverText,marker: {size: cpSize, color: cpColor, sizemin: 3}}]	
				
				var compSAADF = eval('ctaadf' + vehType + chosenSYear);
				var compEAADF = eval('ctaadf' + vehType + chosenEYear);
		  
			    for ( var i = 0 ; i < ctID.length; i++) {
				  if (compSAADF[i].length > 0 && compEAADF[i].length > 0) {
					  if ( (compSAADF[i] > compEAADF[i] ) && (((compSAADF[i] - compEAADF[i]) / compSAADF[i]) < 3) && (((compSAADF[i] - compEAADF[i]) / compSAADF[i]) > 0) ) {		
						  	var compareSize = (((compSAADF[i] - compEAADF[i]) / compSAADF[i])*100);
							var compareText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] +  "<br>Flow Change: -" + (((compSAADF[i] - compEAADF[i]) / compSAADF[i])*100).toFixed(1) + "%";
							var compareColor = 'rgba(77,146,33,0.7)';
					  } else if (compSAADF[i] > compEAADF[i] && (((compSAADF[i] - compEAADF[i]) / compSAADF[i])) >= 3) {
							var compareSize = 0;
							var compareText = '';
							var compareColor = 'rgba(255,255,255,0)';
					  } else if (compSAADF[i] < compEAADF[i] && (((compEAADF[i] - compSAADF[i]) / compSAADF[i]) < 3) && (((compEAADF[i] - compSAADF[i]) / compSAADF[i]) > 0) ) {
							var compareSize = ((compEAADF[i] - compSAADF[i]) / compSAADF[i])*100;
							var compareText = ctRoad[i] + " " + ctDirection[i] + "<br>" + ctID[i] +  "<br>Flow Change: +" + (((compEAADF[i] - compSAADF[i]) / compSAADF[i])*100).toFixed(1) + "%";
							var compareColor = 'rgba(197,27,125,0.7)';
					  } else if (compSAADF[i] < compEAADF[i] && (((compEAADF[i] - compSAADF[i]) / compSAADF[i])) >= 3) {
							var compareSize = 0;
							var compareText = '';
							var compareColor = 'rgba(255,255,255,0)';
					  } else {
							var compareSize = 0;
						    var compareText = '';
						    var compareColor = 'rgba(255,255,255,0)'; 
					  }							
				  } else {
					  	    var compareSize = 0;
						    var compareText = '';
						    var compareColor = 'rgba(255,255,255,0)';
				  };
		  
				  cpSize.push(compareSize);
				  cphoverText.push(compareText);
				  cpColor.push(compareColor);
			    }
			  
			  	gd.data[1].marker.size = cpSize;
				gd.data[1].marker.color = cpColor;
				gd.data[1].text = cphoverText;			

				Plotly.redraw(gd);
			};
			
			
			// Update left side panel legend info for full values & increase/decrease values
			function MapSelect() {
				if (traceNo == 1) {
					document.getElementById('selectorlabel').innerHTML = 'Select a year:';
					document.getElementById('control-row-2').style.display = 'none';
					gd.data[0].visible = true;
					gd.data[1].visible = false;
					Plotly.redraw(gd);
				
					document.getElementById('legend1').className = 'allVCircle';
					document.getElementById('legend2').innerHTML = 'All vehicles';
					document.getElementById('legend3').className = 'carCircle';
					document.getElementById('legend4').innerHTML = 'Cars';					
					document.getElementById('legend5').className = 'hgvCircle';
					document.getElementById('legend6').innerHTML = 'HGVs';					
					
					traceNo = 0
				} else {
					if (yearSelector.value == eyearSelector.value) {
						yearSelector.value = (yearSelector.value - 1);
						updateYear(yearSelector.value,vehDisp);
						updateCompare(yearSelector.value,eyearSelector.value,vehDisp);
					} 
					
					document.getElementById('selectorlabel').innerHTML = 'Select years to compare:';
					document.getElementById('control-row-2').style.display = 'inline';
					gd.data[0].visible = false;
					gd.data[1].visible = true;
					Plotly.redraw(gd);
					
					document.getElementById('legend1').className = 'incCircle';
					document.getElementById('legend2').innerHTML = 'Flow increase';
					document.getElementById('legend3').className = 'decCircle';
					document.getElementById('legend4').innerHTML = 'Flow decrease';					
					document.getElementById('legend5').className = 'blkCircle';
					document.getElementById('legend6').innerHTML = ' ';	
					
					
					traceNo = 1
					}
				
			};
			
			
			function updateYearSel() {
				if (traceNo == 0) {	
					updateYear(yearSelector.value,vehDisp);
					updateCompare(yearSelector.value,eyearSelector.value,vehDisp);
				} else {
					updateCompare(yearSelector.value,eyearSelector.value,vehDisp);
				}
			}
			
			function updateSYearSel() {
					updateCompare(yearSelector.value,eyearSelector.value,vehDisp);
			}
			
			function updateVehType() {
				vehDisp = vehicleButton.value;
				if (vehDisp == 'h') {
					gd.data[0].marker.color = 'rgba(152,78,163,0.7)',
					scale = 500
				} else if (vehDisp == 'a') {
					gd.data[0].marker.color = 'rgba(31,119,180,0.7)',
					scale = 2500
				} else {
					gd.data[0].marker.color = 'rgba(255,127,0,0.7)',
					scale = 2500
				}
				updateYear(yearSelector.value,vehDisp);
				updateCompare(yearSelector.value,eyearSelector.value,vehDisp);
			}
			
			function updateNetwork() {
				netDisp = networkButton.value;
								
				if (netDisp == 'a') {
					gd.data[0].transforms.operation = '!=';
					gd.data[0].transforms.value = 3;
					gd.data[1].transforms.operation = '!=';
					gd.data[1].transforms.value = 3
				} else if (netDisp == 'm') {
					gd.data[0].transforms.operation = '=';
					gd.data[0].transforms.value = 1;
					gd.data[1].transforms.operation = '=';
					gd.data[1].transforms.value = 1
				} else {
					gd.data[0].transforms.operation = '=';
					gd.data[0].transforms.value = 0;
					gd.data[1].transforms.operation = '=';
					gd.data[1].transforms.value = 0
				};
				
				Plotly.redraw(gd);

			}
			
			
			yearSelector.addEventListener('change', updateYearSel, false);
			eyearSelector.addEventListener('change', updateSYearSel, false);
			
			toggleButton.addEventListener('change', MapSelect, false);			
			vehicleButton.addEventListener('change', updateVehType, false);	
			
			networkButton.addEventListener('change', updateNetwork, false);	
			
			var myPlot = document.getElementById('gd');

			gd.on('plotly_click', function(d){
				document.getElementById( 'chartPanel' ).style.display = 'block';
				
				webtrisid = d.points[0].data.counteridtxt[d.points[0].pointNumber];

				var url = "https://he-tris-proxy.herokuapp.com/api/webtris?sites=" + webtrisid + "&start_date=0101" + yearfrom + "&end_date=0101" + yearto;
				
				Plotly.d3.json(url, function(data){
					years = data.AnnualReportBody.map(function(d) { return d.Year; });
					
					aadt = data.AnnualReportBody.map(function(d) { return d.AnnualReportAverages.ADT24Hour; });
					per =  data.AnnualReportBody.map(function(d) { return d.AnnualReportAverages.ADT24LargeVehiclePercentage; });

					aadt = aadt.map(Number);

					aadt_hgv = [];
					aadt_car = [];

					per_hgv = per.map(Number);
					per_car = per_hgv.map( function(value) { return 100 - value; } );

					for (var i = 0; i < aadt.length; i++) {
						aadt_hgv.push( Math.round(aadt[i] * per_hgv[i]/100) );
						aadt_car.push( Math.round(aadt[i] * per_car[i]/100) );
					}					
									
					var upd_data_1 = {y: [aadt_car,aadt_hgv]};
						upd_layt_1 = {title : 'By vehicle type. Counter ID: ' + webtrisid };
						upd_data_2 = {y: [per_car,per_hgv]};
						upd_layt_2 = {title : 'By vehicle type %. Counter ID: ' + webtrisid };
					    upd_data_3 = {y: [aadt]};
						upd_layt_3 = {title : 'All vehicles. Counter: ' + webtrisid };

				Plotly.update('plotdiv_01', upd_data_1, upd_layt_1);
				Plotly.update('plotdiv_02', upd_data_2, upd_layt_2);
				Plotly.update('plotdiv_03', upd_data_3, upd_layt_3);
					
				});
				
			});

			window.onresize = function() {
				Plotly.Plots.resize(gd);
			};

	});
	
	

})();