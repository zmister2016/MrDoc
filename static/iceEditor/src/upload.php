<?php
/**
 *------------------------------------------------------------------------------------*
 * 功能：iceEditor编辑器上传
 *------------------------------------------------------------------------------------*
 * 作者：ice
 * 官方：www.iceui.net
 * 时间：2018-04-25
 * 更新时间：时间：2020-10-22
 * 更新内容：增加网络图片下载到本地
 * 版权声明：该版权完全归官方www.iceui.net所有，可转载和个人学习使用，但请务必保留版权
 *------------------------------------------------------------------------------------*
 */

/*********************** 基本参数 ***********************/
header("Content-Type: text/html; charset=utf-8");
header("X-Powered-By: uz");
date_default_timezone_set('PRC');
session_start();
/*********************** 基本参数 ***********************/


/*********************** 上传项配置区 开始 ***********************/
//获取域名
$http = (isHttps() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];

// 绝对路径
define('URL',str_ireplace(str_replace("/","\\",$_SERVER['PHP_SELF']),'',__FILE__));

//上传目录
$dir = isset($_SESSION['upload_path'])?$_SESSION['upload_path']:'/upload/files/'.date("Ymd").'/';

//上传控件名称
$field = 'file';

//支持上传的文件格式
$type = ['jpg','jpeg','png','gif','bmp','exe','flv','swf','mkv','avi','rm','rmvb','mpeg','mpg','ogg','ogv','mov','wmv','mp4','webm','mp3','wav','mid','rar','zip','tar','gz','7z','bz2','cab','iso','chm','doc','docx','xls','xlsx','ppt','pptx','pdf','txt','md','xml','torrent'];

//上传文件存储大小的限制-默认30M
$maxSize = 30 * 102400;

//上传文件的名称命名方式，默认以'time'方式命名
//time 将以时间戳+数字排序     
//fileName 将以文件原来的名称命名，如果该文件含有中文，则自动改为time形式命名  
//填写其它字符串（禁止填写中文），将以该字符串形式命名，如果为批量上传，则将该字符串后面添加数字排序防止重名  
$rename = 'time';
/*********************** 上传项配置区 结束 ***********************/



//如果设置的上传目录不存在，则创建
if (!file_exists(URL.$dir)) {
    @mkdir(URL.$dir,0777,true);
}

//定义用来返回上传文件成功后的URL连接的JSON格式
$url = [];

//网络图片下载到本地
if(isset($_POST['iceEditor-img']) && $_POST['iceEditor-img']){
	$fileExt = file_ext($_POST['iceEditor-img']);
	$img = @file_get_contents($_POST['iceEditor-img']);
	if(!$img){
		$url['error'] = 1;
		$url['url'] = '';
	}else{
		$info = pathinfo($_POST['iceEditor-img']);
		$name = file_rename($info['basename']);
		//判断文件类型是否允许上传
		if (!$img || !in_array($fileExt,['jpg','jpeg','png','gif','bmp'])){
			$url['error'] = 1;
			$url['url'] = '';
		}
		if(file_put_contents(URL.$dir.$name, $img)){
			$url['error'] = 0;
			$url['url'] = $http.$dir.$name;
		}
	}
	echo json_encode($url);
	exit;
}

//获取批量上传的数组键值，也就是说上传的文件数量
$keys = array_keys($_FILES[$field]['name']);

//通过遍历来处理上传的文件
foreach ($keys as $key){

	//获取文件的类型
	$fileType = $_FILES[$field]['type'][$key];

	$name = $_FILES[$field]['name'][$key];

	//用来处理截图数据
	if($name == 'blob'){
		$ext = explode('/',$fileType);
		$name .= '.'.$ext[1];
	}

	//获取文件的名称
	$fileName = file_pre($name);

	//获取文件的后缀名称
	$fileExt = file_ext($name);

	//重命名
	$name = file_rename($name,$key);

	$error = 0;

	//判断文件类型是否允许上传
	if (!in_array($fileExt,$type)){
		$error = '该文件类型禁止上传';
	}

	//判断文件大小是否超出
	if ($_FILES[$field]["size"][$key] > $maxSize){
		$error = '该文件太大禁止上传';
	}

	//获取文件的完整url地址
	$url[$key]['url'] = $http.$dir.$name;
	$url[$key]['name'] = $fileName.'.'.$fileExt;
	$url[$key]['error'] = $error;
	if(!$error){
		//将上传的文件移动到指定目录
		move_uploaded_file($_FILES[$field]["tmp_name"][$key],URL.$dir.$name);
	}
}

//判断当前协议是否为HTTPS
function isHttps() {
	if (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') {
		return true;
	} elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
		return true;
	} elseif (!empty($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower($_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off') {
		return true;
	}
	return false;
}

//获取文件后缀名，不包含 .
function file_ext($name) {
	return strtolower(substr(strrchr($name, '.'), 1));
}

//获取文件的前缀，不包含 .
function file_pre($name) {
	return substr($name, 0, strrpos($name, '.'));
}

//重命名
function file_rename($name,$key=1) {

	global $rename;

	//获取文件的名称
	$fileName = file_pre($name);

	//获取文件的后缀名称
	$fileExt = file_ext($name);

	if($rename == 'time'){
		$name = time()+$key.'.'.$fileExt; //以时间戳加排序数字重命名，防止重复
	}elseif($rename == 'fileName' || $rename == ''){
		//如果文件名含有中文，则以时间戳加排序数字重命名，防止出错
		if(preg_match("/([\x81-\xfe][\x40-\xfe])/", $fileName, $match)){
			$name = time()+$key.'.'.$fileExt;
		}else{
			//以文件原来的名称
			$name = $fileName.'.'.$fileExt;
		}
		
	}else{
		//自定义重命名,如果该上传为批量，则自定义的命名后面添加排序数字
		if($key>0){
			$name = $rename.$key.'.'.$fileExt;
		}else{
			$name = $rename.'.'.$fileExt;
		}
	}
	return $name;
}
//输出最终数据;
echo json_encode($url);
exit;
?>