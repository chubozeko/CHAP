
<?php
session_start();
require_once('Facebook/autoload.php');
require_once('PHP/dbadapter.php');
require_once('PHP/Browser_Module.php');
require_once('PHP/OS_Module.php');
require_once('PHP/variable.php');


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

 
	 	$INSERT_FACEBOOKDB="INSERT INTO `$facebookApiDB` ( `facid`,  `facgender`, `name&surname`,`email`) VALUES ( '$fbid', '$fbgender', '$fbname', '$fbemail')";
                         
		            $control_Con = mysqli_query($conn, $INSERT_FACEBOOKDB);
				 
		                   if($control_Con)
							                               												   
		                                  {
											$GET_FACEBOOKDB=mysqli_fetch_array(mysqli_query($conn,"SELECT facid,email FROM $facebookApiDB WHERE facid='$fbid'"));
											$TAKE_FBID=$GET_FACEBOOKDB['facid'];
											 
											    $INSERT_LOG_IN="INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$TAKE_FBID', '$IP', '$browser', '$user_os')";
                         
		                                                    $control_Con1 = mysqli_query($conn, $INSERT_LOG_IN);
				 
		                                                      if($control_Con1)
							                             												   
		                                                    {
											                      #$_SESSION['FBID']=$CHECK_FBID;
											                      #$_SESSION['FBNAME']=$CHECK_FBNAME;

																 //HERE WHEN FACEBOOK USER LOG IN TO CHAP THIS PART SHOULD SEND TO CHAPCHAP.GA 
																	 # header("Location:home.php"); // FIRST COONNECTION METHOD
											                         echo("Hello World");
		      													  
		                                                     }
		                                       else
		                                                    {
		                                                                             
			                                                     $Check = "Facebook Login Faild ";
			                                                                echo "<script type=\"text/javascript\"> 
	                                                                                              alert('$Check');
	
	                                                                                                </script> ";
		                                                    }
										 	 													  
		                                    }
		                        else
		                             {
		                                                                            
			                                         $Check = "Facebook Data Registration Faild  ";
			                                                    echo "<script type=\"text/javascript\"> 
	                                                                                       alert('$Check');
	
	                                                                                             </script> ";
		                              }
 
?>


