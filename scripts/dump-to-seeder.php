<?php
$file = $argv[1] ?? null;
if (!$file || !is_file($file)) {
    echo "Usage: php scripts/dump-to-seeder.php dump.sql > out.txt\n";
    exit(1);
}
$sql = file_get_contents($file);
preg_match_all("/INSERT INTO `products`.*?VALUES\s*(.*?);/is", $sql, $m);
$rows = [];
foreach ($m[1] as $vals) {
    preg_match_all("/\(.*?\)/s", $vals, $tuples);
    foreach ($tuples[0] as $t) {
        $rows[] = $t;
    }
}
echo "Found ".count($rows)." product rows in dump\n";
foreach ($rows as $r) {
    $r = trim($r, " ()");
    $parts = str_getcsv($r, ",", "'", "\\");
    $name = trim($parts[1] ?? '', " '");
    $image = trim($parts[4] ?? '', " '");
    if ($image === 'NULL' || $image === '') $image = 'null';
    else $image = "'".addslashes($image)."'";
    echo "['name'=>'".addslashes($name)."', 'image'=>".($image==='null'?'null':$image)."],\n";
}
