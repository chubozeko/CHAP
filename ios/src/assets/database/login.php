<?php

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
  exit(0);
}

require "dbconnect.php";
require "variable.php";

$data = file_get_contents("php://input");
if (isset($data)) {
  $request = json_decode($data);
  $email = $request->username;
  $pass = $request->password;
}

if($email != "" AND $pass != "") {
  if ( !filter_var($email,FILTER_VALIDATE_EMAIL) ) {
    $error = True;
    $response = "Please Enter a Valid Email Address.";
  } else if( strlen($pass) < 6 ) {
    $error = True;
    $response = "Password must have at least 6 Characters.";
  } else {
    # Database Checking
    $ADMIN_INFO = mysqli_fetch_array( mysqli_query($con, "SELECT id,email,password,adname,status FROM admintb WHERE email='$email'"));
    $CHECK_ADMINE = $ADMIN_INFO['email'];
    $CHECK_ADMINP = $ADMIN_INFO['password'];
    $CHECK_ADMINID = (int) $ADMIN_INFO['id'];
    $CHECK_ADMINNAME = $ADMIN_INFO['adname'];
    $CHECK_ADMINSTATUS = $ADMIN_INFO['status'];

    $USER_INFO = mysqli_fetch_array(mysqli_query($con, "SELECT userid,email,password FROM user_info WHERE email='$email'"));
    $CHECK_EMAIL = $USER_INFO['email'];
    $CHECK_PASS = $USER_INFO['password'];
    $TAKE_ID = (int)$USER_INFO['userid'];

    $password = hash('sha256', $pass);

    if($email == $CHECK_EMAIL AND $password == $CHECK_PASS) {
      /*session_start();
       $_SESSION['sess_user']=$CHECK_ADMINNAME;
       $_SESSION['usr_id']=$CHECK_ADMINID;
       $_SESSION['email']=$CHECK_ADMINE;
       $_SESSION['STATUS']= $CHECK_ADMINSTATUS;*/ # HERE WE NEED TO SET FECTED USER_INFO DATA AS A SESSION VARIABLE

      $INSERT_LOG_IN = "INSERT INTO log_in (usrid,ip,type_of_browser,opsystem) VALUES ('$TAKE_ID', '$IP', '$browser', '$user_os')";
      $control_Con = mysqli_query($con, $INSERT_LOG_IN);

      ## CHECK ACCESS OF STANDARD USER HERE WE NEED TO DEFINE CHAP MAIN PAGE TO DIRECT (home.php) BUT INSTED OF home.php
      ## IT HAS TO BE A CHAP MAIN FILE
      if($control_Con) {
        # header("Location:home.php"); // FIRST CONNECTION METHOD
        $response = "Your Login success";
      }
      else {
        ## PART2: EMAIL AND PASSWORD IS INVALID
        # $response = "Ooops... Something Went Wrong! Please Check your entered Data or Check Your Internet Connection.";
        $response = "Your Login Email or Password is invalid";
      }
    }
    else if($email == $CHECK_ADMINE AND $password == $CHECK_ADMINP) {
      session_start();
      $_SESSION['sess_user'] = $CHECK_ADMINNAME;
      $_SESSION['usr_id'] = $CHECK_ADMINID;
      $_SESSION['email'] = $CHECK_ADMINE;
      $_SESSION['STATUS'] = $CHECK_ADMINSTATUS;

      $INSERT_LOG_IN = "INSERT INTO log_in (usrid,ip,type_of_browser,opsystem) VALUES ('$CHECK_ADMINID', '$IP', '$browser', '$user_os')";
      $control_Con = mysqli_query($con, $INSERT_LOG_IN);
      // Check if Data is in database
      if($control_Con) {
        # ADMIN PANEL CONNECTION
        # header("Location: ADMINPANEL.php");
        # $response = "Open ADMINPANEL.php";
        $response->message = "Open ADMINPANEL.php";
        $response->username = $CHECK_ADMINE;
        $response->password = $CHECK_ADMINP;
      }
      else {
        ## PART 2: EMAIL AND PASSWORD IS INVALID
        # $response = "Ooops... Something Went Wrong! Please Check your entered Data or Check Your Internet Connection.";
        $response = "Your Login Email or Password is invalid";
      }
    }
    else {
      $response = "Invaild User Information! Please Re-Check your Data.";
    }
  }


  # $password = hash('sha256', $pass);

  // $sql = "SELECT userid FROM user_info WHERE email='$email' AND password='$password'";
  //
  // $result = mysqli_query($con,$sql);
  // $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
  // $count = mysqli_num_rows($result);

  // If result matched myusername and mypassword, table row must be 1 row
  // if($count > 0) {
  //   $response = "Your Login success";
  // } else {
  //   $response = "Your Login Email or Password is invalid";
  // }
} else {
  $response = "Your Login Email or Password cannot be left Empty!";
}

echo json_encode($response);

?>
