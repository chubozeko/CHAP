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
  $userid = $request->userid;
  $comment = $request->comment;
  $rating = $request->rating;
}

# $blob != NULL AND 
if($rating != NULL OR $comment != "") {

  $sql = "INSERT INTO user_feedback (user_id,comment,rating) VALUES ('$userid','$comment','$rating')";
  $control_Con = mysqli_query($con, $sql);

  if($control_Con) {
    $response->message = "Feedback submitted";
    # $response->session = $_SESSION;
  } else {
    $response->message = "Error: " . $sql;
  }

} else {
  $response->message = "Invalid Feedback! Please give us a rating or comment.";
}

// header('Content-Type: application/json');
echo json_encode($response);

?>
