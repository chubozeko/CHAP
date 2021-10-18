<?php
  require_once('PHP/dbadapter.php');
  require_once('PHP/variable.php');
  require_once('PHP/Browser_Module.php');
  require_once('PHP/OS_Module.php');
?>
<?php
  $error = false;
  $email = htmlspecialchars($email);
  # First, Check if Button value is "Create Account"
  if ($btn1LOG == "LOG IN") {
	  if ($email != "" AND $password != "") {
      if (!filter_var($email,FILTER_VALIDATE_EMAIL) ) {
        $error = True;
        $error_message = "Please Enter Valid Email Address...!! ";
        echo "<script type=\"text/javascript\">
                alert('$error_message');
              </script> ";
      }
      elseif (strlen($password) < 6) {
        $error = True;
        $error_message = "Password Must Have At Least 6 Characters...!!";
        echo "<script type=\"text/javascript\"> 
                alert('$error_message');
              </script> ";
      }	else {	   
        #Database Checking Code starts here: 
        $ADMIN_INFO = mysqli_fetch_array(mysqli_query($conn,"SELECT id,email,password,adname,status FROM $admintb WHERE email='$email'"));
        $CHECK_ADMINE = $ADMIN_INFO['email'];
        $CHECK_ADMINP = $ADMIN_INFO['password'];
        $CHECK_ADMINID = (int)$ADMIN_INFO['id'];
        $CHECK_ADMINNAME = $ADMIN_INFO['adname'];
        $CHECK_ADMINSTATUS = $ADMIN_INFO['status'];
        
        $USER_INFO = mysqli_fetch_array(mysqli_query($conn,"SELECT userid,email,password FROM $user_info WHERE email='$email'"));
        $CHECK_EMAIL = $USER_INFO['email'];
        $CHECK_PASS = $USER_INFO['password'];
        $TAKE_ID = (int)$USER_INFO['userid'];
			
			  if($email == $CHECK_EMAIL AND $password == $CHECK_PASS)	{
          session_start();
          $_SESSION['sess_user'] = $CHECK_ADMINNAME;
          $_SESSION['usr_id'] = $CHECK_ADMINID;
          $_SESSION['email'] = $CHECK_ADMINE;
          $_SESSION['STATUS'] = $CHECK_ADMINSTATUS;
          # HERE WE NEED TO SET FECTED USER_INFO DATA AS A SESSION VARIABLE
          $INSERT_LOG_IN = "INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$TAKE_ID', '$IP', '$browser', '$user_os')";
          $control_Con = mysqli_query($conn, $INSERT_LOG_IN);
          if($control_Con) {
            ## CHECK ACCESS OF STANDARD USER HERE WE NEED TO DEFINE CHAP MAIN PAGE TO DIRECT (home.php) BUT INSTEAD OF home.php
            # IT HAS TO BE A CHAP MAIN FILE
            header("Location:http://www.chapchap.ga/login.php"); // FIRST CONNECTION METHOD                            
          } else {
            ## PART 2: EMAIL AND PASSWORD IS INVALID                                   
            $Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Connection ";
            echo "<script type=\"text/javascript\"> 
                    alert('$Check');
                  </script> ";
          }
			  } elseif($email== $CHECK_ADMINE AND $password==$CHECK_ADMINP) {
          session_start();
          $_SESSION['sess_user'] = $CHECK_ADMINNAME;
          $_SESSION['usr_id'] = $CHECK_ADMINID;
          $_SESSION['email'] = $CHECK_ADMINE;
          $_SESSION['STATUS'] = $CHECK_ADMINSTATUS;
          
          $INSERT_LOG_IN = "INSERT INTO `$log_in` ( `usrid`,  `ip`, `type_of_browser`,`opsystem`) VALUES ( '$CHECK_ADMINID', '$IP', '$browser', '$user_os')";
          $control_Con = mysqli_query($conn, $INSERT_LOG_IN);
          if($control_Con) {
            ## Check if Data saved in database or not
            # ADMIN PANEL CONNECTION 
            header("Location: ADMINPANEL.php"); 
            # header("Location:http://www.chapchap.ga/home");
          } else {
            ## PART 2: EMAIL AND PASSWORD IS INVALID                                   
            $Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Connection ";
            echo "<script type=\"text/javascript\"> 
                    alert('$Check');
                  </script> ";
          }
        } else {
				  $Check = "Invalid User Information! Please Check Again. ";
          echo "<script type=\"text/javascript\">
                  alert('$Check');
                </script> ";
	      }
	  	}
    }	else {
		  echo "<script type=\"text/javascript\">
	            alert('Do not Leave Empty Spaces.');
		        </script> ";
	  }
  } else {
	  $error = false;
    $email = htmlspecialchars($entrmail);
    if ($crtaccount == "Create Account") {
      // First Check Button value is Create Account
      if($usrname != "" AND $srname != "" AND $gender != "" AND $country != "" AND $entrmail != "" AND $email != "" AND $entrpass != "" AND $cnfrmpass != "") {
        // Second Check if form element is NOT empty
        if(strlen($usrname) < 3 AND strlen($srname) < 3) {
          // Third Check if username and surname has less than three characters
          $error = True;
          $username_surname_error = "Username and Surname must have more than 3 characters.";
          echo "<script type=\"text/javascript\">
                  alert('$username_surname_error');
                </script> ";
        } else if(!preg_match("/^[a-zA-Z ]+$/",$usrname) AND !preg_match("/^[a-zA-Z ]+$/",$srname)) {
          // Check if username and surname contains alphabets or not
          $error = True;
          $username_surname_error = "Username and Surname Must Contains Alphabet !!";
          echo "<script type=\"text/javascript\">
                  alert('$username_surname_error');
                </script> ";
        } elseif ( !filter_var($email,FILTER_VALIDATE_EMAIL) ) {
          // Forth Check if user email is valid or not 
          $error = true;
          $emailError = "**Please enter valid email address.";
        } else if(strlen($entrpass) < 6) {
          // Check if password size is less than six characters
          $error = true;
          $passError = "Password must have atleast 6 characters !!.";
          echo "<script type=\"text/javascript\"> 
                  alert('$passError');
                </script> ";
        } else {
          if($entrpass == $cnfrmpass) {
            // Fifth Confirm if password is same with the confirm password field
            // User Registration Code Here!!
            $SQL_COMMAND = "INSERT INTO `$user_info`(user_ip,usrname,usrsurname,email,password,country,gender) VALUES ('$IP', '$usrname', '$srname', '$email', '$entrpass', '$country', '$gender')";
            $control_Con = mysqli_query($conn,$SQL_COMMAND);
            if($control_Con) {
              //Check if Data saved or not in database 
              $Check = "Welcome To CHAP!! You Successfully Create CHAP Account  Please Login Now !! ";
              echo "<script type=\"text/javascript\"> 
                      alert('$Check');
                    </script> ";
            } else {
              $Check = "Ooops..... Something Went Wrong !! Please Check Entered Data or Check Your Internet Connection ";
              echo "<script type=\"text/javascript\">
                      alert('$Check');
                    </script> ";
            }
          } else {
            echo "<script type=\"text/javascript\"> 
                    alert('Your Password Is In Correct Please Check & Try Again !!!');
                  </script> ";
          }
        }
      } else {
	      echo "<script type=\"text/javascript\"> 
	              alert('Do not Leave Empty Space ');
	            </script> ";
      }
    } else {

    }
  }
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        
      <title> Welcome To CHAP! </title>
      <style>
        /* Remove the navbar's default margin-bottom and rounded borders */ 
        /* .navbar {
          margin-bottom: 0;
          border-radius: 0;
          background-color: black;
          
          color: white;
        }
          */
        /* Add a gray background color and some padding to the footer */
        
                  
        .logo_size{
          width: 80px;
          height: 70px;

        }
        .nav_background {
          background-color: black;
        }
        /* Make the image fully responsive */
        /* .carousel-inner img {
          width: 100%;
          height: 100%;
        } */
      </style>

  </head>
  <body>
    <nav class="navbar navbar-expand-sm nav_background navbar-dark">
      <a class="navbar-brand" href="#">CHAP</a>
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link"  data-toggle="modal" data-target="#tutorial">Tutorials</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="modal" data-target="#aboutus">About Us</a>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#signup"><i class="fas fa-user-plus"></i> &nbsp;Sign Up Free </button>&emsp;
        </li>
        <li class="nav-item">
          <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#login">Login &nbsp;<i class="fas fa-sign-in-alt"></i></button> &emsp;
        </li>
      </ul>
    </nav>  
    <div class="jumbotron">
      <div class="container text-center">
          <img src="logo/chaplogo.png" class="text-center"  alt="Image">
        <h1><b>Welcome To CHAP</b></h1>
          <br>
        <h3>A SMART FLOWCHART PROGRAM TO LEARNING PROGRAMMING CONSTRUCTS</h3>     
        <p><b>Supported by:</b> IOS, Android ,MAC ,Linux ,Windows</p>
      </div>
    </div>
          
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          <h3> <b><span class="material-icons">arrow_forward_ios</span>See More Example</b></h3>
              
          <div class="card">
            <div class="card-body">
              <h5><b><span class="material-icons">navigate_next</span>DECLARE VARIABLE</b></h5>
              <p class="card-text"> &emsp; &emsp; A declaration of a variable is where a program says that it needs a variable. For our small programs, place declaration statements between the two braces of the main method. The declaration gives a name and a data type for the variable. It may also ask that a particular value be placed in the variable.</p>         
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5><b><span class="material-icons">navigate_next</span> IF-ELSE STATEMENT</b></h5>
              <p class="card-text"> &emsp; &emsp; The if statement allows you to control if a program enters a section of code or not based on whether a given condition is true or false. One of the important functions of the if statement is that it allows the program to select an action based upon the user's input.</p>                
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5><b><span class="material-icons">navigate_next</span> WHILE LOOP</b></h5>
              <p class="card-text"> &emsp; &emsp; In most computer programming languages, a while loop is a control flow statement that allows code to be executed repeatedly based on a given Boolean condition. The while loop can be thought of as a repeating if statement.</p>            
            </div>              
          </div>
          <div class="card">
            <div class="card-body">
              <h5><b><span class="material-icons">navigate_next</span> FOR LOOP</b></h5>
              <p class="card-text"> &emsp; &emsp; In computer science, a for-loop (or simply for loop) is a control flow statement for specifying iteration, which allows code to be executed repeatedly. Various keywords are used to specify this statement: descendants of ALGOL use "for", while descendants of Fortran use "do".</p>
            </div>                    
          </div>
          <div class="card">
            <div class="card-body">
              <h5><b><span class="material-icons">navigate_next</span> DO WHILE LOOP</b></h5>
              <p class="card-text"> &emsp; &emsp; In most computer programming languages, a do while loop is a control flow statement that executes a block of code at least once, and then either repeatedly executes the block, or stops executing it, depending on a given boolean condition at the end of the block
              </p>
            </div>
          </div>
        </div>

            <div class="col-sm-6">
                <h3>See CHAP</h3>
                <div class="row">
                <div class="col-sm-4"></div>
                    <div class="col-sm-6 text-right">
                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                          <div class="carousel-item active">
                            <img class="d-block w-75" src="img/chapmulti1.png" alt="First slide">
                          </div>
                          <div class="carousel-item">
                            <img class="d-block w-75"  src="img/chapmobil.png" alt="Second slide">
                          </div>
                          <div class="carousel-item">
                            <img class="d-block w-75" src="img/chapmain.png" alt="Third slide">
                          </div>
                          <div class="carousel-item">
                            <img class="d-block w-75" src="img/ADMIN.png" alt="Fourth slide">
                          </div>
                          <div class="carousel-item">
                            <img class="d-block w-75" src="img/c1.png" alt="Fourth slide">
                          </div>
                          <div class="carousel-item">
                            <img class="d-block w-75" src="img/c2.png" alt="Fourth slide">
                          </div>
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="sr-only">Next</span>
                        </a>
                      </div>
                    </div>
                </div>
              </div>
    </div>
            <br>
            <!-- Login Modal -->
<div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="login" aria-hidden="true">
<div class="modal-dialog" role="document">
  <div class="modal-content bg-dark">
    <div class="modal-body ">
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      
      <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
        <div class="text-center"><img src="logo/chaplogo.png" width="129" height="120"></div>
              <div class="text-center" > 
                <h2 class="text-light">Welcome to CHAP</h2>
              </div>      
              <div class="form-group">
                  <input type="email" class="form-control"name="email" id="email" placeholder="Enter Your Email" required="required">
              </div>
              <div class="form-group">
                  <input type="password"name="passwordbox"  id="passwordbox"  class="form-control" placeholder="Enter Your Password" required="required">
              </div>
              <div class="form-group">
              
                        <input name="btn1LOG" type="Submit" value="LOG IN"class="btn btn-primary btn-block">
              </div>
            
              <p class="text-center"><a href="" data-toggle="modal" data-target="#signup">Create an Account</a></p>
          </form>
    
          
        
    </div>
    
      
    
  </div>
</div>
</div>
                  <!-- Sing Up Modal -->
<div class="modal fade" id="signup" tabindex="-1" role="dialog" aria-labelledby="signup" aria-hidden="true">
<div class="modal-dialog" role="document">
  <div class="modal-content bg-dark">
    <div class="modal-body ">
      <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
        <div class="text-center"><img src="logo/chaplogo.png" width="129" height="120"></div>
              <h2 class="text-center text-light">Create Your CHAP Account</h2> 
            <div class="form-group">
            
              <input type="text" class="form-control" name="usrname" id="usrname" placeholder="First Name" required="required">
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="surname" id="surname" placeholder="Last Name" required="required">
                  
            </div>
          <div class="form-group">
                <input type="email" class="form-control" name="email" id="email" placeholder="Email" required="required">
          </div>
            <div class="form-group">
          &emsp; &emsp; <label class="radio-inline text-light"><input type="radio" name="gndr" id="Male" style="font-size:50px; font-weight:bold;" value="Male" />
          Male </label>
      &emsp; &emsp; <label class="radio-inline text-light"><input type="radio" name="gndr" id="Female"  value="Female"  />
        Female</label>
      &emsp; &emsp; <label class="radio-inline text-light"> <input type="radio" name="gndr" id="Other"   value="Other"  />
        Other</label>
      </div>
              <div class="form-group">
                <select name="cntry" class="form-control">
              <option value="NULL">Select Your Country</option>
            <option value="Afghanistan">Afghanistan</option>
            <option value="Åland Islands">Åland Islands</option>
            <option value="Albania">Albania</option>
            <option value="Algeria">Algeria</option>
            <option value="American Samoa">American Samoa</option>
            <option value="Andorra">Andorra</option>
            <option value="Angola">Angola</option>
            <option value="Anguilla">Anguilla</option>
            <option value="Antarctica">Antarctica</option>
            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
            <option value="Argentina">Argentina</option>
            <option value="Armenia">Armenia</option>
            <option value="Aruba">Aruba</option>
            <option value="Australia">Australia</option>
            <option value="Austria">Austria</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Bahamas">Bahamas</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Barbados">Barbados</option>
            <option value="Belarus">Belarus</option>
            <option value="Belgium">Belgium</option>
            <option value="Belize">Belize</option>
            <option value="Benin">Benin</option>
            <option value="Bermuda">Bermuda</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
            <option value="Botswana">Botswana</option>
            <option value="Bouvet Island">Bouvet Island</option>
            <option value="Brazil">Brazil</option>
            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
            <option value="Brunei Darussalam">Brunei Darussalam</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Burundi">Burundi</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Canada">Canada</option>
            <option value="Cape Verde">Cape Verde</option>
            <option value="Cayman Islands">Cayman Islands</option>
            <option value="Central African Republic">Central African Republic</option>
            <option value="Chad">Chad</option>
            <option value="Chile">Chile</option>
            <option value="China">China</option>
            <option value="Christmas Island">Christmas Island</option>
            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
            <option value="Colombia">Colombia</option>
            <option value="Comoros">Comoros</option>
            <option value="Congo">Congo</option>
            <option value="Congo, The Democratic Republic ">Congo, The Democratic Republic </option>
            <option value="Cook Islands">Cook Islands</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Cote D'ivoire">Cote D'ivoire</option>
            <option value="Croatia">Croatia</option>
            <option value="Cuba">Cuba</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Denmark">Denmark</option>
            <option value="Djibouti">Djibouti</option>
            <option value="Dominica">Dominica</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Egypt">Egypt</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Equatorial Guinea">Equatorial Guinea</option>
            <option value="Eritrea">Eritrea</option>
            <option value="Estonia">Estonia</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
            <option value="Faroe Islands">Faroe Islands</option>
            <option value="Fiji">Fiji</option>
            <option value="Finland">Finland</option>
            <option value="France">France</option>
            <option value="French Guiana">French Guiana</option>
            <option value="French Polynesia">French Polynesia</option>
            <option value="French Southern Territories">French Southern Territories</option>
            <option value="Gabon">Gabon</option>
            <option value="Gambia">Gambia</option>
            <option value="Georgia">Georgia</option>
            <option value="Germany">Germany</option>
            <option value="Ghana">Ghana</option>
            <option value="Gibraltar">Gibraltar</option>
            <option value="Greece">Greece</option>
            <option value="Greenland">Greenland</option>
            <option value="Grenada">Grenada</option>
            <option value="Guadeloupe">Guadeloupe</option>
            <option value="Guam">Guam</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Guernsey">Guernsey</option>
            <option value="Guinea">Guinea</option>
            <option value="Guinea-bissau">Guinea-bissau</option>
            <option value="Guyana">Guyana</option>
            <option value="Haiti">Haiti</option>
            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
            <option value="Honduras">Honduras</option>
            <option value="Hong Kong">Hong Kong</option>
            <option value="Hungary">Hungary</option>
            <option value="Iceland">Iceland</option>
            <option value="India">India</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
            <option value="Iraq">Iraq</option>
            <option value="Ireland">Ireland</option>
            <option value="Isle of Man">Isle of Man</option>
            <option value="Israel">Israel</option>
            <option value="Italy">Italy</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Japan">Japan</option>
            <option value="Jersey">Jersey</option>
            <option value="Jordan">Jordan</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Kenya">Kenya</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
            <option value="Korea, Republic of">Korea, Republic of</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Kyrgyzstan">Kyrgyzstan</option>
            <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
            <option value="Latvia">Latvia</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Lesotho">Lesotho</option>
            <option value="Liberia">Liberia</option>
            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
            <option value="Liechtenstein">Liechtenstein</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Macao">Macao</option>
            <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Malawi">Malawi</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Maldives">Maldives</option>
            <option value="Mali">Mali</option>
            <option value="Malta">Malta</option>
            <option value="Marshall Islands">Marshall Islands</option>
            <option value="Martinique">Martinique</option>
            <option value="Mauritania">Mauritania</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Mayotte">Mayotte</option>
            <option value="Mexico">Mexico</option>
            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
            <option value="Moldova, Republic of">Moldova, Republic of</option>
            <option value="Monaco">Monaco</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Montenegro">Montenegro</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Morocco">Morocco</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Namibia">Namibia</option>
            <option value="Nauru">Nauru</option>
            <option value="Nepal">Nepal</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Netherlands Antilles">Netherlands Antilles</option>
            <option value="New Caledonia">New Caledonia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Niger">Niger</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Niue">Niue</option>
            <option value="Norfolk Island">Norfolk Island</option>
            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
            <option value="Norway">Norway</option>
            <option value="Oman">Oman</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Palau">Palau</option>
            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
            <option value="Panama">Panama</option>
            <option value="Papua New Guinea">Papua New Guinea</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Peru">Peru</option>
            <option value="Philippines">Philippines</option>
            <option value="Pitcairn">Pitcairn</option>
            <option value="Poland">Poland</option>
            <option value="Portugal">Portugal</option>
            <option value="Puerto Rico">Puerto Rico</option>
            <option value="Qatar">Qatar</option>
            <option value="Reunion">Reunion</option>
            <option value="Romania">Romania</option>
            <option value="Russian Federation">Russian Federation</option>
            <option value="Rwanda">Rwanda</option>
            <option value="Saint Helena">Saint Helena</option>
            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
            <option value="Saint Lucia">Saint Lucia</option>
            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
            <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
            <option value="Samoa">Samoa</option>
            <option value="San Marino">San Marino</option>
            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Senegal">Senegal</option>
            <option value="Serbia">Serbia</option>
            <option value="Seychelles">Seychelles</option>
            <option value="Sierra Leone">Sierra Leone</option>
            <option value="Singapore">Singapore</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Solomon Islands">Solomon Islands</option>
            <option value="Somalia">Somalia</option>
            <option value="South Africa">South Africa</option>
            <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
            <option value="Spain">Spain</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Sudan">Sudan</option>
            <option value="Suriname">Suriname</option>
            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
            <option value="Swaziland">Swaziland</option>
            <option value="Sweden">Sweden</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
            <option value="Taiwan, Province of China">Taiwan, Province of China</option>
            <option value="Tajikistan">Tajikistan</option>
            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
            <option value="Thailand">Thailand</option>
            <option value="Timor-leste">Timor-leste</option>
            <option value="Togo">Togo</option>
            <option value="Tokelau">Tokelau</option>
            <option value="Tonga">Tonga</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Turkey">Turkey</option>
            <option value="Turkmenistan">Turkmenistan</option>
            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
            <option value="Tuvalu">Tuvalu</option>
            <option value="Uganda">Uganda</option>
            <option value="Ukraine">Ukraine</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Vanuatu">Vanuatu</option>
            <option value="Venezuela">Venezuela</option>
            <option value="Viet Nam">Viet Nam</option>
            <option value="Virgin Islands, British">Virgin Islands, British</option>
            <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
            <option value="Wallis and Futuna">Wallis and Futuna</option>
            <option value="Western Sahara">Western Sahara</option>
            <option value="Yemen">Yemen</option>
            <option value="Zambia">Zambia</option>
            <option value="Zimbabwe">Zimbabwe</option>
          </select>
              </div>
          <div class="form-group">
                  <input type="password" class="form-control" name="PASS" placeholder="Password" required="required">
              </div>
          <div class="form-group">
                  <input type="password" class="form-control" name="CNFRPASS" placeholder="Confirm Password" required="required">
              </div>        
              
          <div class="form-group">
                <input type="submit" name="CRTBTN" class="btn btn-primary btn-block"   value="Create Account" >
              </div>
          
          </form>
        
    </div>
  </div>
</div>
</div>     
<!-- Tutorial Modal -->
<!-- Modal -->
<div class="modal fade bd-example-modal-lg" id="tutorial" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title" id="exampleModalLongTitle"><b> CHAP Tutorials</b></h3>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" data-spy="scroll">
    
    <div class="row ">
        <div class="col-sm-1"></div>
        <div class="col-sm-4"> 
        <div class="card" style="width: 18rem;">
              <iframe class="card-img-top" src="https://www.youtube.com/embed/Ko8smCzh3K0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="card-body">
                  <p class="card-text">CHAP Tutorial # 1 Introduction To CHAP</p>
                </div>
              </div>
            </div>
            <div class="col-sm-1"></div>
            <div class="col-sm-4"> 
        <div class="card" style="width: 18rem;">
        <iframe class="card-img-top" src="https://www.youtube.com/embed/hBzYE91-6UM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="card-body">
                  <p class="card-text">CHAP Tutorial # 2 Get Two Input From User And Sum</p>
                </div>
              </div>
            </div>

        </div>
        <div class="row "id="İkinci Albüm"> 
        <div class="col-sm-1"></div>
        <div class="col-sm-4"> 
        <div class="card" style="width: 18rem;">
        <iframe class="card-img-top" src="https://www.youtube.com/embed/OtDEWCrER1U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="card-body">
                  <p class="card-text">CHAP Tutorial # 3 Basic if-else Condition</p>
                </div>
              </div>
            </div>
            <div class="col-sm-1"></div>
            <div class="col-sm-4"> 
        <div class="card" style="width: 18rem;">
        <iframe class="card-img-top" src="https://www.youtube.com/embed/IQFl0bVP8cE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="card-body">
                  <p class="card-text">CHAP Tutorial # 4 Basic While Loop</p>
                </div>
              </div>
            </div>
        </div>


        
    </div>
        
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  </div>
</div>
</div>
<!-- Documentation  Modal -->

<!-- Modal -->
<div class="modal fade bd-example-modal-lg"  id="aboutus" tabindex="-1" role="dialog" aria-labelledby="aboutus" aria-hidden="true">
<div class="modal-dialog modal-lg" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">About Us</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <p>
    CHAP is a Flowchart-creating program that allows users to interactively build and run solutions to programming problems. 

    Users can solely concentrate on the logical structure of an algorithm, rather than the syntactic format of a typical programming language. 

Additionally, users can generate the corresponding Pseudo Code of their created flowcharts, along with the source code of a few conventional programming languages, such as C++ and Java. 


Developed by:
Chubo Zeko
Hasan Tuncel Çoban 


EPR402 - Capstone Project - 2018
    </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      
    </div>
  </div>
</div>
</div>
  </body>
</html>