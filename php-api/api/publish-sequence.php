<?php
  
  include "./config.php";

  function escape($raw) {
    return preg_replace('/[^A-Za-z0-9_\-]/', '_', $raw);
  }

  $sequenceData = $_POST['sequence'];
  $title = escape($_POST['title']);
  $composer = escape($_POST['composer']);

  $sequenceId = "sequence_$composer_$title";

  $filename = "$sequenceId.json";
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
  $date = date("Y-m-d h:i:sa");
  $newIndexRow = $sequenceId . "\t" . $composer ."\t". $title . "\t".$date;
  fwrite($indexFileHandle, $newIndexRow."\n");

  // Save actual file
  $sequenceFileHandle = fopen($filepath, "w");
  fwrite($sequenceFileHandle, $sequenceData);

  mail("joelyjoel@protonmail.com", "New Sequence uploaded!", "from: $composer");

  echo $filename;
?>
