-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: blikzofwvrtiwnyvusbm-mysql.services.clever-cloud.com    Database: blikzofwvrtiwnyvusbm
-- ------------------------------------------------------
-- Server version	8.4.2-2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `street_address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `credit_card` varchar(19) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `job_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (6,8,'Ruan','Carvalho','$2y$12$Gd4fNGiztNLjdNCkNgNf2ORqYF94Xbnpy69pM0RngBAZSy5BMJBCW','1ruanscarvalho@gmail.com','8253430302',1,'','','','','',NULL,NULL),(7,8,'Cole','McArthur','$2y$12$omK1OAosKAAUaY6m8KipA.9Vym6gX7C0xAPEbspEZXvuwJoZnRNnq','crobertmcarthur@gmail.com','(780) 223-2345',1,'','','','','',NULL,NULL),(8,8,'Brendan','Spencer','$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG','bp.spence@hotmail.com','(780) 221-2347',1,'','','','','',NULL,NULL),(9,9,'Jewelyn','Canada','$2y$12$0k9nk6corif7VNc5jhdrtul1aeQrMcJ6XExNGxuyDZ4gpzmCIpXu.','jewelyn@gmail.com','(780) 222-2222',1,'','','','','',NULL,NULL),(10,9,'Yiteng','Z.','$2y$12$1wq7A0O6bskarO0dMQOvrus4Wcixx9y3dp3M0hjk/R2LbAI//BBci','yiteng@gmail.com','(825) 111-1234',1,'','','','','',NULL,NULL),(11,10,'Nathan','Humphrey','$2y$12$t0xoAgjUrOu4a5p7nOJHFuOwsDJ4HmTyRY4LLsxai0uVp74kkrRTG','nathan@gmail.com','(780) 111-9876',1,'','','','','',NULL,NULL),(13,1,'Ruan','DangerField','$2y$12$SZfqdlSi.nTzfEsBnTl9iuftUOm/kq.nz7o5iNgspAeALzbibnuhG','ruanscarvalho@gmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(14,1,'Dan','DangerField','$2y$12$0evOSW6456WTvwniSvrAPuKImJKO/2bIuWZv699sMIEtM1iZqgeRK','tanner@gmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(15,1,'Keller','DangerField','$2y$12$v42j2UbBfMX.Iw.REbKaI.lOoiHRy0eGBVyxNWDoQRX8PYWRegfH.','acb@gmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(16,1,'Linda','DangerField','$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG','b@gmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(17,1,'Appel','DangerField','$2y$12$/wjtFJJgbzPlbC2NA3dtG.FGU6s8Jml5S0ZR9ZAObOpJ3WbiHvELK','g@gmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(18,1,'RuanG','DangerField','$2y$12$YLvYwDRpj3tfkZaVbtZdpOhES5XVbdv6CCHoyV1X6FUga.Tp3xJEG','1bp.spence@hotmail.com','1-999-999-9999',0,'','','','','',NULL,NULL),(19,12,'Richard','Robert','$2y$12$39B/Xdu.sxnTTLWIEjHbKuqGAvvlEFyXj1PgxyKU75gYOcETijone','r.robert@gmal.com','1-222-222-2222',1,'','','','','',NULL,NULL),(22,1,'Walkin','Joe','$2y$12$LDpUtKKkadbrJqJV3ygUnewF/Bne7pvkBx2UyrWOEglFeiN30o3Zi','J.walkin@a.com','111-111-1111',0,'','','','','',NULL,NULL),(23,1,'Running','Dans','$2y$12$U/34NPVowLN8GH.sf4eSsebQZcpqJzPYzB8b6.7nxF60uGYJDKzPG','Drunning@a.com','111-111-1111',0,'','','','','',NULL,NULL),(24,1,'hacker','one','$2y$12$DSG6Dh8IEAXXaGjbYjDA0.8lhC8U0aRtnwiOU0cn.QDka/uYU3V.K','admin@hacks.com','1111111111',0,'','','','','',NULL,NULL),(25,1,'John','Doe','$2y$12$LUQ5cUlbTqqSFHaPUvtp7e8SbXwVT.KiNSckCepXxvyN5q243DuSm','test860@example.com',NULL,1,'','','','','',NULL,NULL),(26,1,'Updated Jester','Updated Long','$2y$12$jLwspj7DB8LsF7MCtbtV3uJlEeBoFJjLMwP9racGayoenB.yH0zie','test336@example.com','234-234-2344',1,'','','','','',NULL,NULL),(27,NULL,NULL,NULL,'$2y$12$1aVFtauRmv1ym9WbEm6TNegaw.TTTWtY7ACFvYyk6DX5zoTQpXCKy','rfeest@example.com',NULL,NULL,'','','','','',NULL,NULL),(28,1,'Walkin','Cust','$2y$12$eTm3WSu8CnofmneoI28AjevBIXhT80m6jOzlrdd4TOzbqH254sCXa','w.cust@gmail.com','111-111-1111',0,'','','','','',NULL,NULL),(29,1,'John','Doe','$2y$12$TzoHMKMYaQdHGF0h.h0Ksu1mvQUtXJP9TsV0CQWi1fRFnB5ewQi6i','test433@example.com',NULL,1,'','','','','',NULL,NULL),(30,1,'Updated Jester','Updated Long','$2y$12$DWfivRse4v7ZakgCEuQKHeshFUG8S.f90DYwwbEhbPO/3Q2ifiNNy','test641@example.com','234-234-2344',1,'','','','','',NULL,NULL),(31,NULL,NULL,NULL,'$2y$12$vdQdcpTefTtYmgZcX0b4A.VMkYy.r8bF/XzkMvQZT9RZcEf.gZbHq','brandi46@example.net',NULL,NULL,'','','','','',NULL,NULL),(32,NULL,NULL,NULL,'$2y$12$tDES1e/pXRdwBZlOC.epDeWWlClODw08H9D5VHH1V6hDxBRcg.ClC','sienna.waelchi@example.net',NULL,NULL,'','','','','',NULL,NULL),(33,NULL,NULL,NULL,'$2y$12$Bom5MPpUrA2nCFmMHIWLceCX1ArM5WnvKRLIFzuw3b7/Tt4J/VuRm','tina.frami@example.org',NULL,NULL,'','','','','',NULL,NULL),(34,NULL,NULL,NULL,'$2y$12$BToKjwOUy.S.vQ6wGXIXeuXzjJUxd6ReoDrF2EgONA7EhZpZqKbPu','claudia49@example.org',NULL,NULL,'','','','','',NULL,NULL),(35,NULL,NULL,NULL,'$2y$12$1NPSk.IOQjlzNUt0BnzctOeXkDOEAvXyKOiDMGQak93dugsH0iGzu','holly.kuhn@example.net',NULL,NULL,'','','','','',NULL,NULL),(36,NULL,NULL,NULL,'$2y$12$eXQhOBT29tYlpCbsVTEXkeB3J7iYLn6Y1kCqJAolKNwbxDVNsName','vpacocha@example.com',NULL,NULL,'','','','','',NULL,NULL),(37,NULL,NULL,NULL,'$2y$12$EQmftVmgGGV8Y1jY0cBQEeFlxs3yQ9j78qpTIoyVrZCbgo0911RMG','ykuhn@example.com',NULL,NULL,'','','','','',NULL,NULL),(38,NULL,NULL,NULL,'$2y$12$wF6y4r6KDcNNksl6Wl5Og.Lsj/gLLSRHpWKSctPnMw7.rd16O8XZi','dstoltenberg@example.org',NULL,NULL,'','','','','',NULL,NULL),(39,NULL,NULL,NULL,'$2y$12$tF8eb0QbpUFb55EuZWn7tuBV57tmy73OciiSa.dKxROKNqKcsB8Pq','salvador50@example.org',NULL,NULL,'','','','','',NULL,NULL),(40,1,'John','Doe','$2y$12$sHCTrPP8Nm1gktTzT.zSxuFFAFPlY.kAV54SEakSe5SJ8fVlv7rfy','test650@example.com',NULL,1,'','','','','',NULL,NULL),(41,1,'Updated Jester','Updated Long','$2y$12$wWnPCYMxC.MlpSXY4Foai.n/r0gwyPhGSbxuJFSrwRthzUPjrkYsO','test838@example.com','234-234-2344',1,'','','','','',NULL,NULL),(42,NULL,NULL,NULL,'$2y$12$f2bH5hl/9g.Onxi5RfAznO1Gl5bzNDbRtH107Ax2CYf3FPuceX1/a','rebeka.rutherford@example.org',NULL,NULL,'','','','','',NULL,NULL),(43,1,'John','Smith','$2y$12$hZ0dZPVmxAc8F/FAVI/cgu2UvEc0Dw/Rr8mEhx7EJOBRAGyPpWsO2','johnsmith@example.com','7801234567',0,'','','','','',NULL,NULL),(55,NULL,'Bryce','Fisher',NULL,'s@gmail.com','5879742435',1,'8938 83 Avenue Northwest','Edmonton','AB','T6C 1B5','Canada','',NULL),(56,NULL,'','',NULL,'','',1,'','','','','','',NULL),(57,NULL,'Ruan','Carvalho',NULL,'1ruanscarvalho@gmail.com','8253430302',1,'','','','','','',NULL),(58,NULL,'','',NULL,'','',1,'','','','','','',NULL),(59,NULL,'Ruan','Carvalho',NULL,'1ruanscarvalho@gmail.com','8253430302',1,'','','','','','',NULL),(60,NULL,'Bryce','Fisher',NULL,'s@gmail.com','5879742435',1,'8938 83 Avenue Northwest','Edmonton','AB','T6C 1B5','Canada','',NULL),(61,NULL,'Bryce','Fisher',NULL,'s@gmail.com','5879742435',1,'8938 83 Avenue Northwest','Edmonton','AB','T6C 1B5','Canada','',NULL),(62,NULL,'Bryce','Fisher',NULL,'bfisher20@nait.ca','7777777894',1,'9137 83 avenue','Edmonton','Alberta','t6c1b6','CA','',NULL),(63,NULL,'bryce','f',NULL,'b@gmail.com','5875011111',1,'11  went','Edmonotn','a','t6c1b6','ca','',NULL),(64,NULL,'','',NULL,'','',1,'','','','','','',NULL),(65,NULL,'Bryce','Fisher',NULL,'bfisher20@nait.ca','7778887894',1,'9137 83 avenue','Edmonton','Alberta','t6c1b6','CA','',NULL),(66,NULL,'','',NULL,'','',1,'','','','','','',NULL),(67,NULL,'','',NULL,'','',1,'','','','','','',NULL),(68,NULL,'','',NULL,'','',1,'','','','','','',NULL),(69,NULL,'Ruan','Carvalho',NULL,'1ruanscarvalho@gmail.com','8253430302',1,'','','','','','',NULL),(71,NULL,'Test','User',NULL,'test@example.com','1234567890',1,'123 Main St','Testville','AB','T3X 0B3','Canada','4242424242424242',NULL),(73,NULL,'Test','User',NULL,'test@example.com','1234567890',1,'123 Main St','Testville','AB','T3X 0B3','Canada','4242424242424242',NULL),(74,NULL,'','',NULL,'','',1,'','','','','','',NULL),(75,NULL,'','',NULL,'','',1,'','','','','','',NULL),(76,NULL,'','',NULL,'','',1,'','','','','','',NULL),(77,NULL,'','',NULL,'','',1,'','','','','','',NULL),(78,NULL,'Bryce','Fisher',NULL,'bfisher20@nait.ca','8253430302',1,'9137 83 avenue','Edmonton','Alberta','t6c1b6','CA','',NULL),(80,NULL,'Bryce','Fisher',NULL,'s@gmail.com','5879742435',1,'8938 83 Avenue Northwest','Edmonton','AB','T6C 1B5','Canada','',NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG','admin@gmail.com');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytes`
--

DROP TABLE IF EXISTS `analytes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytes` (
  `analyte_id` int NOT NULL AUTO_INCREMENT,
  `analyte_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cas_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytes`
--

LOCK TABLES `analytes` WRITE;
/*!40000 ALTER TABLE `analytes` DISABLE KEYS */;
INSERT INTO `analytes` VALUES (27,'Algae enumeration','123-123',1),(28,'Allergen','22-88-654',1),(29,'Asbestos','1332-21-4',1),(30,'Fly/Coal Ash','331-7446',1),(31,'Test Analyte','123-4567',1),(32,'Test Analyte','123-4567',1),(33,'Test Analyte','123-4567',1),(34,'Test Analyte','123-4567',1);
/*!40000 ALTER TABLE `analytes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `analyte_id` int DEFAULT NULL,
  `category_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `technique` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `analyte_id` (`analyte_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`analyte_id`) REFERENCES `analytes` (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (3,NULL,NULL,NULL,NULL),(9,27,'Other\r\n','Light Microscopy\r\n',1),(10,28,'Allergens\r\n','MARIA, ELISA\r\n',1),(11,29,'Asbestos\r\n','PCM\r\n',1),(12,29,'Asbestos','TEM\r\n',1),(13,30,'Other\r\n','PLM/TEM\r\n',1),(14,NULL,'Test Category','Test Technique',NULL),(15,NULL,'Test Category','Test Technique',NULL),(16,NULL,'Test Category','Test Technique',NULL),(17,NULL,'Test Category','Test Technique',1),(18,NULL,'Test Category','Test Technique',1),(19,NULL,'Test Category','Test Technique',1),(20,27,'Test Category','Test Technique',1),(21,NULL,'Test Category','Test Technique',1),(22,27,'Test Category','Test Technique',1),(23,NULL,'Test Category','Test Technique',1),(24,27,'Test Category','Test Technique',1),(25,NULL,'Test Category','Test Technique',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Walking Customer','','18949 111 Ave NW, Edmonton AB T5S 2X4 ',1),(8,'PBR Laboratories Inc','(780) 450-3957','9960 67 Ave NW',1),(9,'Bureau Veritas','780) 577-7100','4326 76 Ave NW, Edmonton, AB T6B 2T8',1),(10,'DynaLIFE Medical Labs','(780) 451-3702','200 10150 102 Street, Edmonton, AB T5J 5E2',1),(11,'Biogeochemical Analytical Service Laboratory','(780) 492-5497','2-255, Edmonton, AB T6G 2H7',1),(12,'MacDonalds','1-780-333-1231','123 Suryp St Edmonton Alberta f1f-2f1',1),(13,'Test Company','123456789','123 Test St',1),(14,'Updated Company','555555555','789 Updated St',0),(15,'Test Company','123456789','123 Test St',1),(16,'Updated Company','555555555','789 Updated St',0),(17,'Test Company','123456789','123 Test St',1),(18,'Updated Company','555555555','789 Updated St',0);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `specsheet` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `daily_cost` float NOT NULL,
  `available_quantity` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `type_id` int DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'Zefon Escort Elf Pump',NULL,'Zefron-Escort-Elf-Pump.jpg',NULL,50,10,1,1),(2,'SKC Aircheck XR5000',NULL,'SKC-Aircheck-XR5000.jpg',NULL,50,6,1,2),(3,'Gilair3',NULL,'gilian-gilair-3.webp',NULL,50,9,1,2),(4,'SKC Pocket Pump (210-1000 Series)',NULL,'SKC-Pocket-Pump.jpeg',NULL,50,3,1,1),(5,'Zefon Diaphragm Pump',NULL,'Zefon-Diaphragm-Pump.jpg',NULL,50,14,1,2);
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment_attributes`
--

DROP TABLE IF EXISTS `equipment_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_attributes` (
  `attribute_id` int NOT NULL AUTO_INCREMENT,
  `equipment_type_id` int NOT NULL,
  `attribute_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `attribute_data_type` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  KEY `fk_equipment_type_id` (`equipment_type_id`) USING BTREE,
  CONSTRAINT `fk_equipment_type_id` FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_types` (`equipment_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment_attributes`
--

LOCK TABLES `equipment_attributes` WRITE;
/*!40000 ALTER TABLE `equipment_attributes` DISABLE KEYS */;
INSERT INTO `equipment_attributes` VALUES (1,1,'Flow Rate','string'),(2,1,'Low Flow Adapter','string');
/*!40000 ALTER TABLE `equipment_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment_details`
--

DROP TABLE IF EXISTS `equipment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_details` (
  `serial_number` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `equipment_id` int NOT NULL,
  `status` enum('available','rented','maintenance','retired') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'available',
  `serial_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`serial_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `equipment_details_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment_details`
--

LOCK TABLES `equipment_details` WRITE;
/*!40000 ALTER TABLE `equipment_details` DISABLE KEYS */;
INSERT INTO `equipment_details` VALUES ('ZEF-1001',1,'rented',1),('ZEF-1002',1,'rented',2),('ZEF-1003',1,'rented',3),('ZEF-1004',1,'rented',4),('ZEF-1005',1,'rented',5),('ZEF-1006',1,'rented',6),('ZEF-1007',1,'rented',7),('ZEF-1008',1,'rented',8),('ZEF-1009',1,'rented',9),('ZEF-1010',1,'rented',10),('SKC-2001',2,'rented',11),('SKC-2002',2,'rented',12),('SKC-2003',2,'rented',13),('SKC-2004',2,'rented',14),('SKC-2005',2,'rented',15),('SKC-2006',2,'rented',16),('GIL-3001',3,'rented',17),('GIL-3002',3,'rented',18),('GIL-3003',3,'rented',19),('GIL-3004',3,'rented',20),('GIL-3005',3,'rented',21),('GIL-3006',3,'rented',22),('GIL-3007',3,'available',23),('GIL-3008',3,'available',24),('GIL-3009',3,'available',25),('SKC-4001',4,'rented',26),('SKC-4002',4,'rented',27),('SKC-4003',4,'available',28),('ZDP-5001',5,'available',29),('ZDP-5002',5,'available',30),('ZDP-5003',5,'available',31),('ZDP-5004',5,'available',32),('ZDP-5005',5,'available',33),('ZDP-5006',5,'available',34),('ZDP-5007',5,'available',35),('ZDP-5008',5,'available',36),('ZDP-5009',5,'available',37),('ZDP-5010',5,'available',38),('ZDP-5011',5,'available',39),('ZDP-5012',5,'available',40),('ZDP-5013',5,'available',41),('ZDP-5014',5,'available',42);
/*!40000 ALTER TABLE `equipment_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment_types`
--

DROP TABLE IF EXISTS `equipment_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_types` (
  `equipment_type_id` int NOT NULL AUTO_INCREMENT,
  `equipment_type_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`equipment_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment_types`
--

LOCK TABLES `equipment_types` WRITE;
/*!40000 ALTER TABLE `equipment_types` DISABLE KEYS */;
INSERT INTO `equipment_types` VALUES (1,'Pump'),(2,'Calibrator'),(3,'Cyclone'),(4,'Sample Holder'),(5,'Tubing');
/*!40000 ALTER TABLE `equipment_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment_values`
--

DROP TABLE IF EXISTS `equipment_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_values` (
  `equipment_id` int NOT NULL,
  `attribute_id` int NOT NULL,
  `attribute_value` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `fk_attribute_id` (`attribute_id`),
  KEY `fk_equipment_id` (`equipment_id`),
  CONSTRAINT `equipment_values_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  CONSTRAINT `fk_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `equipment_attributes` (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment_values`
--

LOCK TABLES `equipment_values` WRITE;
/*!40000 ALTER TABLE `equipment_values` DISABLE KEYS */;
INSERT INTO `equipment_values` VALUES (1,1,'0.5 - 3.0 L/min'),(1,2,'Available'),(2,1,'1.0 - 5.0 L/min'),(2,2,'Available'),(3,1,'0.5 - 3.0 L/min'),(3,2,'Available'),(4,1,'0.02 - 0.225 L/min'),(4,2,NULL),(5,1,'3.0 - 14 L/min'),(5,2,NULL);
/*!40000 ALTER TABLE `equipment_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_execution_log`
--

DROP TABLE IF EXISTS `event_execution_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_execution_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `execution_time` datetime DEFAULT NULL,
  `rows_deleted` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_execution_log`
--

LOCK TABLES `event_execution_log` WRITE;
/*!40000 ALTER TABLE `event_execution_log` DISABLE KEYS */;
INSERT INTO `event_execution_log` VALUES (1,'DeleteExpiredTokensEvent','2024-04-03 15:37:32',NULL),(2,'DeleteExpiredTokensEvent','2024-04-03 15:38:32',NULL),(3,'DeleteExpiredTokensEvent','2024-04-03 15:41:32',0),(4,'DeleteExpiredTokensEvent','2024-04-03 15:42:32',0),(5,'DeleteExpiredTokensEvent','2024-04-03 15:43:32',1),(6,'DeleteExpiredTokensEvent','2024-04-03 15:44:32',0),(7,'DeleteExpiredTokensEvent','2024-04-03 15:45:32',0),(8,'DeleteExpiredTokensEvent','2024-04-03 15:46:32',0),(9,'DeleteExpiredTokensEvent','2024-04-03 15:46:58',0),(10,'DeleteExpiredTokensEvent','2024-04-03 15:46:59',0),(11,'DeleteExpiredTokensEvent','2024-04-03 15:47:00',0),(12,'DeleteExpiredTokensEvent','2024-04-03 15:47:01',0),(13,'DeleteExpiredTokensEvent','2024-04-03 15:47:02',0),(14,'DeleteExpiredTokensEvent','2024-04-03 15:47:03',0),(15,'DeleteExpiredTokensEvent','2024-04-03 15:47:04',0),(16,'DeleteExpiredTokensEvent','2024-04-03 15:47:05',0),(17,'DeleteExpiredTokensEvent','2024-04-03 15:47:06',0),(18,'DeleteExpiredTokensEvent','2024-04-03 15:47:07',0),(19,'DeleteExpiredTokensEvent','2024-04-03 15:47:08',0),(20,'DeleteExpiredTokensEvent','2024-04-03 15:47:09',0),(21,'DeleteExpiredTokensEvent','2024-04-03 15:47:10',0),(22,'DeleteExpiredTokensEvent','2024-04-03 15:47:11',0),(23,'DeleteExpiredTokensEvent','2024-04-03 15:47:12',0),(24,'DeleteExpiredTokensEvent','2024-04-03 15:47:13',0),(25,'DeleteExpiredTokensEvent','2024-04-03 15:47:14',0),(26,'DeleteExpiredTokensEvent','2024-04-03 15:47:15',0),(27,'DeleteExpiredTokensEvent','2024-04-03 15:47:16',0),(28,'DeleteExpiredTokensEvent','2024-04-03 15:47:17',0),(29,'DeleteExpiredTokensEvent','2024-04-03 15:47:18',0),(30,'DeleteExpiredTokensEvent','2024-04-03 15:47:19',0),(31,'DeleteExpiredTokensEvent','2024-04-03 15:47:20',0),(32,'DeleteExpiredTokensEvent','2024-04-03 15:47:21',0),(33,'DeleteExpiredTokensEvent','2024-04-03 15:47:22',0),(34,'DeleteExpiredTokensEvent','2024-04-03 15:47:23',0),(35,'DeleteExpiredTokensEvent','2024-04-03 15:47:24',0),(36,'DeleteExpiredTokensEvent','2024-04-03 15:47:25',0),(37,'DeleteExpiredTokensEvent','2024-04-03 15:47:26',0),(38,'DeleteExpiredTokensEvent','2024-04-03 15:47:27',0),(39,'DeleteExpiredTokensEvent','2024-04-03 15:47:28',0),(40,'DeleteExpiredTokensEvent','2024-04-03 15:47:29',0),(41,'DeleteExpiredTokensEvent','2024-04-03 15:47:30',0),(42,'DeleteExpiredTokensEvent','2024-04-03 15:47:31',0),(43,'DeleteExpiredTokensEvent','2025-06-28 03:33:00',19);
/*!40000 ALTER TABLE `event_execution_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `feedback_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`feedback_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methods`
--

DROP TABLE IF EXISTS `methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methods` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `analyte_id` int DEFAULT NULL,
  `method_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `matrix` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `media` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `measurement` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sample_rate` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `limit_of_quantification` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `general_comments` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`method_id`),
  KEY `analyte_id` (`analyte_id`),
  CONSTRAINT `methods_ibfk_1` FOREIGN KEY (`analyte_id`) REFERENCES `analytes` (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methods`
--

LOCK TABLES `methods` WRITE;
/*!40000 ALTER TABLE `methods` DISABLE KEYS */;
INSERT INTO `methods` VALUES (13,27,'Algae Enumeration In Water','Water','Bottle','10 - 100 mL','N/A','4 organisms per ml',NULL,1),(14,28,'Cat, Fel d1 (sub-contracted)','Dust','Cassette','>50 mg','>2 min. (vacuum)','0.02-0.8 ng/ml',NULL,1),(15,28,'Cockroach, Bla g2 (sub-contracted)','Dust','Cassette','>50 mg','>2 min. (vacuum)','0.98-2 ng/ml',NULL,1),(16,28,'Dog, Can f1 (sub-contracted)','Dust','Cassette','>50 mg','>2 min. (vacuum)','0.06-2 ng/ml',NULL,1),(17,29,'OSHA ID-160','Air','Cassette','<50 to >2000 L','0.5-16.0 LPM','Volume Dependent',NULL,1),(18,29,'OSHA with TWA','Air','Cassette','<50 to >2000 L','0.5-16.0 LPM','Volume Dependent',NULL,1),(19,29,'AHERA (40 CFR Part 763)','Air','Cassette','600-1800 L, Ideally >1200 L','<10.0 LPM','Volume Dependent',NULL,1),(20,30,'MACP','Bulk','N/A','>1.0 g','N/A','1%',NULL,1),(21,30,'MACP','Bulk','N/A','>1.0 g','N/A','1%',NULL,1),(22,27,'Lead in Air','Water','Workplace Air','Test','1','0.0pq','test',1),(23,27,'Niosh','Soil','Cassette','1kg','1','0.0pq',NULL,1),(24,27,'Test Method','Test Matrix','Test Media','Test Measurement','Test Sample Rate','Test Limit of Quantification','Test General Comments',1),(25,27,'Test Method','Test Matrix','Test Media','Test Measurement','Test Sample Rate','Test Limit of Quantification','Test General Comments',1),(26,27,'Test Method','Test Matrix','Test Media','Test Measurement','Test Sample Rate','Test Limit of Quantification','Test General Comments',1),(27,27,'Test Method',NULL,NULL,NULL,NULL,NULL,NULL,1),(28,27,'Test Method','Test Matrix','Test Media','Test Measurement','Test Sample Rate','Test Limit of Quantification','Test General Comments',1);
/*!40000 ALTER TABLE `methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2019_12_14_000001_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `turn_around_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `quantity_pumps` int DEFAULT NULL,
  `quantity_media` int DEFAULT NULL,
  `comments` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `fk_turn_around_id` (`turn_around_id`),
  KEY `fk_order_id` (`order_id`),
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_turn_around_id` FOREIGN KEY (`turn_around_id`) REFERENCES `turn_around_times` (`turn_around_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (13,1,200,1,0,0,NULL),(13,2,200,6,0,0,NULL),(13,2,200,3,0,0,NULL),(13,2,200,5,0,0,NULL),(13,2,200,1,3,3,NULL),(20,3,160,5,1,1,NULL),(13,4,200,1,0,0,NULL),(26,5,250,1,0,0,NULL),(26,6,250,1,0,0,NULL),(25,6,200,1,0,0,NULL),(26,7,250,1,0,0,NULL),(25,7,200,1,0,0,NULL),(26,8,250,1,0,0,NULL),(25,8,200,1,0,0,NULL),(26,9,250,1,0,0,NULL),(25,9,200,1,0,0,NULL),(25,10,200,1,0,0,NULL),(25,11,200,1,0,0,NULL),(25,13,200,1,0,0,NULL),(25,14,200,1,0,0,NULL),(25,15,200,1,0,0,NULL),(26,16,250,1,0,0,NULL),(26,17,250,1,0,0,NULL),(25,18,200,1,0,0,NULL),(25,19,200,1,0,0,NULL),(25,20,200,1,0,0,NULL),(25,21,200,1,0,0,NULL),(25,22,200,1,0,0,NULL),(25,23,200,1,0,0,NULL),(25,24,200,1,0,0,NULL),(25,25,200,1,0,0,NULL),(25,26,200,1,0,0,NULL),(13,26,200,1,0,0,NULL),(25,27,200,1,0,0,NULL),(13,27,200,1,0,0,NULL),(25,28,200,1,0,0,NULL),(13,28,200,1,0,0,NULL),(25,29,200,1,0,0,NULL),(25,30,200,1,0,0,NULL),(25,31,200,1,0,0,NULL),(25,32,200,1,0,0,NULL),(13,33,200,1,0,0,NULL),(13,34,200,1,0,0,NULL),(13,35,200,1,0,0,NULL),(25,36,200,1,0,0,NULL),(25,37,200,1,0,0,NULL),(25,38,200,1,0,0,NULL),(25,39,200,1,0,0,NULL),(25,40,200,1,0,0,NULL),(25,41,200,1,0,0,NULL),(25,42,200,1,0,0,NULL),(13,43,200,1,0,0,NULL),(25,44,200,1,0,0,NULL),(25,45,200,1,0,0,NULL),(25,46,200,1,0,0,NULL),(25,47,200,1,0,0,NULL),(25,48,200,1,0,0,NULL),(13,49,200,1,0,0,NULL),(13,50,200,1,0,0,NULL),(13,51,200,1,0,0,NULL),(25,52,200,1,0,0,NULL),(25,53,200,1,0,0,NULL),(25,54,200,1,0,0,NULL),(13,55,200,1,0,0,NULL),(13,56,200,1,0,0,NULL),(13,57,200,1,0,0,NULL),(13,58,200,1,0,0,NULL),(13,59,200,1,0,0,NULL),(13,60,200,1,0,0,NULL),(13,61,200,1,0,0,NULL),(13,62,200,1,0,0,NULL),(13,63,200,1,0,0,NULL),(13,64,200,1,0,0,NULL),(13,65,200,1,0,0,NULL),(13,66,200,1,0,0,NULL),(13,67,200,1,0,0,NULL),(13,68,200,1,0,0,NULL),(13,69,200,1,0,0,NULL),(13,70,200,1,0,0,NULL),(13,71,200,1,0,0,NULL),(13,72,200,1,0,0,NULL),(13,73,200,1,0,0,NULL),(13,74,200,1,0,0,NULL),(13,75,200,1,0,0,NULL),(13,76,200,1,0,0,NULL),(13,77,200,1,0,0,NULL),(13,78,200,1,0,0,NULL),(13,79,200,1,0,0,NULL),(13,80,200,1,0,0,NULL),(13,81,200,1,0,0,NULL),(13,82,200,1,0,0,NULL),(25,83,200,1,0,0,NULL),(25,84,200,1,0,0,NULL),(25,85,200,1,0,0,NULL),(25,86,200,1,0,0,NULL),(13,87,100,1,0,0,NULL),(13,88,100,1,0,0,NULL),(13,91,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,96,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,97,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,98,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,99,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,102,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,103,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,104,200,1,0,0,NULL),(13,104,200,1,0,0,NULL),(13,104,200,1,0,0,NULL),(13,104,200,1,0,0,NULL),(13,105,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,106,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,107,12.5,1,1,1,'test.'),(13,108,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,109,12.5,1,1,1,'test.'),(13,110,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,111,12.5,1,1,1,'test.'),(13,112,12.5,1,1,1,'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),(13,113,12.5,1,1,1,'test.'),(13,114,200,1,1,1,NULL),(13,115,200,1,1,1,NULL),(13,116,200,1,1,1,NULL);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `subtotal` float DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2024-04-05 00:00:00',200,1),(2,1,'2024-04-05 00:00:00',3000,1),(3,1,'2024-04-05 00:00:00',800,1),(4,1,'2024-04-09 00:00:00',200,1),(5,1,'2024-04-09 00:00:00',250,1),(6,1,'2024-04-09 00:00:00',450,1),(7,1,'2024-04-09 00:00:00',450,1),(8,1,'2024-04-09 00:00:00',450,1),(9,1,'2024-04-09 00:00:00',450,1),(10,1,'2024-04-09 00:00:00',200,1),(11,1,'2024-04-09 00:00:00',200,1),(13,1,'2024-04-09 00:00:00',200,1),(14,1,'2024-04-09 00:00:00',200,1),(15,1,'2024-04-09 00:00:00',200,1),(16,1,'2024-04-09 00:00:00',250,1),(17,1,'2024-04-09 00:00:00',250,1),(18,1,'2024-04-09 00:00:00',200,1),(19,1,'2024-04-09 00:00:00',200,1),(20,1,'2024-04-09 00:00:00',200,1),(21,1,'2024-04-10 00:00:00',200,1),(22,1,'2024-04-10 00:00:00',200,1),(23,1,'2024-04-10 00:00:00',200,1),(24,1,'2024-04-10 00:00:00',200,1),(25,1,'2024-04-10 00:00:00',200,1),(26,1,'2024-04-10 00:00:00',400,1),(27,1,'2024-04-10 00:00:00',400,1),(28,1,'2024-04-10 00:00:00',400,1),(29,1,'2024-04-10 00:00:00',200,1),(30,1,'2024-04-10 00:00:00',200,1),(31,1,'2024-04-10 00:00:00',200,1),(32,1,'2024-04-10 00:00:00',200,1),(33,1,'2024-04-10 00:00:00',200,1),(34,1,'2024-04-10 00:00:00',200,1),(35,1,'2024-04-10 00:00:00',200,1),(36,1,'2024-04-09 00:00:00',200,1),(37,1,'2024-04-10 00:00:00',200,1),(38,1,'2024-04-10 00:00:00',200,1),(39,1,'2024-04-10 00:00:00',200,1),(40,1,'2024-04-10 00:00:00',200,1),(41,1,'2024-04-10 00:00:00',200,1),(42,1,'2024-04-10 00:00:00',200,1),(43,1,'2024-04-10 00:00:00',200,1),(44,1,'2024-04-10 00:00:00',200,1),(45,1,'2024-04-10 00:00:00',200,1),(46,1,'2024-04-10 00:00:00',200,1),(47,1,'2024-04-10 00:00:00',200,1),(48,1,'2024-04-10 00:00:00',200,1),(49,1,'2024-04-10 00:00:00',200,1),(50,1,'2024-04-10 00:00:00',200,1),(51,1,'2024-04-10 00:00:00',200,1),(52,1,'2024-04-10 00:00:00',200,1),(53,1,'2024-04-10 00:00:00',200,1),(54,1,'2024-04-10 00:00:00',200,1),(55,1,'2024-04-10 00:00:00',200,1),(56,1,'2024-04-10 00:00:00',200,1),(57,1,'2024-04-10 00:00:00',200,1),(58,1,'2024-04-10 00:00:00',200,1),(59,1,'2024-04-10 00:00:00',200,1),(60,1,'2024-04-10 00:00:00',200,1),(61,1,'2024-04-10 00:00:00',200,1),(62,1,'2024-04-10 00:00:00',200,1),(63,1,'2024-04-10 00:00:00',200,1),(64,1,'2024-04-10 00:00:00',200,1),(65,1,'2024-04-10 00:00:00',200,1),(66,1,'2024-04-10 00:00:00',200,1),(67,1,'2024-04-10 00:00:00',200,1),(68,1,'2024-04-10 00:00:00',200,1),(69,1,'2024-04-10 00:00:00',200,1),(70,1,'2024-04-10 00:00:00',200,1),(71,1,'2024-04-10 00:00:00',200,1),(72,1,'2024-04-10 00:00:00',200,1),(73,1,'2024-04-10 00:00:00',200,1),(74,1,'2024-04-10 00:00:00',200,1),(75,1,'2024-04-10 00:00:00',200,1),(76,1,'2024-04-10 00:00:00',200,1),(77,1,'2024-04-10 00:00:00',200,1),(78,1,'2024-04-10 00:00:00',200,1),(79,1,'2024-04-10 00:00:00',200,1),(80,1,'2024-04-10 00:00:00',200,1),(81,1,'2024-04-10 00:00:00',0,1),(82,1,'2024-04-10 00:00:00',0,1),(83,1,'2024-04-09 00:00:00',200,1),(84,1,'2024-04-09 00:00:00',200,1),(85,1,'2024-04-09 00:00:00',200,1),(86,1,'2024-04-09 00:00:00',200,1),(87,1,'2024-04-10 00:00:00',100,1),(88,1,'2024-04-10 00:00:00',100,1),(91,1,'2024-03-15 00:00:00',85,1),(96,1,'2024-03-15 00:00:00',85,1),(97,1,'2024-03-15 00:00:00',85,1),(98,1,'2024-03-15 00:00:00',85,1),(99,1,'2024-03-15 00:00:00',85,1),(102,1,'2024-03-15 00:00:00',85,1),(103,1,'2024-03-15 00:00:00',85,1),(104,1,'2024-04-12 00:00:00',800,1),(105,1,'2024-03-15 00:00:00',85,1),(106,1,'2024-03-15 00:00:00',85,1),(107,1,'2024-03-15 00:00:00',85,1),(108,1,'2024-03-15 00:00:00',85,1),(109,1,'2024-03-15 00:00:00',85,1),(110,1,'2024-03-15 00:00:00',85,1),(111,1,'2024-03-15 00:00:00',85,1),(112,1,'2024-03-15 00:00:00',85,1),(113,1,'2024-03-15 00:00:00',85,1),(114,1,'2025-02-13 00:00:00',200,1),(115,1,'2025-02-13 00:00:00',200,1),(116,1,'2025-02-21 00:00:00',200,1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'credit card',
  `payment_status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `transaction_reference` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `card_holder_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `card_last_four` char(4) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `card_expiry_month` char(2) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `card_expiry_year` char(4) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,10,'credit_card','pending',NULL,52.50,'2025-04-10 06:34:49','2025-04-10 06:34:49','N/A','','','',NULL),(2,11,'credit_card','pending',NULL,52.50,'2025-04-10 06:50:09','2025-04-10 06:50:09','N/A','','','',NULL),(3,12,'credit_card','pending',NULL,52.50,'2025-04-10 07:12:11','2025-04-10 07:12:11','N/A','','','',NULL),(4,13,'credit_card','pending',NULL,52.50,'2025-04-10 18:46:39','2025-04-10 18:46:39','N/A','','','',NULL),(5,14,'credit_card','pending',NULL,52.50,'2025-04-10 19:24:10','2025-04-10 19:24:10','N/A','','','',NULL),(6,15,'credit_card','pending',NULL,52.50,'2025-04-10 20:07:07','2025-04-10 20:07:07','N/A','','','',NULL),(7,16,'credit_card','pending',NULL,52.50,'2025-04-10 20:15:03','2025-04-10 20:15:03','N/A','','','',NULL),(8,17,'credit_card','pending',NULL,52.50,'2025-04-11 19:47:45','2025-04-11 19:47:45','N/A','','','',NULL),(9,18,'credit_card','pending',NULL,52.50,'2025-04-11 20:43:44','2025-04-11 20:43:44','N/A','','','',NULL),(10,19,'credit_card','pending',NULL,52.50,'2025-04-12 20:45:47','2025-04-12 20:45:47','N/A','','','',NULL),(11,20,'credit_card','pending',NULL,52.50,'2025-04-12 20:47:12','2025-04-12 20:47:12','N/A','','','',NULL),(12,21,'credit_card','pending',NULL,52.50,'2025-04-12 21:26:31','2025-04-12 21:26:31','N/A','','','',NULL),(13,22,'credit_card','pending',NULL,157.50,'2025-04-12 21:29:56','2025-04-12 21:29:56','N/A','','','',NULL),(14,23,'credit_card','pending',NULL,52.50,'2025-04-12 21:42:28','2025-04-12 21:42:28','N/A','','','',NULL),(15,24,'credit_card','pending',NULL,52.50,'2025-04-13 01:40:59','2025-04-13 01:40:59','N/A','','','',NULL),(16,26,'credit_card','pending',NULL,105.00,'2025-04-13 01:54:20','2025-04-13 01:54:20','Test User','4242','12','2026',NULL),(17,28,'credit_card','pending',NULL,105.00,'2025-04-13 01:57:41','2025-04-13 01:57:41','Test User','4242','12','2026',NULL),(18,29,'credit_card','pending',NULL,52.50,'2025-04-13 02:20:24','2025-04-13 02:20:24','N/A','','','',NULL),(19,30,'credit_card','pending',NULL,52.50,'2025-04-13 02:34:45','2025-04-13 02:34:45','N/A','','','',NULL),(20,31,'credit_card','pending',NULL,52.50,'2025-04-13 02:39:45','2025-04-13 02:39:45','Guest','','','',NULL),(21,32,'credit_card','pending',NULL,52.50,'2025-04-13 03:17:23','2025-04-13 03:17:23','Guest','','','',NULL),(22,33,'credit_card','pending',NULL,52.50,'2025-04-13 03:42:13','2025-04-13 03:42:13','Ruan Carvalho','','','',NULL),(23,34,'credit_card','pending',NULL,52.50,'2025-04-14 05:23:07','2025-04-14 05:23:07','Ruan Carvalho','','','',NULL),(24,36,'credit_card','pending',NULL,52.50,'2025-04-14 05:50:00','2025-04-14 05:50:00','','','','',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (128,'App\\Models\\Accounts',10,'test-token','0234dcac92a8da12d387225d34ec9b227df7c5484bdc137a648af980404a5709','[\"*\"]',NULL,NULL,'2024-04-24 20:09:54','2024-04-24 20:09:54'),(131,'App\\Models\\Accounts',10,'test-token','e9f77550a9fe3994b16eee38f11b7841b78ac8a98a0ed4801e0cf1647e7cb323','[\"*\"]',NULL,NULL,'2024-04-24 20:11:05','2024-04-24 20:11:05'),(138,'App\\Models\\Accounts',10,'test-token','7b3764b8111801d56c6326338e3125db659a325ea78f932ae31f6cf2ddab64fc','[\"*\"]',NULL,NULL,'2024-04-24 20:13:57','2024-04-24 20:13:57'),(154,'App\\Models\\Accounts',10,'test-token','8efb296f84cd44485d805f009178a0bac4ed060e322672a3e42662e48b7a3f37','[\"*\"]',NULL,NULL,'2024-04-24 20:14:26','2024-04-24 20:14:26'),(263,'App\\Models\\Admin',1,'1_admin_token','f3ac0019dd9abb3fe31ac53c998239750049f8123c78fc74373256035e091288','[\"*\"]','2025-06-28 04:20:56','2025-06-28 05:20:11','2025-06-28 04:20:11','2025-06-28 04:20:56'),(264,'App\\Models\\Admin',1,'1_admin_token','ccb120d4c057d3446eb9429e33c68da9669d5271b06a972ce9d02cfe93c0390e','[\"*\"]','2025-06-28 05:00:01','2025-06-28 05:59:55','2025-06-28 04:59:55','2025-06-28 05:00:01'),(265,'App\\Models\\Admin',1,'1_admin_token','05824d14ca352e64a96baa3b1a211db180a2b0ab078efdd3b3471d846f292659','[\"*\"]','2025-06-28 05:11:54','2025-06-28 06:09:27','2025-06-28 05:09:27','2025-06-28 05:11:54'),(266,'App\\Models\\Admin',1,'1_admin_token','26b83cd8c06f954054f642401c30dfad99723ef6088a49bfb05671578416b16c','[\"*\"]','2025-06-28 05:43:24','2025-06-28 06:42:07','2025-06-28 05:42:07','2025-06-28 05:43:24'),(267,'App\\Models\\Admin',1,'1_admin_token','8332a418ae8b050fa53da8840ca3c98653ce9168be02708e857fd28f2034533c','[\"*\"]','2025-06-28 06:07:31','2025-06-28 07:06:58','2025-06-28 06:06:58','2025-06-28 06:07:31'),(268,'App\\Models\\Admin',1,'1_admin_token','019956e909ceb843bf3165c7a5b801320a8a8a323f9832d32942c33ba873a960','[\"*\"]','2025-06-28 06:55:18','2025-06-28 07:55:05','2025-06-28 06:55:05','2025-06-28 06:55:18'),(269,'App\\Models\\Admin',1,'1_admin_token','fd974545aabab1f5c722f338cbf8e94f96498e22769fb5977a368c23f2bb8cdb','[\"*\"]',NULL,'2025-06-28 07:56:56','2025-06-28 06:56:56','2025-06-28 06:56:56'),(270,'App\\Models\\Admin',1,'1_admin_token','89071dc2aebf395fe29966da95d9b0894a2e0e07b57ed4fd3abf6d8eac6dc529','[\"*\"]','2025-06-28 06:58:25','2025-06-28 07:58:14','2025-06-28 06:58:14','2025-06-28 06:58:25'),(271,'App\\Models\\Admin',1,'1_admin_token','da59780dadea10db9127f5a045b8f19050de2432bfd44d4cc9e881007d9f7f4c','[\"*\"]','2025-06-28 07:40:49','2025-06-28 08:40:11','2025-06-28 07:40:11','2025-06-28 07:40:49'),(272,'App\\Models\\Admin',1,'1_admin_token','d30e5e7248523ce23d9a8204de784d44bdafa206d21f1337761a9a16dc0d8485','[\"*\"]','2025-06-28 07:46:46','2025-06-28 08:44:19','2025-06-28 07:44:19','2025-06-28 07:46:46'),(273,'App\\Models\\Admin',1,'1_admin_token','573433669f372b3e9785fdce681d8405817a5891546d349cbe316b2512f2ef04','[\"*\"]','2025-06-28 16:48:14','2025-06-28 17:47:45','2025-06-28 16:47:46','2025-06-28 16:48:14');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_overrides`
--

DROP TABLE IF EXISTS `price_overrides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price_overrides` (
  `company_id` int DEFAULT NULL,
  `turn_around_id` int DEFAULT NULL,
  `price_override` float DEFAULT NULL,
  KEY `idx_company_id_priceoverrides` (`company_id`),
  KEY `idx_turn_around_id_priceoverrides` (`turn_around_id`),
  CONSTRAINT `price_overrides_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  CONSTRAINT `price_overrides_ibfk_2` FOREIGN KEY (`turn_around_id`) REFERENCES `turn_around_times` (`turn_around_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_overrides`
--

LOCK TABLES `price_overrides` WRITE;
/*!40000 ALTER TABLE `price_overrides` DISABLE KEYS */;
INSERT INTO `price_overrides` VALUES (8,19,100),(8,20,160),(8,21,180),(1,13,100),(1,25,100),(1,26,200);
/*!40000 ALTER TABLE `price_overrides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_details`
--

DROP TABLE IF EXISTS `rental_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_details` (
  `rental_id` int NOT NULL,
  `serial_id` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `quantity` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `equipment_condition` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  KEY `fk_rental_id` (`rental_id`) USING BTREE,
  KEY `serial_id` (`serial_id`),
  CONSTRAINT `rental_details_ibfk_1` FOREIGN KEY (`serial_id`) REFERENCES `equipment_details` (`serial_id`),
  CONSTRAINT `rental_details_ibfk_2` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`rental_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_details`
--

LOCK TABLES `rental_details` WRITE;
/*!40000 ALTER TABLE `rental_details` DISABLE KEYS */;
INSERT INTO `rental_details` VALUES (8,1,'2025-04-10 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(9,2,'2025-04-11 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(10,3,'2025-04-11 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(11,4,'2025-04-11 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(12,5,'2025-04-11 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(13,6,'2025-04-11 00:00:00','2025-04-12 00:00:00',NULL,1,1,'good',50.00),(14,7,'2025-04-11 00:00:00','2025-04-19 00:00:00',NULL,1,1,'good',50.00),(15,8,'2025-04-12 00:00:00','2025-04-13 00:00:00',NULL,1,1,'good',50.00),(16,9,'2025-04-12 00:00:00','2025-04-13 00:00:00',NULL,1,1,'good',50.00),(17,10,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(18,11,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(19,12,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(20,13,'2025-04-18 00:00:00','2025-04-21 00:00:00',NULL,1,1,'good',50.00),(21,14,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(22,15,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(24,16,'2025-04-13 00:00:00','2025-04-14 00:00:00',NULL,1,1,'good',50.00),(26,17,'2025-04-13 00:00:00','2025-04-14 00:00:00',NULL,1,1,'good',50.00),(27,18,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(28,19,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(29,20,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(30,21,'2025-04-15 00:00:00','2025-04-16 00:00:00',NULL,1,1,'good',50.00),(31,22,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(32,26,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00),(34,27,'2025-04-14 00:00:00','2025-04-15 00:00:00',NULL,1,1,'good',50.00);
/*!40000 ALTER TABLE `rental_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rentals`
--

DROP TABLE IF EXISTS `rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentals` (
  `rental_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `rental_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subtotal` float NOT NULL,
  `is_complete` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rental_id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentals`
--

LOCK TABLES `rentals` WRITE;
/*!40000 ALTER TABLE `rentals` DISABLE KEYS */;
INSERT INTO `rentals` VALUES (8,10,'2025-04-10 06:34:43',50,0),(9,11,'2025-04-10 06:50:05',50,0),(10,12,'2025-04-10 07:12:05',50,0),(11,13,'2025-04-10 18:46:33',50,0),(12,14,'2025-04-10 19:24:04',50,0),(13,15,'2025-04-10 20:07:00',50,0),(14,16,'2025-04-10 20:14:56',50,0),(15,17,'2025-04-11 19:47:36',50,0),(16,18,'2025-04-11 20:43:32',50,0),(17,19,'2025-04-12 20:45:41',50,0),(18,20,'2025-04-12 20:47:07',50,0),(19,21,'2025-04-12 21:26:27',50,0),(20,22,'2025-04-12 21:29:53',150,0),(21,23,'2025-04-12 21:42:24',50,0),(22,24,'2025-04-13 01:40:53',50,0),(24,26,'2025-04-12 16:00:00',100,0),(26,28,'2025-04-12 16:00:00',100,0),(27,29,'2025-04-13 02:20:19',50,0),(28,30,'2025-04-13 02:34:38',50,0),(29,31,'2025-04-13 02:39:37',50,0),(30,32,'2025-04-13 03:17:12',50,0),(31,33,'2025-04-13 03:42:00',50,0),(32,34,'2025-04-14 05:23:03',50,0),(34,36,'2025-04-14 05:49:53',50,0);
/*!40000 ALTER TABLE `rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `synonyms`
--

DROP TABLE IF EXISTS `synonyms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `synonyms` (
  `synonym_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `synonym` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`synonym_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `synonyms`
--

LOCK TABLES `synonyms` WRITE;
/*!40000 ALTER TABLE `synonyms` DISABLE KEYS */;
INSERT INTO `synonyms` VALUES (1,12,'Actinolite\r\n'),(2,12,'Amosite\r\n'),(3,12,'Anthophyllite\r\n'),(4,12,'Chrysotile\r\n'),(5,12,'Crocidolite\r\n'),(6,12,'Tremolite\r\n'),(8,9,'Pepsi'),(9,9,'Test'),(10,12,'Test Synonym'),(11,12,'Test Synonym'),(12,14,'Synonym to delete'),(14,17,'Test Synonym'),(15,18,'Test Synonym'),(17,12,'Test Synonym'),(19,12,'Test Synonym'),(21,12,'Test Synonym');
/*!40000 ALTER TABLE `synonyms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gst` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,'2025-04-07 03:34:39',200.00,200.00,0.00,'pending',1),(10,55,'2025-04-10 06:34:49',52.50,50.00,2.50,'pending',1),(11,56,'2025-04-10 06:50:09',52.50,50.00,2.50,'pending',1),(12,57,'2025-04-10 07:12:11',52.50,50.00,2.50,'pending',1),(13,58,'2025-04-10 18:46:39',52.50,50.00,2.50,'pending',1),(14,59,'2025-04-10 19:24:10',52.50,50.00,2.50,'pending',1),(15,60,'2025-04-10 20:07:07',52.50,50.00,2.50,'pending',1),(16,61,'2025-04-10 20:15:03',52.50,50.00,2.50,'pending',1),(17,62,'2025-04-11 19:47:45',52.50,50.00,2.50,'pending',1),(18,63,'2025-04-11 20:43:44',52.50,50.00,2.50,'pending',1),(19,64,'2025-04-12 20:45:47',52.50,50.00,2.50,'pending',1),(20,65,'2025-04-12 20:47:12',52.50,50.00,2.50,'pending',1),(21,66,'2025-04-12 21:26:31',52.50,50.00,2.50,'pending',1),(22,67,'2025-04-12 21:29:56',157.50,150.00,7.50,'pending',1),(23,68,'2025-04-12 21:42:28',52.50,50.00,2.50,'pending',1),(24,69,'2025-04-13 01:40:59',52.50,50.00,2.50,'pending',1),(26,71,'2025-04-13 01:54:20',105.00,100.00,5.00,'pending',1),(28,73,'2025-04-13 01:57:41',105.00,100.00,5.00,'pending',1),(29,74,'2025-04-13 02:20:24',52.50,50.00,2.50,'pending',1),(30,75,'2025-04-13 02:34:45',52.50,50.00,2.50,'pending',1),(31,76,'2025-04-13 02:39:45',52.50,50.00,2.50,'pending',1),(32,77,'2025-04-13 03:17:23',52.50,50.00,2.50,'pending',1),(33,78,'2025-04-13 03:42:13',52.50,50.00,2.50,'pending',1),(34,6,'2025-04-14 05:23:07',52.50,50.00,2.50,'pending',1),(36,80,'2025-04-14 05:50:00',52.50,50.00,2.50,'pending',1);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turn_around_times`
--

DROP TABLE IF EXISTS `turn_around_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turn_around_times` (
  `turn_around_id` int NOT NULL AUTO_INCREMENT,
  `method_id` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `turnaround_time` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_default_price` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`turn_around_id`),
  KEY `idx_method_id_turnaroundtimes` (`method_id`),
  CONSTRAINT `turn_around_times_ibfk_1` FOREIGN KEY (`method_id`) REFERENCES `methods` (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turn_around_times`
--

LOCK TABLES `turn_around_times` WRITE;
/*!40000 ALTER TABLE `turn_around_times` DISABLE KEYS */;
INSERT INTO `turn_around_times` VALUES (13,13,200,'7 Days',1,1),(14,13,250,'5 Days',0,0),(15,13,300,'3 Days',0,0),(16,13,350,'48 Hours',0,0),(17,13,400,'24 Hours',0,0),(18,13,600,'Same Day',0,0),(19,23,125,'7 Days',1,1),(20,23,170,'5 Days',1,0),(21,23,190,'3 Days',1,0),(22,23,220,'48 Hours',0,0),(23,23,250,'24 Hours',0,0),(24,23,375,'Same Day',0,0),(25,22,200,'7 Days',1,1),(26,22,250,'5 Days',1,0),(27,22,300,'3 Days',1,0),(28,22,350,'48 Hours',1,0),(29,22,400,'24 Hours',1,0),(30,22,600,'Same Day',1,0),(32,13,NULL,NULL,1,NULL),(33,13,NULL,NULL,1,NULL),(34,13,NULL,NULL,1,NULL);
/*!40000 ALTER TABLE `turn_around_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'blikzofwvrtiwnyvusbm'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `DeleteExpiredTokensEvent` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = '+00:00' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`uyyzcbguvzablvjb`@`%`*/ /*!50106 EVENT `DeleteExpiredTokensEvent` ON SCHEDULE EVERY 1 DAY STARTS '2024-04-03 03:33:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    DECLARE num_rows_deleted INT;

    -- Call the procedure to delete expired tokens
    CALL DeleteExpiredTokens();

    -- Get the number of rows affected by the last statement (in this case, the DELETE operation)
    SELECT ROW_COUNT() INTO num_rows_deleted;

    -- Insert a record into the logging table with the number of rows deleted
    INSERT INTO event_execution_log (event_name, execution_time, rows_deleted)
    VALUES ('DeleteExpiredTokensEvent', NOW(), num_rows_deleted);
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'blikzofwvrtiwnyvusbm'
--
/*!50003 DROP PROCEDURE IF EXISTS `DeleteExpiredTokens` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`uyyzcbguvzablvjb`@`%` PROCEDURE `DeleteExpiredTokens`()
BEGIN
    DELETE FROM personal_access_tokens WHERE expires_at < NOW();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `TruncateAllTables` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`uyyzcbguvzablvjb`@`%` PROCEDURE `TruncateAllTables`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tableName VARCHAR(255);

    -- Declare cursor for table names
    DECLARE cur CURSOR FOR
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'enviro_works'; -- Replace 'your_database_name' with your actual database name

    -- Cursor loop
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO tableName;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Generate and execute truncate statement
        SET @truncateStmt = CONCAT('TRUNCATE TABLE ', tableName);
        PREPARE stmt FROM @truncateStmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-28 14:42:40
