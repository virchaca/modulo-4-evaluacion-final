CREATE database vans_db;
use vans_db;

CREATE TABLE `vans_db`.`vans_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `marca` VARCHAR(45) NULL,
  `año_matriculacion` VARCHAR(45) NULL,
  `color` VARCHAR(45) NULL,
  `numero_plazas` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
  
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('citroen Jumpy', '2005', 'blanca', '3');
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('volkswagen t3', '1998', 'verde/blanca', '2');
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('renault traffic', '2003', 'azul', '5');
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('peugot boxer', '2012', 'gris', '3');
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('ford transit', '2021', 'negra', '8');
INSERT INTO `vans_db`.`vans_details` (`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES ('fiat ducato', '2016', 'blanca', '6');

INSERT INTO vans_details(`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES (' renault kangoo', '2015', 'silver', '5');
  
ALTER TABLE `vans_db`.`vans_details` 
CHANGE COLUMN `marca` `marca` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `año_matriculacion` `año_matriculacion` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `color` `color` VARCHAR(45) NOT NULL ,
CHANGE COLUMN `numero_plazas` `numero_plazas` VARCHAR(45) NOT NULL ;

 UPDATE vans_details SET marca = 'fiat ducato' , año_matriculacion = 2016, color ='morado', numero_plazas = 6 WHERE id = 11;
 
 INSERT INTO vans_details(`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES (' mi furgo', '2023', 'invisible', '1');
 INSERT INTO vans_details(`marca`, `año_matriculacion`, `color`, `numero_plazas`) VALUES (' mi para todos', '2023', 'arcoiris', '100');

 
 DELETE FROM vans_details WHERE id = 17;
 
 CREATE TABLE `vans_db`.`usuarios_db` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `password` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);