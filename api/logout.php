<?php
declare(strict_types=1);
require_once __DIR__ . '/_bootstrap.php';

$_SESSION = [];
session_destroy();

json_response(['ok' => true]);
