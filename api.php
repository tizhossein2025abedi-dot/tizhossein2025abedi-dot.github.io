<?php
// Simple state API for Atinama LMS - for demo only. Requires PHP and write permission to data/state.json
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$path = __DIR__ . '/data/state.json';
if(!file_exists($path)){
    @mkdir(__DIR__.'/data',0755,true);
    file_put_contents($path, json_encode([
        'students'=>[
            ['id'=>'t1','username'=>'teacher','name'=>'مدیر','phone'=>'','pass'=>'admin2025','approved'=>true,'role'=>'teacher']
        ],
        'sessions'=>[],
        'assignments'=>[],
        'quizzes'=>[],
        'qa'=>[]
    ], JSON_UNESCAPED_UNICODE));
}
$method = $_SERVER['REQUEST_METHOD'];
if($method === 'GET'){
    echo file_get_contents($path);
    exit;
}
if($method === 'POST'){
    $input = file_get_contents('php://input');
    if($input){
        // basic validation: decode
        $data = json_decode($input, true);
        if($data === null){
            echo json_encode(['ok'=>false,'error'=>'invalid_json'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        file_put_contents($path, json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
        echo json_encode(['ok'=>true], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        echo json_encode(['ok'=>false,'error'=>'empty_body'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
echo json_encode(['ok'=>false,'error'=>'method_not_allowed'], JSON_UNESCAPED_UNICODE);
?>