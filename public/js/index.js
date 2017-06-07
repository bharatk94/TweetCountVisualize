$(document).ready(function () {
  $.ajax({
    url: "http://localhost:3001/countries/",
    success: function (result) {


      var div = "";
      div += "<option style='opacity=0.5' disabled selected>Choose Country</option>";

      for (var i = 0; i < result.countries.length; i++) {
        div += "<option>" + result.countries[i] + "</option>";
      }
      console.log(div)
      $('#country1').html(div);
      $('#country2').html(div);
      $('#commonTrends').html("Please select a country to proceed").addClass("trendscol");
    }
  });


  $('#country1').on('change', function () {
    getTrends();
  })

  $('#country2').on('change', function () {
    getTrends();
  })

  function getTrends() {
    var selected1 = $('#country1').val();
    var selected2 = $("#country2").val();
    $.ajax({
      url: "http://localhost:3001/countries/" + selected1 + "/trends/",
      success: function (result1) {
        var populate = "";

        for (var i = 0; i < result1.trends.length; i++) {
          populate += "<p class='trendscol'>" + result1.trends[i].name + "</p>";
        }

        $('#commonTrends').html(populate);


        $.ajax({
          url: "http://localhost:3001/countries/" + selected2 + "/trends/",
          success: function (result2) {


            if (selected1 != selected2) {
              commonTrends(result1, result2);
            } else {

              $('#commonTrends').html("Please select different countries for Data Visualization ").css("color", "red");
              $("#chartDiv").html("");

            }

          }
        });
      }
    });

  }

  function commonTrends(trnd1, trnd2) {
    var showcommon = "";
    var dataProvider = [];
    var totalcount = 0;
    for (var i = 0; i < trnd1.trends.length; i++) {
      for (var j = 0; j < trnd2.trends.length; j++) {

        if (trnd1.trends[i].name == trnd2.trends[j].name) {
          console.log(trnd1.trends[i].name)
          showcommon += "<p class='trendscol'>" + trnd1.trends[i].name + "</p>";
          trendlength = trnd1.trends[i].name.length;
          var jsonData = {};
          jsonData.indexLabel = trnd1.trends[i].name;
          jsonData.y = trnd1.trends[i].name.length;
          dataProvider.push(jsonData);
          totalcount += parseInt(jsonData.y);
          console.log(jsonData)
        }
        $('#commonTrends').html(showcommon);
      }
    }
    console.log(dataProvider)
    displayChart(dataProvider, totalcount);
  }

  function displayChart(dataProvider, count) {
    for (var i = 0; i < dataProvider.length; i++)
      dataProvider[i].y = (dataProvider[i].y / count) * 100;
    var chart = new CanvasJS.Chart("chartDiv", {
      title: {
        text: "Trend weights contribution"
      },
      animationEnabled: true,
      theme: "theme",
      data: [{
        type: "doughnut",
        indexLabelFontFamily: "Garamond",
        indexLabelFontSize: 20,
        startAngle: 0,
        indexLabelFontColor: "dimgrey",
        indexLabelLineColor: "darkgrey",
        toolTipContent: "{y} %",

        dataPoints: dataProvider
      }]
    });

    chart.render();

  }


});