<?php

  # define('HOST','localhost');
  # define('USER','root');
  # define('PASS','');
  # define('DB','CHAP_LOGINDB');

  define('HOST','localhost');
  define('USER','chapchap_admin');
  define('PASS','sl@VanLb?s=V');
  define('DB','chapchap_logindb');

  $con = mysqli_connect(HOST,USER,PASS,DB);
  if (!$con) {
    die("Error in connection" . mysqli_connect_error()) ;
  }

?>
