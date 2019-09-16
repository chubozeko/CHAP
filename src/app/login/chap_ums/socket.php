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

# First Check Button value is Create Account
if($btn1LOG=="LOG IN") {
	if($email != "" AND $password != "") {
		if ( !filter_var($email,FILTER_VALIDATE_EMAIL) ) {
			$error = True;
			$error_message = "Please Enter Valid Email Address!";
		    echo "<script type=\"text/javascript\"> 
	              alert('$error_message');
	         		</script> ";
		}	elseif(strlen($password) < 6) {
			$error = True;
			$error_message = "Password Must Have At Least 6 Characters!";
			echo "<script type=\"text/javascript\"> 
	            alert('$error_message');
       		  </script> ";
		} else {
			#Database Check Code Start Here !!
		  $ADMIN_INFO = mysqli_fetch_array(mysqli_query($conn,"SELECT id,email,password,adname,status FROM $admintb WHERE email='$email'"));
		  $CHECK_ADMINE = $ADMIN_INFO['email'];
		  $CHECK_ADMINP = $ADMIN_INFO['password'];
		  $CHECK_ADMINID = (int) $ADMIN_INFO['id'];
		  $CHECK_ADMINNAME = $ADMIN_INFO['adname'];
		  $CHECK_ADMINSTATUS = $ADMIN_INFO['status'];
		  $USER_INFO = mysqli_fetch_array(mysqli_query($conn,"SELECT userid,email,password FROM $user_info WHERE email='$email'"));
			$CHECK_EMAIL = $USER_INFO['email'];
			$CHECK_PASS = $USER_INFO['password'];
			$TAKE_ID = (int)$USER_INFO['userid'];
			
			if($email == $CHECK_EMAIL AND $password == $CHECK_PASS) {
				/*session_start();
			   $_SESSION['sess_user']=$CHECK_ADMINNAME;
			   $_SESSION['usr_id']=$CHECK_ADMINID;
			   $_SESSION['email']=$CHECK_ADMINE;
			   $_SESSION['STATUS']= $CHECK_ADMINSTATUS;*/ # HERE WE NEED TO SET FECTED USER_INFO DATA AS A SESSION VARIABLE
			
				$INSERT_LOG_IN="INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$TAKE_ID', '$IP', '$browser', '$user_os')";
				$control_Con = mysqli_query($conn, $INSERT_LOG_IN);
				
				if($control_Con) {
					## CHECK ACCESS OF STANDARD USER HERE WE NEED TO DEFINE CHAP MAIN PAGE TO DIRECT (home.php) BUT INSTEAD OF home.php
          ## IT HAS TO BE A CHAP MAIN FILE											   
					# header("Location:home.php"); // FIRST CONNECTION METHOD
					#	header('www/index.html');
					# header("Location: www/index.html");
				}
				else {
		      ## PART 2: EMAIL AND PASSWORD IS INVALID                                   
			    $Check = "Ooops..... Something Went Wrong. Please Check your Entered Data or Check Your Internet Connection.";
			    echo "<script type=\"text/javascript\"> 
	        				alert('$Check');
								</script> ";
		    }		
			}
			elseif($email == $CHECK_ADMINE AND $password == $CHECK_ADMINP) { 
				session_start();
			  $_SESSION['sess_user'] = $CHECK_ADMINNAME;
			  $_SESSION['usr_id'] = $CHECK_ADMINID;
			  $_SESSION['email'] = $CHECK_ADMINE;
			  $_SESSION['STATUS'] = $CHECK_ADMINSTATUS;
			   
				$INSERT_LOG_IN="INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$CHECK_ADMINID', '$IP', '$browser', '$user_os')";
		    $control_Con = mysqli_query($conn, $INSERT_LOG_IN);
				if($control_Con) {
					//Check if Data saved or not in database             
		      #ADMIN PANEL CONNECTION
					header("Location: ADMINPANEL.php"); 
				} else {
		 			## PART 2: EMAIL AND PASSWORD IS IN VALID                                   
			    $Check = "Ooops..... Something Went Wrong! Please Check your Entered Data or Check Your Internet Connection.";
			    echo "<script type=\"text/javascript\"> 
	        				alert('$Check');
	        			</script> ";
				} 
				// else {
				// 	$Check = "Invaild User Information! Please Check Again.";
			  //   echo "<script type=\"text/javascript\"> 
	      //   				alert('$Check');
		    //         </script> ";
				// }
			}
		}
		// else {
		// 	echo "<script type=\"text/javascript\"> 
	  //   	      alert('Do not Leave any Empty Spaces');
		// 				</script> ";		
		// }
	}
// else {
}
// }	
?>

<div><?php echo $control_Con ?></div>