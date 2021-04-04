<?php
  include "./config.php";
  $sequenceId = $_GET['id'];

  $sequencePath = "$sequencesStorePath/$sequenceId.json";

  if(file_exists($sequencePath))
    readfile($sequencePath);
?>
