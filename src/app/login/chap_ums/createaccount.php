<?php
/********************************************************************************************************************/
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
?>
<?php

//error_reporting(0);
$error = false;

$email = htmlspecialchars($entrmail);
if($crtaccount=="Create Account")
	// First Check Button value is Create Account
{
	if($usrname!=""AND$srname!=""AND$gender!=""AND$country!=""AND$entrmail!=""AND$email!=""AND$entrpass!=""AND$cnfrmpass!="")
		//Second Check if form element is NOT  empty
{
	if(strlen($usrname) < 3 AND strlen($srname)<3)
		// Third Check if username and surname has less than three characters
	{
		$error=True;
		$username_surname_error="Username and Surname must have more than 3 characters  ";
		echo "<script type=\"text/javascript\"> 
	                 alert('$username_surname_error');
	
	         </script> ";
	}
	else if(!preg_match("/^[a-zA-Z ]+$/",$usrname)AND!preg_match("/^[a-zA-Z ]+$/",$srname))
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
	}
	 else if(strlen($entrpass) < 6) //Check if password size is less than six characters
	 {
        $error = true;
        $passError = "Password must have atleast 6 characters !!.";
		echo "<script type=\"text/javascript\"> 
	                 alert('$passError');
	
	         </script> ";
  }
	else{
	if($entrpass==$cnfrmpass)
		//Fifth Confirm if password is same with the confirm password field
	{
		//User Registration Code Here!!
		
		
		$SQL_COMMAND = "INSERT INTO `$user_info`(user_ip,usrname,usrsurname,email,password,country,gender) VALUES ('$IP', '$usrname', '$srname', '$email', '$entrpass', '$country', '$gender')";
	
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
           else{
	                               echo "<script type=\"text/javascript\"> 
	                                                                    alert('Do not Leave Empty Space ');
	
	                                       </script> ";
	
}


}
else{
	
	
	
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
<title>Create Account</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> 
<style type="text/css">
	body{
		color: #fff;
		background: #bbbbbb;
		font-family: 'Roboto', sans-serif;
	}
    .form-control{
		height: 40px;
		box-shadow: none;
		color: #969fa4;
	}
	.form-control:focus{
		border-color: #5cb85c;
	}
    .form-control, .btn{        
        border-radius: 3px;
    }
	.signup-form{
		width: 400px;
		margin: 0 auto;
		padding: 30px 0;
		color:#333333;
	}
	.signup-form h2{
		color: #f0f0f0;
        margin: 0 0 15px;
		position: relative;
		text-align: center;
    }
	.signup-form h2:before, .signup-form h2:after{
		content: "";
		height: 2px;
		width: 30%;
		
		position: absolute;
		top: 50%;
		z-index: 2;
	}	
	.signup-form h2:before{
		left: 0;
	}
	.signup-form h2:after{
		right: 0;
	}
    .signup-form .hint-text{
		color: #999;
		margin-bottom: 30px;
		text-align: center;
	}
    .signup-form form{
		color: #999;
		border-radius: 3px;
    	margin-bottom: 15px;
        background: #333333;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        padding: 30px;
    }
	.signup-form .form-group{
		margin-bottom: 20px;
	}
	.signup-form input[type="checkbox"]{
		margin-top: 3px;
	}
	.signup-form .btn{        
        font-size: 16px;
        font-weight: bold;		
		min-width: 140px;
        outline: none !important;
    }
	.signup-form .row div:first-child{
		padding-right: 10px;
	}
	.signup-form .row div:last-child{
		padding-left: 10px;
	}    	
    .signup-form a{
		color: #fff;
		text-decoration: underline;
	}
    .signup-form a:hover{
		text-decoration: none;
	}
	.signup-form form a{
		color: #5cb85c;
		text-decoration: none;
	}	
	.signup-form form a:hover{
		text-decoration: underline;
	} 
	.divlogo{
	float:left;
	}
	.divtitle{
	padding-top: 45px;
	padding-bottom: 20px;
	}
	.textgexnder{
	font-size:50px;
	font-weight: bold;
	
	}
</style>
</head>
<body>
<div class="signup-form">
    <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
	<div class="divlogo"><img src="logo/chaplogo.png" width="129" height="120"></div>
       <div class="divtitle" > <h2 class="title">Create Your CHAP Account</h2> </div> 
		        <div class="form-group">
			<div class="row">
				<div class="col-xs-6"><input type="text" class="form-control" name="usrname" id="usrname" placeholder="First Name" required="required"></div>
				<div class="col-xs-6"><input type="text" class="form-control" name="surname" id="surname" placeholder="Last Name" required="required"></div>
			</div>        	
        </div>
		<div class="form-group">
        	<input type="email" class="form-control" name="email" id="email" placeholder="Email" required="required">
        </div>
		 <div class="form-group">
		&emsp; &emsp; <label class="radio-inline"><input type="radio" name="gndr" id="Male" style="font-size:50px; font-weight:bold;" value="Male" />
   Male </label>
&emsp; &emsp; <label class="radio-inline"><input type="radio" name="gndr" id="Female"  value="Female"  />
 Female</label>
&emsp; &emsp; <label class="radio-inline"> <input type="radio" name="gndr" id="Other"   value="Other"  />
 Other</label>
</div>
        <div class="form-group">
        	<select name="cntry" class="form-control">
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
		<div class="form-group">
            <input type="password" class="form-control" name="PASS" placeholder="Password" required="required">
        </div>
		<div class="form-group">
            <input type="password" class="form-control" name="CNFRPASS" placeholder="Confirm Password" required="required">
        </div>        
       
		<div class="form-group">
         <input type="submit" name="CRTBTN" class="btn btn-primary btn-block"   value="Create Account" >
        </div>
		<div class="text-center">Already have an account? <a href="index.php">Sign in</a></div>
    </form>
	
</div>
</body>
</html>                            