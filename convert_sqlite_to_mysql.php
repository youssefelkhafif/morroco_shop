<?php
$input = __DIR__ . '/ecommerce.sql';
$output = __DIR__ . '/ecommerce-mysql.sql';
if (!file_exists($input)) {
    fwrite(STDERR, "Input file not found: $input\n");
    exit(1);
}
$sql = file_get_contents($input);
// Split on semicolon followed by newline, but keep it simple for this file.
$statements = preg_split('/;\s*\n/', $sql);
$tables = [];
$indexes = [];
$inserts = [];
$others = [];
foreach ($statements as $stmt) {
    $trim = trim($stmt);
    if ($trim === '') continue;
    $upper = strtoupper($trim);
    if (str_starts_with($upper, 'CREATE TABLE')) {
        $tables[] = $trim;
    } elseif (str_starts_with($upper, 'CREATE INDEX') || str_starts_with($upper, 'CREATE UNIQUE INDEX')) {
        $indexes[] = $trim;
    } elseif (str_starts_with($upper, 'INSERT INTO')) {
        $inserts[] = $trim;
    } else {
        $others[] = $trim;
    }
}
$converted = "SET FOREIGN_KEY_CHECKS = 0;\n\n";
foreach ($tables as $stmt) {
    if (preg_match('/CREATE TABLE `?"?([a-zA-Z0-9_]+)`?"?/i', $stmt, $m)) {
        $name = $m[1];
        $converted .= "DROP TABLE IF EXISTS `" . $name . "`;\n";
    }
}
$converted .= "\n";
foreach ($tables as $stmt) {
    $stmt = preg_replace('/"([a-zA-Z0-9_]+)"/', '`$1`', $stmt);
    $stmt = preg_replace('/\binteger primary key autoincrement not null\b/i', 'int NOT NULL AUTO_INCREMENT PRIMARY KEY', $stmt);
    $stmt = preg_replace('/\binteger primary key autoincrement\b/i', 'int NOT NULL AUTO_INCREMENT PRIMARY KEY', $stmt);
    $stmt = preg_replace('/\binteger primary key\b/i', 'int PRIMARY KEY', $stmt);
    $stmt = preg_replace('/\bdefault \(\'([^\']*)\'\)/i', "default '$1'", $stmt);
    $stmt = preg_replace('/\bdefault \(([^\)]+)\)/i', 'default $1', $stmt);
    $stmt = preg_replace('/\bvarchar\b(?!\s*\()/i', 'varchar(255)', $stmt);
    $stmt = preg_replace('/\bTEXT\b/i', 'text', $stmt);
    $stmt = preg_replace('/\bNUMERIC\b/i', 'decimal(20,2)', $stmt);
    $stmt = preg_replace('/\bAUTOINCREMENT\b/i', 'AUTO_INCREMENT', $stmt);
    $stmt = preg_replace('/\bPRIMARY KEY \(`id`\)\b/i', 'PRIMARY KEY (`id`)', $stmt);
    $stmt = preg_replace('/`([^`]+)`\.`([^`]+)`/', '`$1`.`$2`', $stmt);
    $converted .= $stmt . ";\n\n";
}
foreach ($indexes as $stmt) {
    $stmt = preg_replace('/"([a-zA-Z0-9_]+)"/', '`$1`', $stmt);
    $converted .= $stmt . ";\n\n";
}
foreach ($inserts as $stmt) {
    $stmt = preg_replace('/"([a-zA-Z0-9_]+)"/', '`$1`', $stmt);
    $converted .= $stmt . ";\n\n";
}
$converted .= "SET FOREIGN_KEY_CHECKS = 1;\n";
file_put_contents($output, $converted);
echo "Converted to $output\n";
