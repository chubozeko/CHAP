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

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bootstrap Simple Login Form</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<style type="text/css">
body {
background-color:#bbbbbb;
}

	.login-form {
		width: 400px;
    	margin: 50px auto;
	}
    .login-form form {
    	margin-bottom: 15px;
        background: #333333;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        padding: 30px;
    }
    .login-form h2 {
        margin: 0 0 15px;
    }
    .form-control, .btn {
        min-height: 38px;
        border-radius: 2px;
    }
    .btn {
        font-size: 15px;
        font-weight: bold;
    }
	.title {
	color: #f0f0f0;
	text-align:center;
	}
	.divlogo{
	float:left;
	}
	.divtitle{
	padding-top: 45px;
	padding-bottom: 20px;
	}
</style>
</head>
<body>
<div class="login-form">
    <form action="socket.php" method="post">
	<div class="divlogo"><img src="logo/chaplogo.png" width="129" height="120"></div>
       <div class="divtitle" > <h2 class="title">Welcome to CHAP</h2> </div>
        <div class="form-group">
            <input type="email" class="form-control"name="email" id="email" placeholder="Enter Your Email" required="required">
        </div>
        <div class="form-group">
            <input type="password"name="passwordbox"  id="passwordbox"  class="form-control" placeholder="Enter Your Password" required="required">
        </div>
        <div class="form-group">
           <!--- <button type="submit" class="btn btn-primary btn-block" >>Log in</button>--->
			<input name="btn1LOG" type="Submit" value="LOG IN"class="btn btn-primary btn-block">
        </div>
		 <div class="form-group">
            <button type="button" class="btn btn-primary btn-block" onclick="window.location='<?php echo $loginUrl ?>';">Log in With Facebook</button>
        </div>
       <p class="text-center"><a href="createaccount.php">Create an Account</a></p>
    </form>

</div>
</body>
</html>
