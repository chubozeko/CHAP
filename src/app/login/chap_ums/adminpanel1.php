<?php
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
?>
<?php
session_start();
if(!isset($_SESSION["sess_user"]))
{
	header("Location:index.php");
}
else
{
	
?>
<?php

###############################################################
$SQLQERY1="SELECT country,COUNT(*)as number FROM $user_info GROUP BY country";
$result1=mysqli_query($conn,$SQLQERY1);
?>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="CSS/ADMINPNL.css">
<title>AdminPanel</title>
<style type="text/css">
body {
	background-color: #DDDDDD;
}
a:link {
	color: #000;
	text-decoration: none;
}
a:visited {
	text-decoration: none;
	color: #000;
}
a:hover {
	text-decoration: none;
}
a:active {
	text-decoration: none;
}
</style>
 <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
     google.charts.load('current', {
        'packages':['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable([
          ['Country', 'Popularity'],
          <?php
		  While($row = mysqli_fetch_array($result1))
		  {
			  echo"['".$row["country"]."',".$row["number"]."],";
		  }
		  ?>
        ]);

        var options = {
			backgroundColor:'#EAEFE9',
		};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }

	  
    </script>
</head>

<body>
<div id="CONTAINER" class="container">
  <div id="HEADER" class="header" >
    <div id="INSERT LOGO HERE" class="LOGODIV"><img src="logo/chaplogo.png" width="132" height="117"></div>
    <div id="TITLE HERE" class="TITLEDIV">
      <h3>CHAP USER MANAGEMENT SYSTEMS (UMS)</h3>
    </div>
  </div>
      
  <div id="NAVBAR" class="sidebar1">
  <ul class="listViewStly">
<li><button style="background:transparent url(logo/adminpnlicon/dashboard.png) no-repeat left center; width:220px; height:40px; color:#FFFFFF; "class="menubottomSTLY"  onclick="location.href='ADMINPANEL.php';"> DASHBOARD </button> </li>
   
<li><button style="background:transparent url(logo/adminpnlicon/adminmngr.png) no-repeat left center; width:220px; height:40px; " class="menubottomSTLY"onclick="location.href='adminmngr.php';" > ADMIN MANAGER</button></li>
<li><button style="background: transparent url(logo/adminpnlicon/userico.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY" onclick="location.href='usrinfo.php';"> &emsp;USER INFORMATION</button></li>
 <li><button style="background: transparent url(logo/adminpnlicon/login.png) no-repeat left center; width:220px; height:40px;
      "class="menubottomSTLY"onclick="location.href='logininfo.php';"> &emsp;LOGIN INFORMATION</button></li>
 <li><button style="background:transparent url(logo/adminpnlicon/logout.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY"onclick="location.href='logoutinfo.php';" > &emsp;&nbsp; &nbsp; LOGOUT INFORMATION</button></li>
   
  </ul>
  
  
  </div>
  <div id="CONTENT" class="content">
  <div class="LOG_OUT	">Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;<a href="logout.php">LOG OUT</a></div>
  
 &emsp;CHAP POPULARITY BASE ON COUNTRY
 &emsp;<div id="regions_div" style="width: 900px; height: 500px;"></div>
  <br>
 <br>
 <br>
 <br>
  </div>

  
 <div class="footerbar"><a href="ADMINPANEL.php"><< Back To Page </a></div> 
<div id="FOOTER" class="footer">Content for  id "FOOTER" Goes Here</div>
</div>
</body>
</html>
<?php
}
?>