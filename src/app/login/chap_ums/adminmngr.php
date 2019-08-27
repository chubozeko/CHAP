<?php
/********************************************************************************************************************/
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
$error = false;

$email = htmlspecialchars($ADMINMAIL);
if($ADBTN=="Create Admin Account")
	// First Check Button value is Create Account
{
	if($_SESSION['STATUS'] == "Read Only")
	{
		$error = true;
        $STATUSError = "You Dont Have An Autatication To Make Change !!.";
		echo "<script type=\"text/javascript\"> 
	                 alert('$STATUSError');
		         </script> ";
	}
	else{
	if($ADMINID!=""AND$ADMINNAME!=""AND$ADMINSURNAME!=""AND$ADMINMAIL!=""AND $email!=""AND$ADMINPASS!=""AND$ADMINSTATUS!=""AND$CONFIRM!="")
	{
	       if(strlen($ADMINNAME) < 3 AND strlen($ADMINSURNAME)<3)
		// Third Check if username and surname has less than three characters
	{
		$error=True;
		$username_surname_error="Username and Surname must have more than 3 characters  ";
		echo "<script type=\"text/javascript\"> 
	                 alert('$username_surname_error');
	         </script> ";
	}
	else if(!preg_match("/^[a-zA-Z ]+$/",$ADMINNAME)AND!preg_match("/^[a-zA-Z ]+$/",$ADMINSURNAME))
		//Check if username and surname contains alphabets or not
	{
		$error=True;
		$username_surname_error="Username and Surname Must Contains Alphabet !!";
		echo "<script type=\"text/javascript\"> 
	                 alert('$username_surname_error');
	         </script> ";
	}
	elseif ( !filter_var($email,FILTER_VALIDATE_EMAIL) )
	//Forth Check if user email is valid or not 
	{
		$error = true;
         $emailError = "**Please enter valid email address.";
		 /*echo "<script type=\"text/javascript\"> 
	                 alert('$emailError');
	
	         </script> ";*/
	}
	 else if(strlen($ADMINPASS) < 6) //Check if password size is less than six characters
	 {
        $error = true;
        $passError = "Password must have atleast 6 characters !!.";
		echo "<script type=\"text/javascript\"> 
	                 alert('$passError');
	
	         </script> ";
  }
	else{
	if($CONFIRM==$ADMINPASS)
		//Fifth Confirm if password is same with the confirm password field
	{
		//User Registration Code Here!!
		
		
		$SQL_COMMAND = "INSERT INTO `$admintb`(id,adname,adsurname,email,password,status,ip) VALUES ('$ADMINID','$ADMINNAME','$ADMINSURNAME','$email','$ADMINPASS','$ADMINSTATUS','$IP')";
	
		$control_Con = mysqli_query($conn,$SQL_COMMAND);
		
		 
		if($control_Con)
			//Chech if Data saved or not in database 
		{
		$Check = "Welcome To CHAP!! You Successfully Create CHAP Account  Please Login Now !! ";
			
			 echo "<script type=\"text/javascript\"> 
	                                       alert('$Check');
	
	               </script> ";
		}
		else
		{
			$Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Conncetion ";
			 echo "<script type=\"text/javascript\"> 
	                                       alert('$Check');
	
	               </script> ";
		}
	}
	else{
	             echo "<script type=\"text/javascript\"> 
	                                       alert('Your Password Is In Correct Please Check & Try Again !!!');
	
	                   </script> ";
	
	}
	}
	}
	else
	{
	     echo "<script type=\"text/javascript\"> 
	            alert('Do not Leave Empty Space ');
	            </script> ";	
	}
}
}	
?>



<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="CSS/ADMINPNL.css">
<title>Admin Manager</title>
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

<li><button style="background:transparent url(logo/adminpnlicon/adminmngr.png) no-repeat left center; width:220px; height:40px; color:#FFFFFF; " class="menubottomSTLY"onclick="location.href='adminmngr.php';" > ADMIN MANAGER</button></li>
<li><button style="background: transparent url(logo/adminpnlicon/userico.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY" onclick="location.href='usrinfo.php';"> &emsp;USER INFORMATION</button></li>
<li><button style="background: transparent url(logo/adminpnlicon/login.png) no-repeat left center; width:220px; height:40px;"class="menubottomSTLY"onclick="location.href='logininfo.php';"> &emsp;LOGIN INFORMATION</button></li>
      
<li><button style="background:transparent url(logo/adminpnlicon/logout.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY"onclick="location.href='logoutinfo.php';" > &emsp;&nbsp; &nbsp; LOGOUT INFORMATION</button></li>
   
  </ul>
  </div>
  
 
  <div class="content" id="CONTENT">
   <div class="LOG_OUT	">Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;<a href="logout.php">LOG OUT</a></div>

 
     &emsp; 
    ADMIN MANAGER 
    <br>
	<br>
   <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
	
	
    &nbsp;&emsp;<input type="text" name="adnmID" id="adnmID" class="adminmngrTXTBXcss"  placeholder="Admin ID"/>&nbsp;&emsp;<input type="text" name="adnm" id="adnm" class="adminmngrTXTBXcss"  placeholder="Admin Name"/>&nbsp;&emsp;<input  type="text" name="adsrm" id="adsrm" maxlength="15" placeholder="Admin Surname" class="adminmngrTXTBXcss"/ >&nbsp;&emsp;<input type="text" name="adem" id="adem"  placeholder="Admin  Email"  maxlength="30" class="adminmngrTXTBXcss" /><?php echo $emailError; ?>
    </br>
    </br>
   &nbsp;&emsp;<input  type="text" name="adpass" id="adpass" maxlength="20" placeholder="Create Admin Password" class="adminmngrTXTBXcss" />&nbsp;&emsp;<input  type="text" name="confirmpass" id="confirmpass"  maxlength="20" placeholder="Confirm Admin Password" class="adminmngrTXTBXcss" /><br> <br> &nbsp;&emsp; <label>Assign Admin Authorization:</label>
  
     <label>
      <input type="radio" name="adsts" id="adsts" value="Read Only" />
	  Read Only
    </label>
    &emsp; 
	<label>
      <input type="radio" name="adsts" id="adsts" value="Read & Write" />
	  Read & Write
     </label>
   </br>
   </br>
   &nbsp;&emsp;<input type="submit" name="admnBTN" id="admnBTN" value="Create Admin Account" class="admnbtn"/>&emsp;<input type="reset" id="admnBTN" value="Reset" class="admnbtnRST"/>&emsp;
    </form>
	</br>
	</br>
<?php
}
?>
<div class="listtable">
<?php 
require_once('PHP/dbadapter.php'); // Veritabanı bağlantı dosyası
?>
<?php
$sayfa=$_GET['sayfa']; //get ile gelen sayfayı alıyoruz

if (!is_numeric($sayfa) || $sayfa=="") { $sayfa=1; } // sayfa rakam değilse ve boş ise sayfayı 1 yapıyoruz

$kacar=5; //buraya 1 sayfada kaç kayıt göstermek istediğinizi giriniz.
$kayit_sayisi=mysqli_fetch_array(mysqli_query($conn,"SELECT COUNT(*) FROM $admintb"));
##$kayit_sayisi=mysql_fetch_array(mysql_query("SELECT COUNT(*) FROM $log_in"));
$sayfa_sayisi=$kayit_sayisi['0']/$kacar; //kayit sayısını sayfada gösterilecek kayıt sayısına bölerek sayfa sayısını buluyoruz

if ($sayfa_sayisi%$kacar!=0) { $sayfa_sayisi++; } //sayfa sayısının kacar a göre modunu aldık 0 dan farklı ise sayfa sayısını 1 arttırdık.yani 7 kayit varsa 2 sayfa yapmak için bu gerekli.

$nerden=($sayfa*$kacar)-$kacar;  //sorguda nerden kısmı örn 2. sayfada bu değer 5 olacaktır
$nereye=($sayfa*$kacar); //sorguda nereye kısmı örn 2. sayfada bu değer 10 olacaktır.yani 2 sayfada 5. kayıttan 10. kayıta kadar olan kısmı yazdırmak için.
$sorgu=mysqli_query($conn,"SELECT * FROM $admintb LIMIT $nerden, $nereye");
##$sorgu=mysql_query("SELECT * FROM $log_in LIMIT $nerden, $nereye"); //Sorgumuz
echo"<html>
<body>
<table   width=\"90%\" border=1 border-style=\"solid\" bordercolor=\"#000000\" class=\"table2\"  >
<tr >
<td>Admin ID</td>
<td>Admin Name</td>
<td>Admin Surname</td>
<td>Admin Email</td>
<td>Status</td>
<td>IP</td>
<td>Register Date</td>
</tr>";
while ($veri=mysqli_fetch_array($sorgu)) { //döngü ile veritabanındaki verileri ekrana veriyoruz.
$adminid=$veri['id'];
$adminname=$veri['adname'];
$adminsurname=$veri['adsurname'];
$adminemail=$veri['email'];
$adminstatus=$veri['status'];
$adminip=$veri['ip'];
$adminregdate=$veri['reg_date_time'];
echo "
<tr><td >$adminid</td> <td>$adminname</td>  <td>$adminsurname</td>   <td>$adminemail </td> <td>$adminstatus</td>  <td>$adminip</td>   <td>$adminregdate </td> 

</tr> ";
}
echo "
</table></body></html>";
for ($i=1; $i<=$sayfa_sayisi; $i++) { //sayfaları yazdıracağımız döngümüz.
echo "| <a href='logininfo.php?sayfa=$i'>$i </a>|";
}
?>
 
 </div>
  </div>
<div id="FOOTER" class="footer">Content for  id "FOOTER" Goes Here</div>
</div>
</body>
</html>
