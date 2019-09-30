<?php
require "dbconnect.php";
require "variable.php";

session_start();
if(!isset($_SESSION["sess_user"])) {
	header("Location:index.php");
}
else {
	$SQLTYPE0FBROWSER = "SELECT type_of_browser,COUNT(*) as number FROM $log_in GROUP BY type_of_browser";
	$A = mysqli_query($conn,$SQLTYPE0FBROWSER);
	###############################################################
	$SQLGENDER = "SELECT gender,COUNT(*) as number FROM $user_info GROUP BY gender";
	$B = mysqli_query($conn,$SQLGENDER);
	###############################################################
	$TOTAL_USER = mysqli_fetch_array(mysqli_query($conn,"SELECT COUNT(*) FROM $user_info"));
	###############################################################
	$SQL_OS = "SELECT opsystem,COUNT(*) as number FROM $log_in GROUP BY opsystem";
	$OS = mysqli_query($conn,$SQL_OS);

	# Inline PHP code
	while ($row = mysqli_fetch_array($A)) {
		$arr_browserType[] = "['" . $row["type_of_browser"] . "'," . $row["number"] . "],";
	}
	while ($row = mysqli_fetch_array($B)) {
		$arr_gender[] = "['" . $row["gender"] . "'," . $row["number"] . "],";
	}
	while ($row = mysqli_fetch_array($OS)) {
		$arr_OS[] = "['" . $row["opsystem"] . "'," . $row["number"] . "],";
	}
	$session_user = $_SESSION['sess_user'];
	$nrOfUsers = "Total Number Of User: " . $TOTAL_USER['0'];
}

$res_array = array(
	'browserTypes' => $arr_browserType,
	'gender' => $arr_gender,
	'os' => $arr_OS,
	'sessionUser' => $session_user,
	'nrOfUsers' => $nrOfUsers
);

echo json_encode($res_array) . "\n";

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
	google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
  	var data = google.visualization.arrayToDataTable([
    	['Type Of Browser', 'Number'],
			// <?php
		  // 	While($row = mysqli_fetch_array($A)) {
			//   	echo"['".$row["type_of_browser"]."',".$row["number"]."],";
		  // 	}
		  // ?>
      ]);

    var options = {
    	title: 'ACCESSED BROWSER TYPE',
      pieHole: 0.4,
		};

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  }

	google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(GENDER);
	function GENDER() {
  	var data = google.visualization.arrayToDataTable([
    	['Gender', 'Number'],
      // <?php
		  // 	While($row = mysqli_fetch_array($B)) {
			//   	echo"['".$row["gender"]."',".$row["number"]."],";
		  // 	}
		  // ?>
    ]);

    var options = {
			title: 'GENDER RATIO',
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('gender'));
    chart.draw(data, options);
  }

	google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(OS);

	function OS() {
  	var data = google.visualization.arrayToDataTable([
    	['Operating Systems', 'Number'],
      // <?php
		  // 	While($row = mysqli_fetch_array($OS)) {
			//   	echo"['".$row["opsystem"]."',".$row["number"]."],";
		  // 	}
		  // ?>
    ]);

    var options = {
    	title: 'TESTED OPERATION SYSTEMS',
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('OS'));
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
  	<div class="LOG_OUT">Welcome Admin:&emsp; =$_SESSION['sess_user']; &emsp;<a href="logout.php">LOG OUT</a></div><br>
  	<table class="DASHTABLE">
	    <tr>
	      <td> <div id="donutchart" style="width: 350px; height: 200px; "></div></td>
	      <td><div id="gender" style="width: 350px; height: 200px; "></div></td>
	    </tr>
	    <tr>
	      <td><?php echo" &emsp;Total Number Of User:&ensp;"; echo $TOTAL_USER['0']; ?></td>
	      <td><div id="OS" style="width: 350px; height: 200px; "></td></div>
	    </tr>
	    <tr>
	      <td>&nbsp;</td>
	      <td>&nbsp;</td>
	    </tr>
	    <tr>
	      <td>&nbsp;</td>
	      <td>&nbsp;</td>
	    </tr>
	    <tr>
	      <td>&nbsp;</td>
	      <td>&nbsp;</td>
	    </tr>
	    <tr>
	      <td>&nbsp;</td>
	      <td>&nbsp;</td>
	    </tr>
  	</table>
  </div>

	<div class="footerbar"><a href="adminpanel1.php">Next Page>></a></div>
	<div id="FOOTER" class="footer">Content for  id "FOOTER" Goes Here</div>
</div>
</body>
</html>
