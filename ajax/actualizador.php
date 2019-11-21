<?php
	exit; /*** QUITAR DESPUES DE LAS PRUEBAS */
	
	$URL_DATETIME_LOCAL = "../json/last_update.json";

	$URL_DATABASE_LOCAL = "../json/database.json";

	$URL_DATETIME_EXTERNAL = "https://museodelholocausto.org.ar/museumSmartAdmin/dist/default/private/users/services/apps/guetos/guetos_service_last_update.php?_=".rand();

	$URL_DATABASE_EXTERNAL = "https://www.museodelholocausto.org.ar/museumSmartAdmin/dist/default/private/users/services/apps/guetos/guetos_service_json.php?_=".rand();

	$PATH_IMAGES = "../src/images/campos/";

	set_time_limit(60 * 10);
	
	error_reporting(E_ALL & ~E_NOTICE);
	
	ini_set("display_errors", "On");
	
	ini_set("error_log", "error.log");

	$datetime_local = file_get_contents($URL_DATETIME_LOCAL);
	
	$datetime_external = file_get_contents($URL_DATETIME_EXTERNAL);

	if($datetime_local!=$datetime_external && $datetime_external!=""){

		$database_external = file_get_contents($URL_DATABASE_EXTERNAL);
		
		$json = json_decode($database_external);

		if($json){

			foreach($json as $n=>$info){
				
				if($info->images){
				
					foreach($info->images as $n=>$img){
				
						if($img){



							$photo = $img->img_file;

							$img_local = $PATH_IMAGES.basename($photo);

							if(!file_exists($img_local)){

								$img_external = file_get_contents($photo);

								file_put_contents($img_local, $img_external);
							
							}

							$url_img_local = substr($img_local,3);

							$database_external = str_replace($photo,$url_img_local,$database_external);
						}
					}
				}
			}

			if(copy($URL_DATABASE_LOCAL,$URL_DATABASE_LOCAL.".bkp")){

				if(file_put_contents($URL_DATABASE_LOCAL, $database_external)){

					file_put_contents($URL_DATETIME_LOCAL, $datetime_external);
				}
			}
		}
		else{

			error_log("No se pudo procesar el JSON desde $URL_DATABASE_EXTERNAL. El contenido está vacio o no es un JSON válido.");
		}
	
	}
	
	exit;
?>