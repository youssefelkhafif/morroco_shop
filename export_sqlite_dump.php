<?php
$dbPath = __DIR__ . '/database/database.sqlite';
if (!file_exists($dbPath)) {
    fwrite(STDERR, "SQLite database not found: $dbPath\n");
    exit(1);
}
$db = new SQLite3($dbPath);
$out = '';
$res = $db->query("SELECT type, name, sql FROM sqlite_master WHERE sql NOT NULL ORDER BY type, name;");
while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    if ($row['type'] === 'table' && $row['name'] === 'sqlite_sequence') {
        continue;
    }
    $out .= $row['sql'] . ";\n\n";
}
$tables = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name!='sqlite_sequence' ORDER BY name;");
while ($table = $tables->fetchArray(SQLITE3_ASSOC)) {
    $name = $table['name'];
    $rows = $db->query('SELECT * FROM "' . SQLite3::escapeString($name) . '"');
    while ($row = $rows->fetchArray(SQLITE3_ASSOC)) {
        if ($row === false) {
            continue;
        }
        $cols = array_keys($row);
        $vals = array_map(function ($v) {
            if (is_null($v)) {
                return 'NULL';
            }
            return "'" . SQLite3::escapeString($v) . "'";
        }, $row);
        $quotedCols = array_map(function ($c) {
            return '"' . str_replace('"', '""', $c) . '"';
        }, $cols);
        $out .= 'INSERT INTO "' . str_replace('"', '""', $name) . '" (' . implode(',', $quotedCols) . ') VALUES (' . implode(',', $vals) . ");\n";
    }
    $out .= "\n";
}
file_put_contents(__DIR__ . '/ecommerce.sql', $out);
echo 'WROTE ' . strlen($out) . " bytes\n";
