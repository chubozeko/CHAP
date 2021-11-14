<?php
ob_start ();
$IP=$_SERVER['REMOTE_ADDR'];

if (isset($_SERVER['HTTP_ORIGIN'])) {
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Max-Age: 86400'); // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  
}

require_once("dbconnect.php") ;
require_once("variable.php");

$data = file_get_contents("php://input");
if (isset($data)) {
  $request = json_decode($data);
  $usrname = $request->fullname;
  $srname = $request->surname;
  $entrmail = $request->email;
  $cnfrmpass = $request->confirmpass;
  $pass = $request->password;
  $country = $request->cntry;
  $gender = $request->gender;
}

# ------------------------------------------------------------

//error_reporting(0); $entrmail != "" AND
$error = false;

$email = htmlspecialchars($entrmail);

// Check if form element is NOT  empty
if ($usrname != "" AND $srname != "" AND $gender != "" AND $country != "" AND $email != "" AND $pass != "" AND $cnfrmpass != "") {
  // Check if username and surname has less than three characters
	if (strlen($usrname) < 3 AND strlen($srname) < 3) {
		$error = True;
		$response = "Username and Surname must have more than 3 characters.";
	}
  // Check if username and surname contains alphabets or not
	else if( !preg_match("/^[a-zA-Z ]+$/", $usrname) AND !preg_match("/^[a-zA-Z ]+$/", $srname) ) {
		$error = True;
		$response = "Username and Surname must contain Alphabet!";
	}
  // Check if user email is valid or not
	else if ( !filter_var($email, FILTER_VALIDATE_EMAIL) ) {
		$error = true;
    $response = "Please enter a valid email address.";
	}
  // Check if password size is less than six characters
	else if(strlen($entrpass) < 6) {
    $error = true;
    $response = "Password must have at least 6 characters.";
  }
	else {
     // Confirm if password is same with the confirm password field
	   if($pass == $cnfrmpass) {
		     // User Registration Code Here
         $password = hash('sha256', $pass);
         $sql = "INSERT INTO user_info (user_ip,usrname,usrsurname,email,password,country,gender)
           VALUES ('$IP', '$usrname', '$srname', '$email', '$password', '$country', '$gender')";
         if ($con->query($sql) === TRUE) {
           $response= "Registration successful";
         } else {
           $response= "Error: " . $sql . "<br>" . $db->error;
         }

		     // $control_Con = mysqli_query($con, $SQL_COMMAND);
         // // Check if Data saved or not in database
		     // if($control_Con) {
		     //     $response = "You have successfully created a CHAP Account. You can now log in.";
		     // }
		     // else {
			   //     $response = "Ooops... Something Went Wrong! Please Check your entered data or Check Your Internet Connection.";
		     // }
	   }
	   else {
	      $response = "Your Password Is Incorrect! Please Check & Try Again.";
	   }
   }
}
else {
  $response = "Do not Leave Empty Spaces.";
}
# ------------------------------------------------------------
echo json_encode($response);
ob_end_flush();
?>
