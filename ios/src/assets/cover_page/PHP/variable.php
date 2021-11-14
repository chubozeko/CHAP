<?php                                                   
error_reporting(0);
/*Login Variables */
$email=$_POST['email'];

/*********************************/
$email = strip_tags($email);
/*********************************/
$pass=$_POST['passwordbox'];
$pass = strip_tags($pass);
 $password = hash('sha256', $pass);
/*********************************/

/*********************************/
$btn1=$_POST['btn'];
$btn1LOG=$_POST['btn1LOG'];
/*Login API variables */
###################################
$API_facebook=$_POST['facebook'];
$API_google=$_POST['google'];
$API_linkedin=$_POST['linkedin'];
###################################        #$variable=strip_tags($variable)-->This function check entered value if there is any hijact or html code inside
/*********************************/
/*Create an Account Page Variables */
$usrname=$_POST['usrname'];
/*********************************/
$usrname = strip_tags($usrname);
/*********************************/
$srname=$_POST['surname'];
/*********************************/
$srname = strip_tags($srname);
/*********************************/
$gender=$_POST['gndr'];
/*********************************/
$gender = strip_tags($gender);
/*********************************/
$country=$_POST['cntry'];
/*********************************/
$country= strip_tags($country);
/*********************************/
$entrmail=$_POST['email'];
/*********************************/
$entrmail = strip_tags($entrmail);
/******$sec=$_POST['sec'];***************************/
$sec=$_POST['sec'];
/*********************************/
$pass2=$_POST['PASS'];
$pass2 = strip_tags($pass2);
$entrpass = hash('sha256',$pass2 );
/*********************************/


/*********************************/
$pass5=$_POST['CNFRPASS'];
$pass5 = strip_tags($pass5);
$cnfrmpass = hash('sha256',$pass5 );
/*********************************/
$crtaccount=$_POST['CRTBTN'];
/*************************************/
$IP=$_SERVER['REMOTE_ADDR'];
/*************************************/
$TAKE_DATE = date('d.m.Y H:i:s');
/*************************************/
/******************************************************ADMIN FORM VARIABLE***********************************************************************/
$ADMINNAME=$_POST['adnm'];
/*************************************/
$ADMINNAME = strip_tags($ADMINNAME);
/*************************************/
$ADMINSURNAME=$_POST['adsrm'];
/*************************************/
$ADMINSURNAME = strip_tags($ADMINSURNAME);
/*************************************/
$ADMINMAIL=$_POST['adem'];
/*************************************/
$ADMINMAIL = strip_tags($ADMINMAIL);
/*************************************/

$pass3=$_POST['adpass'];
$pass3 = strip_tags($pass3);
$ADMINPASS = hash('sha256',$pass3 );
/*************************************/

/*************************************/
$ADMINSTATUS=$_POST['adsts'];
/*************************************/
$ADMINSTATUS=strip_tags($ADMINSTATUS);
/*************************************/
$ADMINID=$_POST['adnmID'];
$ADBTN=$_POST['admnBTN'];
$pass4=$_POST['confirmpass'];
$CONFIRM = hash('sha256',$pass4 );
############################################################################################15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc...

$USRNM=$_POST['A'];
/*********************************/
$USRNM = strip_tags($USRNM);
/*********************************/
$SRNM=$_POST['B'];
/*********************************/
$SRNM = strip_tags($SRNM);
/*********************************/
$GNDR=$_POST['C'];
/*********************************/
$GNDR = strip_tags($GNDR);
/*********************************/
$CONTRY=$_POST['D'];
/*********************************/
$CONTRY= strip_tags($CONTRY);
/*********************************/
$MAIL=$_POST['E'];
/*********************************/
$MAIL = strip_tags($MAIL);
/*********************************/
$F=$_POST['F'];
$F=strip_tags($F);
$PASS = hash('sha256',$F);
/*********************************/

/*********************************/
$G=$_POST['G'];
$G=strip_tags($G);
$CNFRMPASS = hash('sha256',$G );
/*********************************/
$userInfo=$_POST['USRINFO'];
/*********************************/

?>