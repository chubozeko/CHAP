<?php
  session_start();
  require_once('Facebook/autoload.php');
  $fb = new \Facebook\Facebook([
    'app_id' => '462441681264999', // Replace {app-id} with your app id
    'app_secret' => '42c6eeab8cbf703f3703b18baf26fca7',
    'default_graph_version' => 'v3.2',
  ]);
 
  $helper = $fb->getRedirectLoginHelper(); if (isset($_GET['state'])) { $helper->getPersistentDataHandler()->set('state', $_GET['state']); }
  $permissions = ['email']; // Optional information that your app can access, such as 'email'
  $loginUrl = $helper->getLoginUrl('http://localhost:8384/chaploginhostappV2.0/fb-callback.php', $permissions);
?>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="./CSS/style.css">

<title>login</title>

<style type="text/css">

</style>
 
</head>

<body>

  <div class="login"  >
    <div class="logo">
    <img src="./assets/icon/chap_logo.png" width="129" height="120">
    </div>
    
<div class="title"> Welcome To CHAP </div>
    <form action="socket.php" method="POST">
      <div class="backcon">
        <div class="emailfield">
          <input type="email" name="email" id="email" class="emailboxfield" placeholder="Use your e-mail" >
        </div>
        
        <div class="passwordfield">
          <input name="passwordbox" type="password" id="passwordbox" class="passwordboxfield" placeholder="Passwords">
        </div>
        
        <div class="butonfield"> 
          <input name="btn1LOG" type="Submit" value="LOG IN"class="btnstyle">  
          <input name="btn" id="btn" type="button" value="SIGN UP" class="btnstyle">
          <script>      
            document.getElementById("btn").onclick = function() {
              window.setTimeout(function() { location.href = 'createaccount.php'; }, 0001);
            };
          </script>
        </div>
      </div>

      <div class="API_ICONfield">
        <input name="facebook" type="button" class="facebookAPI">
        <input name="google" type="button"class="gmailAPI">
        <input name="linkedin" type="button"class="linkedinAPI">
      </div>
    </form>
  </div>

</body>
</html>