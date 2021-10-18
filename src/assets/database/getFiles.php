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

  # $name = $_FILES['myfile']['name'];
  # $type = $_FILES['myfile']['type'];
  # $data = file_get_contents($_FILES['myfile']['tmp_name']);
}

if($userid != "") {

  // $stat = mysqli_query($con, "SELECT * FROM save_files");
  //   while($row = $stat->fetch_assoc()) {
  //     echo "<li> <a target='_blank' href='view.php?id=".$row['id']."'>".$row['name']."</a></li>";
  //   }
  // } 

  $filesInfo = mysqli_query($con, "SELECT * FROM user_files WHERE user_id = '$userid'");
  while($row = $filesInfo->fetch_assoc()) {
    $fileArr[] = $row;
  }
  $response->files = $fileArr;
  $response->message = "Files Retrieved";

  // if($control_Con) {
  //   $response->message = "Save successful";
  //   # $response->session = $_SESSION;
  // } else {
  //   $response->message = "Error: " . $sql;
  // }

} else {
  $response->message = "No User ID session";
}

// header('Content-Type: application/json');
echo json_encode($response);

?>
