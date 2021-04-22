DELILAH RESTO API

1-Ingresa a https://www.apachefriends.org/ y descarga el Xampp para tu sistema operativo.
2-Enciende el Apache y Mysql desde Xampp control


Para crear la base de datos:
	1.Abrir consola,
	2.Navegar hasta carpeta "database",
	3.Escribir en la consola "node createDataBase.js",
	4.Apretar ctrl+c para finalizar el proceso

Para cargar la base de datos:
	Luego de crear la base de datos:
	1.Escribir en la consola "node setup.js",
	2.Apretar ctrl+c para finalizar el proceso,
	3.LA BASE DE DATOS ESTA CREADA Y CON DATOS

Para comenzar a usar la API:
	En la consola de node navegar hasta la carpeta principal,si todavía estamos en la carpeta "database" escribimos "cd.." en consola
	Una vez parados en la carpeta principal escribimos el comando "node server.js"
	
Ya podemos usar la API

Para hacer más fácil el proceso de corrección recomiendo utilizar POSTMAN con la siguiente coleccion, imortandola mediante el link:
	https://www.getpostman.com/collections/142da8cd66adb45dc16c

Para parametrizar la conexión a la base:
  En el archivo config.js en la carpeta principal se pueden modificar los datos específicos para una base de datos remota o local (objetos por separado)
Ejemplo:
	REMOTA
	let dataDBRemota = {
		user: "sNUbrPBJdI",
		password: "GdTXgKAFV9",
		host: "remotemysql.com",
		port: 3306,
		database: "sNUbrPBJdI",
	}
	LOCAL
	let dataDBLocal = {
		user: "root",
		host: "localhost",
		port: 3306,
		database: "delilahResto",
	}
En los archivos index y createDataBase, dentro de la carpeta database se encuentran por separado las variables para los parametros de base de datos y la variable sequelize. En este caso en particular se encuentran comentadas las correspondientes a la conexión para base de datos remota..
En caso de querer conectar una base de datos remota, los pasos a seguir son los mismos que con local, comentando los parametros locales y "descomentando" los parametros remotos. 
