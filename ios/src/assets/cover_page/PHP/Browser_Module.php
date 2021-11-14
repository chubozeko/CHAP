
<?php
$browser="";
if(strrpos(strtolower($_SERVER["HTTP_USER_AGENT"]),strtolower("MSIE")))
{
$browser="Internet Explorer";
}
else if(strrpos(strtolower($_SERVER["HTTP_USER_AGENT"]),strtolower("Presto")))
{
$browser="Opera";
}
else if(strrpos(strtolower($_SERVER["HTTP_USER_AGENT"]),strtolower("CHROME")))
{
$browser="Google Chrome";
}
else if(strrpos(strtolower($_SERVER["HTTP_USER_AGENT"]),strtolower("SAFARI")))
{
$browser="Safari";
}
else if(strrpos(strtolower($_SERVER["HTTP_USER_AGENT"]),strtolower("FIREFOX")))
{
$browser="FIREFOX";
}
else
{
$browser="OTHER";
}

?>
