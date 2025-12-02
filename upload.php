<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$dir = __DIR__ . '/uploads';
if(!is_dir($dir)) mkdir($dir,0755,true);
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    echo json_encode(['ok'=>false,'error'=>'only_post']);
    exit;
}
if(!isset($_FILES['file'])){
    echo json_encode(['ok'=>false,'error'=>'no_file']);
    exit;
}
$up = $_FILES['file'];
if($up['error'] !== UPLOAD_ERR_OK){
    echo json_encode(['ok'=>false,'error'=>'upload_error']);
    exit;
}
$ext = pathinfo($up['name'], PATHINFO_EXTENSION);
$allowed = ['jpg','jpeg','png','pdf','mp4','mov','mkv','doc','docx','ppt','pptx'];
if(!in_array(strtolower($ext),$allowed)){
    echo json_encode(['ok'=>false,'error'=>'ext_not_allowed']);
    exit;
}
$filename = uniqid('f_') . '.' . $ext;
$target = $dir . '/' . $filename;
if(move_uploaded_file($up['tmp_name'], $target)){
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off')?'https':'http';
    $host = $_SERVER['HTTP_HOST'];
    $path = dirname($_SERVER['PHP_SELF']);
    $url = $proto.'://'.$host.$path.'/uploads/'.$filename;
    echo json_encode(['ok'=>true,'url'=>$url], JSON_UNESCAPED_UNICODE);
    exit;
} else {
    echo json_encode(['ok'=>false,'error'=>'move_failed']);
    exit;
}
?>