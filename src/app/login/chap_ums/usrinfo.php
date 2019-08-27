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

$email = htmlspecialchars($MAIL);


if(isset($_POST['USRINFO']))
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
	if($USRNM!=""AND$SRNM!=""AND$GNDR!=""AND$CONTRY!=""AND$MAIL!=""AND$email!=""AND$PASS!=""AND$CNFRMPASS!="")
	{
		if(strlen($USRNM) < 3 AND strlen($SRNM)<3)
		// Third Check if username and surname has less than three characters
	{
		$error=True;
		$username_surname_error="Username and Surname must have more than 3 characters  ";
		echo "<script type=\"text/javascript\"> 
	                 alert('$username_surname_error');
	
	         </script> ";
	}
	else if(!preg_match("/^[a-zA-Z ]+$/",$USRNM)AND!preg_match("/^[a-zA-Z ]+$/",$SRNM))
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
		 echo "<script type=\"text/javascript\"> 
	                 alert('$emailError');
	
	         </script> ";
	}
	 else if(strlen($PASS) < 6) //Check if password size is less than six characters
	 {
        $error = true;
        $passError = "Password must have atleast 6 characters !!.";
		echo "<script type=\"text/javascript\"> 
	                 alert('$passError');
	
	         </script> ";
	}
	else
	{
		if($PASS==$CNFRMPASS)
		//Fifth Confirm if password is same with the confirm password field
	{
		//User Registration Code Here!!
		
		
		$SQL_COMMAND = "INSERT INTO `$user_info`(user_ip,usrname,usrsurname,email,password,country,gender) VALUES ('$IP', '$USRNM', '$SRNM', '$email', '$PASS', '$CONTRY', '$GNDR')";
	
		$control_Con = mysqli_query($conn,$SQL_COMMAND);
		
		 
		if($control_Con)
			//Chech if Data saved or not in database 
		{
		$Check = "New User Account Created Succesfully By Admin!! ";
			
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
	else 
	{
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
<title>User Information</title>
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
   
<li><button style="background:transparent url(logo/adminpnlicon/adminmngr.png) no-repeat left center; width:220px; height:40px; " class="menubottomSTLY"onclick="location.href='adminmngr.php';" > ADMIN MANAGER</button></li>
    <li><button style="background: transparent url(logo/adminpnlicon/userico.png) no-repeat left center; width:220px; height:40px; color:#FFFFFF;" class="menubottomSTLY" onclick="location.href='usrinfo.php';"> &emsp;USER INFORMATION</button></li>
     <li><button style="background: transparent url(logo/adminpnlicon/login.png) no-repeat left center; width:220px; height:40px;
      "class="menubottomSTLY"onclick="location.href='logininfo.php';"> &emsp;LOGIN INFORMATION</button></li>
      <li><button style="background:transparent url(logo/adminpnlicon/logout.png) no-repeat left center; width:220px; height:40px;" class="menubottomSTLY"onclick="location.href='logoutinfo.php';" > &emsp;&nbsp; &nbsp; LOGOUT INFORMATION</button></li>
   
  </ul>
  
  
  </div>
  <div class="content" id="CONTENT">
   <div class="LOG_OUT	">Welcome Admin:&emsp;<?=$_SESSION['sess_user'];$_SESSION['STATUS'];?>&emsp;<a href="logout.php">LOG OUT</a></div>

 
     &emsp;USER INFORMATION<br>&emsp;Create New User Account
     <br>
	 <br>
  <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
   
    &nbsp;&emsp;<input  type="text" name="A" id="A" maxlength="20"  class="adminmngrTXTBXcss" placeholder="Name"/>&nbsp;&emsp;<input  type="text" name="B" id="B"   maxlength="15" class="adminmngrTXTBXcss" placeholder=" Surname"/>&nbsp;&emsp;<input type="email" name="E" id="E" class="adminmngrTXTBXcss" maxlength="30" placeholder="Email"/>
    </br>
    </br>
   &nbsp;&emsp;<input  type="text" name="F" id="F"  maxlength="20" class="adminmngrTXTBXcss" placeholder="Create Password"/>&nbsp;&emsp;<input  type="text" name="G" id="G" maxlength="20" class="adminmngrTXTBXcss" placeholder="Confirm  Password"/>
   &nbsp;&emsp;Gender: 
   <input type="radio" name="C" id="Male" value="Male">
   Male
   <input type="radio" name="C" id="Female" value="Female">
   Female
   <input type="radio" name="C" id="Other" value="Others">
   Others <br> <br>
   &nbsp;&emsp; Select Your Country : 
    <select name="D" class="Cuntry">
       <option value="NULL">Select Your Country</option>
     <option value="Afghanistan">Afghanistan</option>
     <option value="Åland Islands">Åland Islands</option>
     <option value="Albania">Albania</option>
     <option value="Algeria">Algeria</option>
     <option value="American Samoa">American Samoa</option>
     <option value="Andorra">Andorra</option>
     <option value="Angola">Angola</option>
     <option value="Anguilla">Anguilla</option>
     <option value="Antarctica">Antarctica</option>
     <option value="Antigua and Barbuda">Antigua and Barbuda</option>
     <option value="Argentina">Argentina</option>
     <option value="Armenia">Armenia</option>
     <option value="Aruba">Aruba</option>
     <option value="Australia">Australia</option>
     <option value="Austria">Austria</option>
     <option value="Azerbaijan">Azerbaijan</option>
     <option value="Bahamas">Bahamas</option>
     <option value="Bahrain">Bahrain</option>
     <option value="Bangladesh">Bangladesh</option>
     <option value="Barbados">Barbados</option>
     <option value="Belarus">Belarus</option>
     <option value="Belgium">Belgium</option>
     <option value="Belize">Belize</option>
     <option value="Benin">Benin</option>
     <option value="Bermuda">Bermuda</option>
     <option value="Bhutan">Bhutan</option>
     <option value="Bolivia">Bolivia</option>
     <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
     <option value="Botswana">Botswana</option>
     <option value="Bouvet Island">Bouvet Island</option>
     <option value="Brazil">Brazil</option>
     <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
     <option value="Brunei Darussalam">Brunei Darussalam</option>
     <option value="Bulgaria">Bulgaria</option>
     <option value="Burkina Faso">Burkina Faso</option>
     <option value="Burundi">Burundi</option>
     <option value="Cambodia">Cambodia</option>
     <option value="Cameroon">Cameroon</option>
     <option value="Canada">Canada</option>
     <option value="Cape Verde">Cape Verde</option>
     <option value="Cayman Islands">Cayman Islands</option>
     <option value="Central African Republic">Central African Republic</option>
     <option value="Chad">Chad</option>
     <option value="Chile">Chile</option>
     <option value="China">China</option>
     <option value="Christmas Island">Christmas Island</option>
     <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
     <option value="Colombia">Colombia</option>
     <option value="Comoros">Comoros</option>
     <option value="Congo">Congo</option>
     <option value="Congo, The Democratic Republic ">Congo, The Democratic Republic </option>
     <option value="Cook Islands">Cook Islands</option>
     <option value="Costa Rica">Costa Rica</option>
     <option value="Cote D'ivoire">Cote D'ivoire</option>
     <option value="Croatia">Croatia</option>
     <option value="Cuba">Cuba</option>
     <option value="Cyprus">Cyprus</option>
     <option value="Czech Republic">Czech Republic</option>
     <option value="Denmark">Denmark</option>
     <option value="Djibouti">Djibouti</option>
     <option value="Dominica">Dominica</option>
     <option value="Dominican Republic">Dominican Republic</option>
     <option value="Ecuador">Ecuador</option>
     <option value="Egypt">Egypt</option>
     <option value="El Salvador">El Salvador</option>
     <option value="Equatorial Guinea">Equatorial Guinea</option>
     <option value="Eritrea">Eritrea</option>
     <option value="Estonia">Estonia</option>
     <option value="Ethiopia">Ethiopia</option>
     <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
     <option value="Faroe Islands">Faroe Islands</option>
     <option value="Fiji">Fiji</option>
     <option value="Finland">Finland</option>
     <option value="France">France</option>
     <option value="French Guiana">French Guiana</option>
     <option value="French Polynesia">French Polynesia</option>
     <option value="French Southern Territories">French Southern Territories</option>
     <option value="Gabon">Gabon</option>
     <option value="Gambia">Gambia</option>
     <option value="Georgia">Georgia</option>
     <option value="Germany">Germany</option>
     <option value="Ghana">Ghana</option>
     <option value="Gibraltar">Gibraltar</option>
     <option value="Greece">Greece</option>
     <option value="Greenland">Greenland</option>
     <option value="Grenada">Grenada</option>
     <option value="Guadeloupe">Guadeloupe</option>
     <option value="Guam">Guam</option>
     <option value="Guatemala">Guatemala</option>
     <option value="Guernsey">Guernsey</option>
     <option value="Guinea">Guinea</option>
     <option value="Guinea-bissau">Guinea-bissau</option>
     <option value="Guyana">Guyana</option>
     <option value="Haiti">Haiti</option>
     <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
     <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
     <option value="Honduras">Honduras</option>
     <option value="Hong Kong">Hong Kong</option>
     <option value="Hungary">Hungary</option>
     <option value="Iceland">Iceland</option>
     <option value="India">India</option>
     <option value="Indonesia">Indonesia</option>
     <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
     <option value="Iraq">Iraq</option>
     <option value="Ireland">Ireland</option>
     <option value="Isle of Man">Isle of Man</option>
     <option value="Israel">Israel</option>
     <option value="Italy">Italy</option>
     <option value="Jamaica">Jamaica</option>
     <option value="Japan">Japan</option>
     <option value="Jersey">Jersey</option>
     <option value="Jordan">Jordan</option>
     <option value="Kazakhstan">Kazakhstan</option>
     <option value="Kenya">Kenya</option>
     <option value="Kiribati">Kiribati</option>
     <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
     <option value="Korea, Republic of">Korea, Republic of</option>
     <option value="Kuwait">Kuwait</option>
     <option value="Kyrgyzstan">Kyrgyzstan</option>
     <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
     <option value="Latvia">Latvia</option>
     <option value="Lebanon">Lebanon</option>
     <option value="Lesotho">Lesotho</option>
     <option value="Liberia">Liberia</option>
     <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
     <option value="Liechtenstein">Liechtenstein</option>
     <option value="Lithuania">Lithuania</option>
     <option value="Luxembourg">Luxembourg</option>
     <option value="Macao">Macao</option>
     <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
     <option value="Madagascar">Madagascar</option>
     <option value="Malawi">Malawi</option>
     <option value="Malaysia">Malaysia</option>
     <option value="Maldives">Maldives</option>
     <option value="Mali">Mali</option>
     <option value="Malta">Malta</option>
     <option value="Marshall Islands">Marshall Islands</option>
     <option value="Martinique">Martinique</option>
     <option value="Mauritania">Mauritania</option>
     <option value="Mauritius">Mauritius</option>
     <option value="Mayotte">Mayotte</option>
     <option value="Mexico">Mexico</option>
     <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
     <option value="Moldova, Republic of">Moldova, Republic of</option>
     <option value="Monaco">Monaco</option>
     <option value="Mongolia">Mongolia</option>
     <option value="Montenegro">Montenegro</option>
     <option value="Montserrat">Montserrat</option>
     <option value="Morocco">Morocco</option>
     <option value="Mozambique">Mozambique</option>
     <option value="Myanmar">Myanmar</option>
     <option value="Namibia">Namibia</option>
     <option value="Nauru">Nauru</option>
     <option value="Nepal">Nepal</option>
     <option value="Netherlands">Netherlands</option>
     <option value="Netherlands Antilles">Netherlands Antilles</option>
     <option value="New Caledonia">New Caledonia</option>
     <option value="New Zealand">New Zealand</option>
     <option value="Nicaragua">Nicaragua</option>
     <option value="Niger">Niger</option>
     <option value="Nigeria">Nigeria</option>
     <option value="Niue">Niue</option>
     <option value="Norfolk Island">Norfolk Island</option>
     <option value="Northern Mariana Islands">Northern Mariana Islands</option>
     <option value="Norway">Norway</option>
     <option value="Oman">Oman</option>
     <option value="Pakistan">Pakistan</option>
     <option value="Palau">Palau</option>
     <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
     <option value="Panama">Panama</option>
     <option value="Papua New Guinea">Papua New Guinea</option>
     <option value="Paraguay">Paraguay</option>
     <option value="Peru">Peru</option>
     <option value="Philippines">Philippines</option>
     <option value="Pitcairn">Pitcairn</option>
     <option value="Poland">Poland</option>
     <option value="Portugal">Portugal</option>
     <option value="Puerto Rico">Puerto Rico</option>
     <option value="Qatar">Qatar</option>
     <option value="Reunion">Reunion</option>
     <option value="Romania">Romania</option>
     <option value="Russian Federation">Russian Federation</option>
     <option value="Rwanda">Rwanda</option>
     <option value="Saint Helena">Saint Helena</option>
     <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
     <option value="Saint Lucia">Saint Lucia</option>
     <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
     <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
     <option value="Samoa">Samoa</option>
     <option value="San Marino">San Marino</option>
     <option value="Sao Tome and Principe">Sao Tome and Principe</option>
     <option value="Saudi Arabia">Saudi Arabia</option>
     <option value="Senegal">Senegal</option>
     <option value="Serbia">Serbia</option>
     <option value="Seychelles">Seychelles</option>
     <option value="Sierra Leone">Sierra Leone</option>
     <option value="Singapore">Singapore</option>
     <option value="Slovakia">Slovakia</option>
     <option value="Slovenia">Slovenia</option>
     <option value="Solomon Islands">Solomon Islands</option>
     <option value="Somalia">Somalia</option>
     <option value="South Africa">South Africa</option>
     <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
     <option value="Spain">Spain</option>
     <option value="Sri Lanka">Sri Lanka</option>
     <option value="Sudan">Sudan</option>
     <option value="Suriname">Suriname</option>
     <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
     <option value="Swaziland">Swaziland</option>
     <option value="Sweden">Sweden</option>
     <option value="Switzerland">Switzerland</option>
     <option value="Syrian Arab Republic">Syrian Arab Republic</option>
     <option value="Taiwan, Province of China">Taiwan, Province of China</option>
     <option value="Tajikistan">Tajikistan</option>
     <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
     <option value="Thailand">Thailand</option>
     <option value="Timor-leste">Timor-leste</option>
     <option value="Togo">Togo</option>
     <option value="Tokelau">Tokelau</option>
     <option value="Tonga">Tonga</option>
     <option value="Trinidad and Tobago">Trinidad and Tobago</option>
     <option value="Tunisia">Tunisia</option>
     <option value="Turkey">Turkey</option>
     <option value="Turkmenistan">Turkmenistan</option>
     <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
     <option value="Tuvalu">Tuvalu</option>
     <option value="Uganda">Uganda</option>
     <option value="Ukraine">Ukraine</option>
     <option value="United Arab Emirates">United Arab Emirates</option>
     <option value="United Kingdom">United Kingdom</option>
     <option value="United States">United States</option>
     <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
     <option value="Uruguay">Uruguay</option>
     <option value="Uzbekistan">Uzbekistan</option>
     <option value="Vanuatu">Vanuatu</option>
     <option value="Venezuela">Venezuela</option>
     <option value="Viet Nam">Viet Nam</option>
     <option value="Virgin Islands, British">Virgin Islands, British</option>
     <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
     <option value="Wallis and Futuna">Wallis and Futuna</option>
     <option value="Western Sahara">Western Sahara</option>
     <option value="Yemen">Yemen</option>
     <option value="Zambia">Zambia</option>
     <option value="Zimbabwe">Zimbabwe</option>
   </select>
 </span>
  <br>
  <br>
   <input type="submit" name="USRINFO" id="USRINFO" value="Create Account" class="ADD"/>&emsp;<input type="reset"  value="Reset" class="admnbtnRST"/>
   
</form>
<br>
<br>
<div>
<?php
}
?>
<?php 
require_once('PHP/dbadapter.php'); // Veritabanı bağlantı dosyası
?>
<?php
$sayfa=$_GET['sayfa']; //get ile gelen sayfayı alıyoruz

if (!is_numeric($sayfa) || $sayfa=="") { $sayfa=1; } // sayfa rakam değilse ve boş ise sayfayı 1 yapıyoruz

$kacar=5; //buraya 1 sayfada kaç kayıt göstermek istediğinizi giriniz.
$kayit_sayisi=mysqli_fetch_array(mysqli_query($conn,"SELECT COUNT(*) FROM $user_info"));
##$kayit_sayisi=mysql_fetch_array(mysql_query("SELECT COUNT(*) FROM $log_in"));
$sayfa_sayisi=$kayit_sayisi['0']/$kacar; //kayit sayısını sayfada gösterilecek kayıt sayısına bölerek sayfa sayısını buluyoruz

if ($sayfa_sayisi%$kacar!=0) { $sayfa_sayisi++; } //sayfa sayısının kacar a göre modunu aldık 0 dan farklı ise sayfa sayısını 1 arttırdık.yani 7 kayit varsa 2 sayfa yapmak için bu gerekli.

$nerden=($sayfa*$kacar)-$kacar;  //sorguda nerden kısmı örn 2. sayfada bu değer 5 olacaktır
$nereye=($sayfa*$kacar); //sorguda nereye kısmı örn 2. sayfada bu değer 10 olacaktır.yani 2 sayfada 5. kayıttan 10. kayıta kadar olan kısmı yazdırmak için.
$sorgu=mysqli_query($conn,"SELECT * FROM $user_info LIMIT $nerden, $nereye");
##$sorgu=mysql_query("SELECT * FROM $log_in LIMIT $nerden, $nereye"); //Sorgumuz
echo"<html>
<body>
<table   width=\"90%\" border=1 border-style=\"solid\" bordercolor=\"#000000\" class=\"table2\"  >
<tr >
<td>User ID</td>
<td>User Name</td>
<td>User Surname</td>
<td>User Email</td>
<td>Registered User IP</td>
<td> Country</td>
<td> User Gender</td>
</tr>";
while ($veri=mysqli_fetch_array($sorgu)) { //döngü ile veritabanındaki verileri ekrana veriyoruz.
$Userid=$veri['userid'];
$IP=$veri['user_ip'];
$USERNAME=$veri['usrname'];
$SURNAME=$veri['usrsurname'];
$USERMAIL=$veri['email'];
$COUNTRY=$veri['country'];
$GNDR=$veri['gender'];
echo "
<tr><td >$Userid</td>  <td>$USERNAME</td>   <td>$SURNAME</td>  <td>$USERMAIL </td> <td>$IP</td>  <td>$COUNTRY</td> <td>$GNDR</td> 

</tr> ";
}
echo "
</table></body></html>";
for ($i=1; $i<=$sayfa_sayisi; $i++) { //sayfaları yazdıracağımız döngümüz.
echo "| <a href='usrinfo.php?sayfa=$i'>$i </a>|";
}
?>
</div>

  </div>
<div id="FOOTER" class="footer">Content for  id "FOOTER" Goes Here</div>
</div>
</body>
</html>
