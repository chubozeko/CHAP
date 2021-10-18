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
if ($sec=="List All"){
  $limit=999999; #Sayfalama Değeri 
  if (isset($_GET["page"])) {
    $page  = $_GET["page"]; 
    } 
    else{ 
    $page=1;
    };  
  $start_from = ($page-1) * $limit;  
  $result = mysqli_query($conn,"SELECT * FROM `$admintb` ORDER BY id ASC LIMIT $start_from, $limit"); 
}else{
$limit=3; #Sayfalama Değeri 
if (isset($_GET["page"])) {
	$page  = $_GET["page"]; 
	} 
	else{ 
	$page=1;
	};  
$start_from = ($page-1) * $limit;  
$result = mysqli_query($conn,"SELECT * FROM `$admintb` ORDER BY id ASC LIMIT $start_from, $limit");
}
?>

<?php
$SQLTYPE0FBROWSER="SELECT type_of_browser,COUNT(*)as number FROM $log_in GROUP BY type_of_browser";
$A=mysqli_query($conn,$SQLTYPE0FBROWSER);
###############################################################
$SQLGENDER="SELECT gender,COUNT(*)as number FROM $user_info GROUP BY gender";
$B=mysqli_query($conn,$SQLGENDER);
###############################################################
$TOTAL_USER=mysqli_fetch_array(mysqli_query($conn,"SELECT COUNT(*) FROM $user_info"));
###############################################################
$SQL_OS="SELECT opsystem,COUNT(*)as number FROM $log_in GROUP BY opsystem";
$OS=mysqli_query($conn,$SQL_OS);
###########################################################
$SQLQERY1="SELECT country,COUNT(*)as number FROM $user_info GROUP BY country";
$result1=mysqli_query($conn,$SQLQERY1);

?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">
<!-- Bootstrap Kütüphane Kodu BAŞLANGIÇ -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
<!-- Bootstrap Kütüphane Kodu BİTİŞ -->

<!-- Sayfa GENEL CSS BAŞLANGIÇ -->
<link rel="stylesheet" href="CSSLIB/STIL.css"> 

<!-- Sayfa GENEL CSS BİTİŞ -->
<script type="text/Javascript">
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}


    
      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Type Of Browser', 'Number'],
          <?php
		  While($row = mysqli_fetch_array($A))
		  {
			  echo"['".$row["type_of_browser"]."',".$row["number"]."],";
		  }
		  ?>
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
          <?php
		  While($row = mysqli_fetch_array($B))
		  {
			  echo"['".$row["gender"]."',".$row["number"]."],";
		  }
		  ?>
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
          <?php
		  While($row = mysqli_fetch_array($OS))
		  {
			  echo"['".$row["opsystem"]."',".$row["number"]."],";
		  }
		  ?>
        ]);

        var options = {
          title: 'TESTED OS',
          pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('OS'));
        chart.draw(data, options);
      }
      
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
    <script type="text/javascript">
    function printDiv(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    } 
</script>
<title>Dashboard</title>
</head>
<body>
<form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
<div id="mySidebar" class=" sidebar" name="YAN AÇILIR MENÜ BAŞLANGICI">
<h5> <b>&nbsp;MENU</b><a href="javascript:void(0)" class="closebtn " onclick="closeNav()">×</a> </h5>
<ul class="nav nav-pills flex-column ">
        <li class="nav-item">
        <a class="nav-link active" href="main.php" ><i class="fas fa-tachometer-alt"></i> &nbsp;Dashboard</a>
</li>
        <li class="nav-item ">
        <a class="nav-link" href="adminpanel.php" ><i class="fas fa-users-cog"></i>&nbsp;Admin Manager</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="userinfo.php" ><i class="fas fa-users"></i>&nbsp;User Information</a>
        </li>
		 <li class="nav-item">
          <a class="nav-link" href="login.php" ><i class="fas fa-sign-out-alt"></i>&nbsp;Log In Information</a>
        </li>
      </ul>
</div>

<div id="main" name="ANA SAYFA"><!-- ANA SAYFA-->
                   
        
          <div class="container-fluid"><!-- ANA KONTEYNER -->  
          <nav class="navbar navbar-dark bg-dark">
              <a class="navbar-brand" href="main.php"><b>CHAP User Management Systems</b></a>
              
              <form class="form-inline">
              
              <button type="button" name="MENU" class="btn my-2 my-sm-0 btn-dark " onclick="openNav()"><b>☰ Menu</b></button><!-- Sütün 2-->
             
            </nav>
          
                       
             
                          <div class="container-fluid "><!-- İçerik -->
                          <br>
                          <div class="row">
                              <div class="col-sm-12 text-right ">
                                   <a class="btn my-2 my-sm-0 btn-dark   " href="logout.php" > Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;LOG OUT</a>

                              </div>
                              <?php
  } # Session End
                              ?>
                          </div>
                          <br>
                                  <div class="row">
                                      <div class="col-sm-4">
                                          <div class="card">
                                              <div class="card-body">
                                                  <div id="donutchart"></div> 
                                              </div>
                                          </div>
                                      </div> 
                                      <div class="col-sm-4">
                                          <div class="card">
                                              <div class="card-body">
                                              <div id="gender"></div>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="col-sm-4">
                                          <div class="card">
                                              <div class="card-body">
                                                    <div id="OS"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-sm-6">
                                          <div id="regions_div" style="width: 100%; height: 400px;" ></div>
                                    </div>
                                  </div>
                                

                                












                          
                          </div><!-- İçerik -->
              </div><!-- ANA KONTEYNER -->          
</div><!-- ANA SAYFA-->






  </form>

 
</body>
</html> 