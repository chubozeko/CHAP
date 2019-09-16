<?php
session_start();
require_once('Facebook/autoload.php');
$fb = new \Facebook\Facebook([
  'app_id' => '462441681264999', // Replace {app-id} with your app id
  'app_secret' => '42c6eeab8cbf703f3703b18baf26fca7',
  'default_graph_version' => 'v3.2',
  ]);

$helper = $fb->getRedirectLoginHelper();

try {
  $accessToken = $helper->getAccessToken();
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  // When Graph returns an error
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  // When validation fails or other local issues
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
 
if (! isset($accessToken)) {
  if ($helper->getError()) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Error: " . $helper->getError() . "\n";
    echo "Error Code: " . $helper->getErrorCode() . "\n";
    echo "Error Reason: " . $helper->getErrorReason() . "\n";
    echo "Error Description: " . $helper->getErrorDescription() . "\n";
  } else {
    header('HTTP/1.0 400 Bad Request');
    echo 'Bad request';
  }
  exit;
}
 
// Logged in
// The OAuth 2.0 client handler helps us manage access tokens
$oAuth2Client = $fb->getOAuth2Client();
 
// Get the access token metadata from /debug_token
$tokenMetadata = $oAuth2Client->debugToken($accessToken);
 
// Get user’s Facebook ID
$userId = $tokenMetadata->getField('user_id');
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get('me?fields=id,name,email,gender',$accessToken);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphObject = $response->getGraphObject();

$fbid = $graphObject->getProperty('id'); 
   $fbname = $graphObject->getProperty('name');   
   $fbemail = $graphObject->getProperty('email');
   $fbgender = $graphObject->getProperty('gender');
     $fbBDAY = $graphObject->getProperty('birthday');  
/*$user = $response->getGraphUser();
$_SESSION['user']=$user;
$userId = $user['id']; // Retrieve user Id
$userName = $user['name']; // Retrieve user name
$email = $user['email'];
#$GNDR = $user['gender'];
$__SESSION['userıd']= $userId;
$__SESSION['NAME']= $userName;
$__SESSION['email']= $email;
$__SESSION['gender']= $fbgender;*/
echo $fbid;    //working as I'm getting facebook ID
echo "<br>";
echo $fbgender;
echo "<br>";
echo $fbname;
echo "<br>";
echo $fbemail;
echo "<br>";
echo $fbBDAY;
?>
<html>
<head>
	<title>Faceboo Api Tutorial</title>

</head>
<body>

<div><?php #echo($__SESSION['userıd']);?></div>
<div><?php #echo($__SESSION['NAME']);?></div>
<div><?php #echo($__SESSION['email']);?></div> 
<div><?php #echo($__SESSION['gender']);?></div> 




</body>
</html>

