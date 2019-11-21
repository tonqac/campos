<?php
	$file = file_get_contents("../json/database.json");
	$json = json_decode($file);

	echo "<pre>";
	print_r($json);
	echo "</pre>";

	/*
	if($json){
		// Descargo todas las imágenes del servidor
		foreach($json as $n=>$info){
			if($info->images){
				foreach($info->images as $n=>$img){
					if($img){
						echo $img->img_file . "<br>
";
					}
				}
			}
		}
	}
	*/
?>