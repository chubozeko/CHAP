<?php

  define('HOST','localhost');
  define('USER','id8247064_chapadmin');
  define('PASS','chap_123321');
  define('DB','id8247064_chap_logindb');
  
  # define('USER','root');
  # define('PASS','');
  # define('DB','CHAP_LOGINDB');

  $con = mysqli_connect(HOST,USER,PASS,DB);
  if (!$con) {
    die("Error in connection" . mysqli_connect_error()) ;
  }

?>