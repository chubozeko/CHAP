<?php
/********************************************************************************************************************/
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
require_once('PHP/Browser_Module.php');
require_once('PHP/OS_Module.php');

?>
<?php

//error_reporting(0);
$error = false;
$email = htmlspecialchars($email);

if($btn1LOG=="LOG IN")
	# First Check Button value is Create Account
{
	if($email!="" AND $password!="")
	{
		if ( !filter_var($email,FILTER_VALIDATE_EMAIL) )
		{
			$error=True;
			$error_message="Please Enter Valid Email Address...!! ";
		    echo "<script type=\"text/javascript\"> 
	                 alert('$error_message');
	
	         </script> ";
		}
		elseif(strlen($password)<6)
		{
			$error=True;
			$error_message="Password Must Have At Least 6 Characters...!!";
			echo "<script type=\"text/javascript\"> 
	                 alert('$error_message');
	
	       
       		   </script> ";
		}
		else
		{	   
		#Database Check Code Start Here !!
		   $ADMIN_INFO=mysqli_fetch_array(mysqli_query($conn,"SELECT id,email,password,adname,status FROM $admintb WHERE email='$email'"));
		   $CHECK_ADMINE=$ADMIN_INFO['email'];
		   $CHECK_ADMINP=$ADMIN_INFO['password'];
		   $CHECK_ADMINID=(int)$ADMIN_INFO['id'];
		   $CHECK_ADMINNAME=$ADMIN_INFO['adname'];
		   $CHECK_ADMINSTATUS=$ADMIN_INFO['status'];
		    $USER_INFO=mysqli_fetch_array(mysqli_query($conn,"SELECT userid,email,password FROM $user_info WHERE email='$email'"));
			$CHECK_EMAIL= $USER_INFO['email'];
			$CHECK_PASS=$USER_INFO['password'];
			$TAKE_ID=(int)$USER_INFO['userid'];
			
			  if($email==$CHECK_EMAIL AND $password==$CHECK_PASS)
			{
				/*session_start();
			   $_SESSION['sess_user']=$CHECK_ADMINNAME;
			   $_SESSION['usr_id']=$CHECK_ADMINID;
			   $_SESSION['email']=$CHECK_ADMINE;
			   $_SESSION['STATUS']= $CHECK_ADMINSTATUS;*/ # HERE WE NEED TO SET FECTED USER_INFO DATA AS A SESSION VARIABLE
			
				$INSERT_LOG_IN="INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$TAKE_ID', '$IP', '$browser', '$user_os')";
                         
		            $control_Con = mysqli_query($conn, $INSERT_LOG_IN);
				 
		                   if($control_Con)
							                               ## CHECK ACCESS OF STANDARD USER HERE WE NEED TO DEFINE CHAP MAIN PAGE TO DIRECT (home.php) BUT INSTED OF home.php
                                                           #IT HAS TO BE A CHAP MAIN FILE													   
		                                  {
											 # header("Location:home.php"); // FIRST COONNECTION METHOD
											  
											  
		      													  
		                                  }
		                    else
		                              {
		                                             ##PART2  EMAIL AND PASSWORD IS IN VALID                                   
			                                         $Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Conncetion ";
			                                                    echo "<script type=\"text/javascript\"> 
	                                                                                       alert('$Check');
	
	                                                                                             </script> ";
		                               }
 #*/
  
		
			}
			elseif($email== $CHECK_ADMINE AND $password==$CHECK_ADMINP)
			{ 
			session_start();
			   $_SESSION['sess_user']=$CHECK_ADMINNAME;
			   $_SESSION['usr_id']=$CHECK_ADMINID;
			   $_SESSION['email']=$CHECK_ADMINE;
			   $_SESSION['STATUS']= $CHECK_ADMINSTATUS;
			   
			   
				$INSERT_LOG_IN="INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$CHECK_ADMINID', '$IP', '$browser', '$user_os')";

		            $control_Con = mysqli_query($conn, $INSERT_LOG_IN);
				 
		                   if($control_Con)
							                                //Check if Data saved or not in database             
		                                  {
											 #ADMIN PANEL CONNECTION 
											 header("Location: ADMINPANEL.php"); 
																							  
		                                  }
		                    else
		                              {
		 ##PART2  EMAIL AND PASSWORD IS IN VALID                                   
			                                         $Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Conncetion ";
			                                                    echo "<script type=\"text/javascript\"> 
	                                                                                       alert('$Check');
	
	                                                                                             </script> ";
 }
}
else
	{
				$Check = "In Vaild User Information Please Check Again...!! ";
			     echo "<script type=\"text/javascript\"> 
	                                     alert('$Check');
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
else
{
	
	
}

	
?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="CSS/style.css">

<title>login</title>



<style type="text/css">
body {
	background-color: #dddddd;
}
</style>
 
</head>

<body>

<div class="login"  >
  <div class="logo">
  <img src="logo/chaplogo.png" width="129" height="120">
  </div>
  
  <div class="title"
  >Welcome To CHAP
  </div>
  <form  action="socket.php" method="POST">
  
<div class="backcon">

  <div class="emailfield">
    <input type="email" name="email" id="email" class="emailboxfield" placeholder="Use your e-mail" >
  </div>
  
  <div class="passwordfield">
    <input name="passwordbox" type="password" id="passwordbox" class="passwordboxfield" placeholder="Passwords">
    </div>
  
  <div class="butonfield"> 
    <input name="btn1LOG" type="Submit" value="LOG IN"class="btnstyle">
	
    
  <input name="btn" id="btn" type="button" value="SIGN UP" class="btnstyle">
  <script>      
        document.getElementById("btn")
            .onclick = function(){
                window.setTimeout(function(){location.href = 'createaccount.php';}, 0001);                        
             };
    </script>
  
  </div>
  </div>
<div class="API_ICONfield">
  <input name="facebook" type="button" class="facebookAPI"><input name="google" type="button"class="gmailAPI"><input name="linkedin" type="button"class="linkedinAPI">
  </div>
  

</form>
</div>

</body>
</html>