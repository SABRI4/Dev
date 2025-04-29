mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: depenses
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delete_requests`
--

DROP TABLE IF EXISTS `delete_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delete_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `item_id` int NOT NULL,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delete_requests`
--

LOCK TABLES `delete_requests` WRITE;
/*!40000 ALTER TABLE `delete_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `delete_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('thermostat','climatiseur','volets','lumière','sécurité','météo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('actif','inactif') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'actif',
  `room` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `data` json DEFAULT NULL,
  `energyConsumption` int DEFAULT '0',
  `batteryLevel` int DEFAULT '100',
  `lastMaintenance` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `suppressionDemandee` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'dd','thermostat','actif','dd',NULL,0,100,'2025-04-19 00:00:00','2025-04-19 17:21:05','2025-04-19 17:21:05',0),(12,'aa','thermostat','actif','aa',NULL,12,90,'2200-12-12 00:00:00','2025-04-27 18:18:22','2025-04-28 20:32:19',0),(13,'qq ','sécurité','actif','pfeo',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 07:28:39','2025-04-28 07:28:39',0),(24,'a','thermostat','actif','q',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 18:01:50','2025-04-28 18:01:50',0),(25,'objet1 ','sécurité','actif','q',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 18:02:12','2025-04-28 18:02:12',0),(26,'a','sécurité','actif','a',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 18:02:26','2025-04-28 18:02:26',0),(27,'q','thermostat','actif','q',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 18:02:55','2025-04-28 18:02:55',0),(28,'a','thermostat','actif','a',NULL,0,85,'2025-04-28 00:00:00','2025-04-28 18:05:13','2025-04-28 18:05:13',0),(29,'a','thermostat','actif','a',NULL,0,100,'2025-04-28 00:00:00','2025-04-28 18:17:08','2025-04-28 18:17:08',0),(31,'chghg','thermostat','actif','gbuyhi',NULL,20,100,'2025-04-22 00:00:00','2025-04-28 18:39:58','2025-04-28 18:39:58',0),(32,'ss','thermostat','inactif','s',NULL,0,100,'0000-00-00 00:00:00','2025-04-28 20:28:29','2025-04-28 20:28:29',0);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `prenom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('visiteur','simple','complexe','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'simple',
  `points` int DEFAULT '0',
  `niveau` enum('debutant','intermediaire','avance','expert') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'debutant',
  `birthdate` date DEFAULT NULL,
  `gender` enum('M','F','Autre','PreferePasDire') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `member_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verification_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Admin','$2y$10$unIL4WquuCRDXcnJGtJU/OYNfkj84ki781lZvzWzxq5W5EwZedpWa','DuChef','Admin','comptedepense205@gmail.com','http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg','admin',1175,'expert','2025-04-10','',25,'grandparent',NULL,0),(14,'Younes','$2y$10$GX7LgFh/QLXU6CeQJ68Lrewz1rZMSziGqLp4I2zk2zjSjLHHmFORG','SABRI','Younes','younesysabri@hotmail.fr','http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg','admin',333,'expert','0000-00-00','',21,'','508c86f93d5cf25e12a6ff4d17cfdecdd32bb78c163097bc8f8bf91344d3f985',1),(17,'d','$2y$10$nT2W4B6R0JDuVSZbh/bWS.yr.0Z52TI4Rp13SNy0bkm8XSjMeBPTy','','','Younes','uploads/default-avatar.jpg','visiteur',10,'debutant','2025-04-09','',21,NULL,NULL,0),(60,'1123','$2y$10$ehrk9k6cSLizecXrTUNI9.Wk8tej8PyYLCwWMnmGba0xOIdIF87jy','','','12@mail.com','uploads/avatar_680ff6dfa9bad-Capture d’écran du 2025-04-28 17-10-10.png','visiteur',123,'debutant','2221-12-12','',123,NULL,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28 23:46:05
