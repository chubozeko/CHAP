<?php
error_reporting( ~E_DEPRECATED & ~E_NOTICE );
  # define('HOST','localhost');
  # define('USER','root');
  # define('PASS','');
  # define('DB','CHAP_LOGINDB');

  define('HOST','localhost');
  define('USER','chapprog_login');
  define('PASS','chapchap12345');
  define('DB','chapprog_login');

  $con = mysqli_connect(HOST,USER,PASS,DB);
  if (!$con) {
    die("Error in connection" . mysqli_connect_error()) ;
  }

?>
<?php
/*
error_reporting( ~E_DEPRECATED & ~E_NOTICE );
 
$servername = "localhost";
$username = "chapprog_login";
$password = "chapchap12345";
$dbname = "chapprog_login";
$user_info="user_info";//User information database table name
$log_in="log_in";//Login Information database table name
$log_out="log_out";//Logout Information database table name
$admintb="admintb";//Admin Info database table name
$facebookApiDB="facebookapi";//Facebook Api Information Keep in This Table 
 //Check if connection was successful
 // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


*/
?>