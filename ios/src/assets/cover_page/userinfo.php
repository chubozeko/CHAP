<?php
/********************************************************************************************************************/
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
?>
<?php
session_start();

if(!isset($_SESSION["sess_user"])){

	header("Location:index.php");
}
else
{
$error = false;

$email = htmlspecialchars($MAIL);


if($userInfo=="Create Account"){
	// First Check Button value is Create Account

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
}
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
  $result = mysqli_query($conn,"SELECT * FROM `$user_info` ORDER BY userid ASC LIMIT $start_from, $limit"); 
}else{
$limit=10; #Sayfalama Değeri 
if (isset($_GET["page"])) {
	$page  = $_GET["page"]; 
	} 
	else{ 
	$page=1;
	};  
$start_from = ($page-1) * $limit;  
$result = mysqli_query($conn,"SELECT * FROM `$user_info` ORDER BY userid ASC LIMIT $start_from, $limit");
}
?>

<?php
# SESSION AYARLARI YAPILMASI LAZIM

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
<script type="text/javascript" src="https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js"></script> <!-- Excel Library -->
<script type="text/Javascript">
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}
function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("kmkara");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}


    
      
  
    function printDiv(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    } function ExportExcel(type, fn, dl) {
                  var elt = document.getElementById('myTable');
                  var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
                  return dl ?
                      XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
                      XLSX.writeFile(wb, fn || ('Kullanici_Kayit.' + (type || 'xlsx'))) 
    }      
</script>

<title>User Info</title>
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
                          <div class="row">
                              <div class="col-sm-12 text-right ">
                              <br>
                                   <a class="btn my-2 my-sm-0 btn-dark   " href="logout.php" > Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;LOG OUT</a>
                              </div>
                          </div>
                          
<h3><b>Create User Account</b></h3>
                              <div class="from-group">
                                    <div class="row">
                               <div class="col-sm-3">
                                    <input type="text" name="A" id="A" class="form-control"  placeholder="Name"/>
                              </div>
                              <div class="col-sm-3">
                                    <input type="text" name="B" id="B"  class="form-control" placeholder="Surname"/>
                              </div>
                              <div class="col-sm-3">
                              <select class="form-control" id="C" name="C">
                                  <option value="Male" >Male</option>
                                  <option value="Female">Female</option>
                                  
                            </select>
                              </div>
                              <div class="col-sm-3">
                                  <input  type="email" name="E" id="E"  placeholder="Email" class="form-control"/>
                              </div>
                              
                                    </div>
                                   
                               <div class="row"><div class="col-sm-12"><p></p></div><!-- Just for Empty Space --></div>           
              
                               <div class="row">
                               <div class= "col-sm-3">
                            <select class="form-control" id="D" name="D">
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
                            </div>
                            <div class= "col-sm-3">
                              <input  type="text" name="F" id="F"  placeholder="Create User Password" class="form-control" />
                            </div>
                            <div class= "col-sm-3">
                              <input  type="text" name="G" id="G"  placeholder="Confirm User Password" class="form-control" /> 
                            </div>
                            
                        </div>

                   
                    </div> 
                    <br>
                  <div class="row">
                  <div class="col-sm-12 text-right">
                    <button type="refresh" class="btn btn-secondary" ><i class="fas fa-sync"></i>&nbsp;Refresh</button>
                    <button type="button" class="btn btn-danger" name="admnBTN" id="admnBTN" value="Delete"><i class="far fa-trash-alt"></i>&nbsp;Delete Account</button>
                    <button type="submit" class="btn btn-success" name="USRINFO" id="USRINFO" value="Create Account"><i class="far fa-save"></i> &nbsp;Create  Account</button>
                  </div>
                  </div>
                    <br>
             <h5><b>User Information #</b></h5>
             <div class="row">
             <div class="col-sm-2">
                          <input class="form-control text-center " id="kmkara" name="kmkmara" onkeyup="myFunction()"  type="text" placeholder="Search ID" />
                  </div>
                  <div class="col-sm-2">
                        <select id="sec" name="sec"  class="form-control" onchange="this.form.submit();" ><!-- Veri fitreleme-->
                          <option value="0">List</option>
                          <option value="List All">List All</option>
                       </select>
                  </div>
                  <div class="col-sm-4 text-right">
                      <!-- <button type="button" class="btn btn-secondary " onclick="javascript:printDiv('print');" >&ensp;Print&ensp;</button> -->
                  </div>
                  <div class="col-sm-4 text-right ">
                  <button type="button" class="btn btn-secondary " onclick="javascript:printDiv('print');" ><i class="fas fa-print"></i>&ensp;Print&ensp;</button>   &ensp; 
                   <button type="button" class="btn btn-secondary " onclick="ExportExcel('ods')" ><i class="far fa-file-excel"></i>&ensp; Excel&ensp;</button>
                  
                  </div>
             </div>
             <div class="row">  <!-- Admin listesi tablosu -->
                    <div class="col-sm-12" id="print">
                    <br>
                    <table class="table table-bordered table-striped table-responsive" id="myTable" >
                    <thead class="thead-dark">
                         
                          <tr>  
                          <th>User IP</th>
                          <th>User Name</th>
                          <th>User Surname</th>
                          <th>User Email</th>
                        
                          <th> Country</th>
                          <th> Gender</th>
                          </tr> 
                      </thead> 
                                <tbody>
                                <?php  
                                          while ($row = mysqli_fetch_array($result)) {  
                                ?>  
                                          <tr>  
                                              <td><?php echo $row["user_ip"]; ?></td>  
                                              <td><?php echo $row["usrname"]; ?></td>  
                                              <td><?php echo $row["usrsurname"]; ?></td>
                                              <td><?php echo $row["email"]; ?></td>
                                              
                                              <td><?php echo $row["country"]; ?></td>
                                              <td><?php echo $row["gender"]; ?></td>
                                          </tr>
                            <?php  
                                 };  
                             ?> 
                                </tbody>                 
                    </table>
                    <?php  

                            $result_db = mysqli_query($conn,"SELECT COUNT(userid) FROM userinfo"); 
                            $row_db = mysqli_fetch_row($result_db);  
                            $total_records = $row_db[0];  
                            $total_pages = ceil($total_records / $limit); 
                            $showed_pages=5;
                            $show= ceil($total_pages / $showed_pages);
                            echo '<ul class="pagination">'; 
                            if($page<=1){
                              echo '<li class="page-item"> <a class ="page-link" href="userinfo.php?page='.($page=1).'">First</a> </li>';
                             }else{
                              echo '<li class="page-item"> <a class ="page-link" href="userinfo.php?page='.($page-1).'">Previous</a> </li>'; 
                             }  
                              for ($i=1; $i<=$show; $i++) {
                                      echo '<li class="page-item"> <a class ="page-link" userinfo.php?page='.$i.'">'.($i).'</a> </li>';
                                    }
                                if($show<=$total_pages){
                                    echo '<li class="page-item"> <a class ="page-link" >--</a> </li>';
                                     echo '<li class="page-item"> <a class ="page-link " href="userinfo.php?page='.($i+1).'"><b class="text-danger">'.($page).'</b></a> </li>';
                                                                           
                                  }   
                                  echo '<li class="page-item"> <a class ="page-link" ><i class="fas fa-angle-double-right"></i> </a> </li>';
                                  echo '<li class="page-item"> <a class ="page-link" href="userinfo.php?page='.($total_pages).'">'.($total_pages).'</a> </li>'; 
                            if($page==$total_pages){
                              echo '<li class="page-item"> <a class ="page-link" href="href="userinfo.php?page='.($total_pages).'">Last</a> </li>'; 
                            }else{
                              echo '<li class="page-item"> <a class ="page-link " href="userinfo.php?page='.($page+1).'">Next</a> </li>'; 
                            }
                    
                 echo  '</ul>'  ;        
                ?>
                    </div>
               </div> 







                          
                          </div><!-- İçerik -->
              </div><!-- ANA KONTEYNER -->          
</div><!-- ANA SAYFA-->




  </form>

 
</body>
</html> 