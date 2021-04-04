<?php
  
  include "./config.php";

  $sequenceData = $_POST['sequence'];
  $title = $_POST['title'];
  $composer = $_POST['composer'];

  $sequenceId = "$composer-$title";

  $filename = "$sequenceName.json";
  $filepath = "$sequencesStorePath/$filename";
  $n = 0;
  while(file_exists($filepath)) {
    $n++;
    $sequenceId = "$composer-$title-$n";
    $filename = "$sequenceId.json";
    $filepath = "$sequencesStorePath/$filename";
  }

  initialiseSequencesStore();

  // Append line to index
  $indexFileHandle = fopen($sequencesIndexPath, 'a');
  $newIndexRow = $sequenceId . "\t" . $composer ."\t". $title;
  fwrite($indexFileHandle, $newIndexRow."\n");

  // Save actual file
  $sequenceFileHandle = fopen($filepath, "w");
  fwrite($sequenceFileHandle, $sequenceData);

  echo $filename;
?>
