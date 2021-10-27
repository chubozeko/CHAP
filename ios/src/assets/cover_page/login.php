<?php
/********************************************************************************************************************/
require_once('PHP/dbadapter.php');
require_once('PHP/variable.php');
?>
<?php
session_start();
if(!isset($_SESSION["sess_user"]))
{
	header("Location:index.php");
}
else
{
?>
<?php
if ($sec=="List All"){
  $limit=999999; #Sayfalama Değeri 
  if (isset($_GET["page"])) {
    $page  = $_GET["page"]; 
    } 
    else{ 
    $page=1;
    };  
  $start_from = ($page-1) * $limit;  
  $result = mysqli_query($conn,"SELECT * FROM `$log_in` ORDER BY login_id ASC LIMIT $start_from, $limit"); 
}else{
$limit=10; #Sayfalama Değeri 
if (isset($_GET["page"])) {
	$page  = $_GET["page"]; 
	} 
	else{ 
	$page=1;
	};  
$start_from = ($page-1) * $limit;  
$result = mysqli_query($conn,"SELECT * FROM `$log_in` ORDER BY login_id ASC LIMIT $start_from, $limit");
}
?>

<?php


?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8">
<!-- Bootstrap Kütüphane Kodu BAŞLANGIÇ -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
<!-- Bootstrap Kütüphane Kodu BİTİŞ -->

<!-- Sayfa GENEL CSS BAŞLANGIÇ -->
<link rel="stylesheet" href="CSSLIB/STIL.css"> 

<!-- Sayfa GENEL CSS BİTİŞ -->
<script type="text/javascript" src="https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js"></script> <!-- Excel Library -->
<script type="text/Javascript">
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}
function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("kmkara");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}


    
      
  
    function printDiv(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    } function ExportExcel(type, fn, dl) {
                  var elt = document.getElementById('myTable');
                  var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
                  return dl ?
                      XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
                      XLSX.writeFile(wb, fn || ('Kullanici_Kayit.' + (type || 'xlsx'))) 
    }      
</script>

<title>Log_In</title>
</head>
<body>
<form method="post" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" autocomplete="off">
<div id="mySidebar" class=" sidebar" name="YAN AÇILIR MENÜ BAŞLANGICI">
<h5> <b>&nbsp;MENU</b><a href="javascript:void(0)" class="closebtn " onclick="closeNav()">×</a> </h5>
<ul class="nav nav-pills flex-column ">
        <li class="nav-item">
        <a class="nav-link active" href="main.php" ><i class="fas fa-tachometer-alt"></i> &nbsp;Dashboard</a>
</li>
        <li class="nav-item ">
        <a class="nav-link" href="adminpanel.php" ><i class="fas fa-users-cog"></i>&nbsp;Admin Manager</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="userinfo.php" ><i class="fas fa-users"></i>&nbsp;User Information</a>
        </li>
		 <li class="nav-item">
          <a class="nav-link" href="login.php" ><i class="fas fa-sign-out-alt"></i>&nbsp;Log In Information</a>
        </li>
      </ul>
</div>

<div id="main" name="ANA SAYFA"><!-- ANA SAYFA-->
                   
        
          <div class="container-fluid"><!-- ANA KONTEYNER -->  
          <nav class="navbar navbar-dark bg-dark">
              <a class="navbar-brand" href="main.php"><b>CHAP User Management Systems</b></a>
              
              <form class="form-inline">
              
              <button type="button" name="MENU" class="btn my-2 my-sm-0 btn-dark " onclick="openNav()"><b>☰ Menu</b></button><!-- Sütün 2-->
             
            </nav>
                       
             
                          <div class="container-fluid "><!-- İçerik -->
                          <div class="row">
                              <div class="col-sm-12 text-right ">
                              <br>
                                   <a class="btn my-2 my-sm-0 btn-dark   " href="logout.php" > Welcome Admin:&emsp;<?=$_SESSION['sess_user'];?>&emsp;LOG OUT</a>
                              </div>
                          </div>
                          <?php
} # Session End
                          ?>
<h3><b>Log In Control Panel</b></h3>
                              
                   
             
             <div class="row">
             <div class="col-sm-2">
                          <input class="form-control text-center " id="kmkara" name="kmkmara" onkeyup="myFunction()"  type="text" placeholder="Search ID" />
                  </div>
                  <div class="col-sm-2">
                        <select id="sec" name="sec"  class="form-control" onchange="this.form.submit();" ><!-- Veri fitreleme-->
                          <option value="0">List</option>
                          <option value="List All">List All</option>
                       </select>
                  </div>
                  <div class="col-sm-4 text-right">
                      <!-- <button type="button" class="btn btn-secondary " onclick="javascript:printDiv('print');" >&ensp;Print&ensp;</button> -->
                  </div>
                  <div class="col-sm-4 text-right ">
                  <button type="button" class="btn btn-secondary " onclick="javascript:printDiv('print');" ><i class="fas fa-print"></i>&ensp;Print&ensp;</button>   &ensp; 
                   <button type="button" class="btn btn-secondary " onclick="ExportExcel('ods')" ><i class="far fa-file-excel"></i>&ensp; Excel&ensp;</button>
                  
                  </div>
             </div>
             <div class="row">  <!-- Admin listesi tablosu -->
                    <div class="col-sm-12" id="print">
                    <br>
                    <table class="table table-bordered table-striped table-responsive" id="myTable" >
                    <thead class="thead-dark">
                         
                          <tr>  
                          <th>Log-ID #</th>
                          <th>User- ID #</th>
                          <th>User IP Adress #</th>
                          <th>Log-Time & Date #</th>
                        
                          <th> Used Web Browser #</th>
                          <th> Used Operating Systems #</th>
                          </tr> 
                      </thead> 
                                <tbody>
                                <?php  
                                          while ($row = mysqli_fetch_array($result)) {  
                                ?>  
                                          <tr>  
                                              <td><?php echo $row["login_id"]; ?></td>  
                                              <td><?php echo $row["usrid"]; ?></td>
                                              <td><?php echo $row["ip"]; ?></td>
                                              <td><?php echo $row["log_time_date"]; ?></td>
                                              
                                              
                                              <td><?php echo $row["type_of_browser"]; ?></td>
                                              <td><?php echo $row["opsystem"]; ?></td>
                                          </tr>
                            <?php  
                                 };  
                             ?> 
                                </tbody>                 
                    </table>
                    <?php  

                            $result_db = mysqli_query($conn,"SELECT COUNT(login_id) FROM log_in"); 
                            $row_db = mysqli_fetch_row($result_db);  
                            $total_records = $row_db[0];  
                            $total_pages = ceil($total_records / $limit); 
                            $showed_pages=5;
                            $show= ceil($total_pages / $showed_pages);
                            echo '<ul class="pagination">'; 
                            if($page<=1){
                              echo '<li class="page-item"> <a class ="page-link" href="login.php?page='.($page=1).'">First</a> </li>';
                             }else{
                              echo '<li class="page-item"> <a class ="page-link" href="login.php?page='.($page-1).'">Previous</a> </li>'; 
                             }  
                              for ($i=1; $i<=$show; $i++) {
                                      echo '<li class="page-item"> <a class ="page-link" login.php?page='.$i.'">'.($i).'</a> </li>';
                                    }
                                if($show<=$total_pages){
                                    echo '<li class="page-item"> <a class ="page-link" >--</a> </li>';
                                     echo '<li class="page-item"> <a class ="page-link " href="login.php?page='.($i+1).'"><b class="text-danger">'.($page).'</b></a> </li>';
                                                                           
                                  }   
                                  echo '<li class="page-item"> <a class ="page-link" ><i class="fas fa-angle-double-right"></i> </a> </li>';
                                  echo '<li class="page-item"> <a class ="page-link" href="login.php?page='.($total_pages).'">'.($total_pages).'</a> </li>'; 
                            if($page==$total_pages){
                              echo '<li class="page-item"> <a class ="page-link" href="href="login.php?page='.($total_pages).'">Last</a> </li>'; 
                            }else{
                              echo '<li class="page-item"> <a class ="page-link " href="login.php?page='.($page+1).'">Next</a> </li>'; 
                            }
                    
                 echo  '</ul>'  ;        
                ?>
                    </div>
               </div> 







                          
                          </div><!-- İçerik -->
              </div><!-- ANA KONTEYNER -->          
</div><!-- ANA SAYFA-->




  </form>

 
</body>
</html> 