<?php 
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Accept-Encoding, X-Requested-With, Content-Type, Origin, Accept, Authenticationtoken");
?>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="CSS/style.css">

<title>login</title>

<!-- NEW CODE -->


<style type="text/css">
body {
	background-color: #dddddd;
}
</style>
 
</head>

<body>

<div class="login"  >
  <div class="logo">
  <img src="logo/chaplogo.png" width="129" height="120">
  </div>
  
  <div class="title"
  >Welcome To CHAP
  </div>
  <form  action="socket.php" method="POST">
  
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
        document.getElementById("btn")
            .onclick = function(){
                window.setTimeout(function(){location.href = 'createaccount.php';}, 0001);                        
             };
    </script>
  
  </div>
  </div>
<div class="API_ICONfield">
  <input name="facebook" type="button" class="facebookAPI"><input name="google" type="button"class="gmailAPI"><input name="linkedin" type="button"class="linkedinAPI">
  </div>
</form>
</div>

</body>
</html>