google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Type Of Browser', 'Number'],
    // <?php
    //   While($row = mysqli_fetch_array($A)) {
    //     echo"['".$row["type_of_browser"]."',".$row["number"]."],";
    //   }
    // ?>
  ]);

  var options = {
    title: 'ACCESSED BROWSER TYPE',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(GENDER);
function GENDER() {
  var data = google.visualization.arrayToDataTable([
    ['Gender', 'Number'],
    // <?php
    //   While($row = mysqli_fetch_array($B)) {
    //     echo"['".$row["gender"]."',".$row["number"]."],";
    //   }
    // ?>
  ]);

  var options = {
    title: 'GENDER RATIO',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('gender'));
  chart.draw(data, options);
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(OS);

function OS() {
  var data = google.visualization.arrayToDataTable([
    ['Operating Systems', 'Number'],
    // <?php
    //   While($row = mysqli_fetch_array($OS)) {
    //     echo"['".$row["opsystem"]."',".$row["number"]."],";
    //   }
    // ?>
  ]);

  var options = {
    title: 'TESTED OPERATION SYSTEMS',
    pieHole: 0.4,
  };

  var chart = new google.visualization.PieChart(document.getElementById('OS'));
  chart.draw(data, options);
}