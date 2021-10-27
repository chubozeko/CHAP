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
    $_SESSION['user_id'] = $request->user_id;
    $_SESSION['email'] = $request->email;
    $USERID = $request->user_id;
    $USERMAIL = $request->email;
  }

  //session_start();
  //$USERID = $_SESSION['user_id'];
  //$USERMAIL = $_SESSION['email'];
  # $LOG_INFO=mysqli_fetch_array(mysqli_query($conn,"SELECT login_id FROM $log_in WHERE email='$email'"));
 
  if( isset($USERID) ) {
    $INSERT_LOG_OUT = "INSERT INTO log_out (usrid) VALUES ('$USERID')";
    $control_Con = mysqli_query($con, $INSERT_LOG_OUT);
    // Check if Data saved or not in database
    if($control_Con) {
      unset($_SESSION['user_id']);
      session_destroy();
      // FIRST CONNECTION METHOD
      // header("Location:index.php");
      $response->message = "Log Out";
    } else {
      $response->message = "Please Check your Internet Connection.";
    }
  } else {
    $response->message = "Session unavailable";
    $response->session = $_SESSION;
  }

  echo json_encode($response);
?>