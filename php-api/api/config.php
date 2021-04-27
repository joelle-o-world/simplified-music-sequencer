<?php
  $sequencesStorePath = "./sequences";
  $sequencesIndexPath = "$sequencesStorePath/index.csv";

  function initialiseSequencesStore() {
    global $sequencesStorePath;
    if(!file_exists($sequencesStorePath))
      mkdir($sequencesStorePath, 0777, true);
  }
?>
