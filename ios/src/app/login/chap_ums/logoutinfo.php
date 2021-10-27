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




<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="CSS/ADMINPNL.css">
<title>Logout Information</title>
<style type="text/css">
body {
	background-color: #DDDDDD;
}
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
  <li><button style="background:transparent url(logo/adminpnlicon/dashboard.png) no-repeat left center; width:220px; height:40px; "class="menubottomSTLY"  onclick="location.href='ADMINPANEL.php';"> DASHBOARD </button> </li>
   
<li><button style="background:transparent url(logo/adminpnlicon/adminmngr.png) no-repeat left center; width:220px; height:40px; " class="menubottomSTLY"onclick="location.href='adminmngr.php';" > ADMIN MANAGER</button></li>
    <li><button style="background: transparent url(logo/adminpnlicon/userico.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY" onclick="location.href='usrinfo.php';"> &emsp;USER INFORMATION</button></li>
     <li><button style="background: transparent url(logo/adminpnlicon/login.png) no-repeat left center; width:220px; height:40px;
      "class="menubottomSTLY"onclick="location.href='logininfo.php';"> &emsp;LOGIN INFORMATION</button></li>
      <li><button style="background:transparent url(logo/adminpnlicon/logout.png) no-repeat left center; width:220px; height:40px; color:#FFFFFF;" class="fltlft"onclick="location.href='logoutinfo.php';" > &emsp;&nbsp; &nbsp; LOGOUT INFORMATION</button></li>
   
  </ul>
  
  
  </div>
  <div class="content" id="CONTENT">
  <div class="LOG_OUT	">Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;<a href="logout.php">LOG OUT</a></div>

 <?php
}
?>
     &emsp;LOGOUT INFORMATIONS
     <br>
     <br>
     <div class="listtable">
   <?php 
require_once('PHP/dbadapter.php'); // Veritabanı bağlantı dosyası
?>
<?php
$sayfa=$_GET['sayfa']; //get ile gelen sayfayı alıyoruz

if (!is_numeric($sayfa) || $sayfa=="") { $sayfa=1; } // sayfa rakam değilse ve boş ise sayfayı 1 yapıyoruz

$kacar=5; //buraya 1 sayfada kaç kayıt göstermek istediğinizi giriniz.
$kayit_sayisi=mysqli_fetch_array(mysqli_query($conn,"SELECT COUNT(*) FROM $log_out"));
##$kayit_sayisi=mysql_fetch_array(mysql_query("SELECT COUNT(*) FROM $log_in"));
$sayfa_sayisi=$kayit_sayisi['0']/$kacar; //kayit sayısını sayfada gösterilecek kayıt sayısına bölerek sayfa sayısını buluyoruz

if ($sayfa_sayisi%$kacar!=0) { $sayfa_sayisi++; } //sayfa sayısının kacar a göre modunu aldık 0 dan farklı ise sayfa sayısını 1 arttırdık.yani 7 kayit varsa 2 sayfa yapmak için bu gerekli.

$nerden=($sayfa*$kacar)-$kacar;  //sorguda nerden kısmı örn 2. sayfada bu değer 5 olacaktır
$nereye=($sayfa*$kacar); //sorguda nereye kısmı örn 2. sayfada bu değer 10 olacaktır.yani 2 sayfada 5. kayıttan 10. kayıta kadar olan kısmı yazdırmak için.
$sorgu=mysqli_query($conn,"SELECT * FROM $log_out LIMIT $nerden, $nereye");
##$sorgu=mysql_query("SELECT * FROM $log_in LIMIT $nerden, $nereye"); //Sorgumuz
echo"<html>
<body>
<table   width=\"90%\" border=1 border-style=\"solid\" bordercolor=\"#000000\" class=\"table2\"  >
<tr >
<td>User ID</td>
<td>Logout Date & Time</td>

</tr>";
while ($veri=mysqli_fetch_array($sorgu)) { //döngü ile veritabanındaki verileri ekrana veriyoruz.
$logoutid=$veri['usrid'];
$LOGDATETIME=$veri['logout_time_date'];

echo "
<tr><td>$logoutid</td> <td>$LOGDATETIME</td> 

</tr> ";
}
echo "
</table></body></html>";
for ($i=1; $i<=$sayfa_sayisi; $i++) { //sayfaları yazdıracağımız döngümüz.
echo "| <a href='logoutinfo.php?sayfa=$i'>$i </a>|";
}
?>
</div>
  </div>
<div id="FOOTER" class="footer">Content for  id "FOOTER" Goes Here</div>
</div>
</body>
</html>
