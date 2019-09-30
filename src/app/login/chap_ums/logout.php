<?php
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
/*require_once('PHP/Browser_Module.php');*/
?>
<?php

session_start();
$USERID=$_SESSION['usr_id'];
$USERMAIL= $_SESSION['email'];
# $LOG_INFO=mysqli_fetch_array(mysqli_query($conn,"SELECT login_id FROM $log_in WHERE email='$email'"));
 
if(isset($_SESSION["sess_user"]))
{
	          
	 
	
	$INSERT_LOG_OUT="INSERT INTO `$log_out` ( `usrid`) VALUES ('$USERID')";

		            $control_Con = mysqli_query($conn, $INSERT_LOG_OUT);
					if($control_Con)
							                                //Check if Data saved or not in database             
		                                  {
											  unset($_SESSION['sess_user']);
											  session_destroy();
											  header("Location:index.php"); // FIRST COONNECTION METHOD
																  
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
	
}
?>