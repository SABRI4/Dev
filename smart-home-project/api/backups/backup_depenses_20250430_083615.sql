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
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (3,'volets'),(2,'climatiseur'),(1,'thermostat'),(4,'lumière'),(5,'météo'),(6,'sécurité');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `energy_priority` varchar(32) NOT NULL COMMENT 'Priorité énergétique (ex. low, medium, high, équilibré)',
  `auto_shutdown_inactive` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Arrêt automatique des appareils inactifs (0 ou 1)',
  `alert_sensitivity` varchar(32) NOT NULL COMMENT 'Sensibilité des alertes (faible, moyenne, élevée)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (34,'Obj1','thermostat','actif','Salon',NULL,0,100,'2025-04-30 00:00:00','2025-04-30 06:33:29','2025-04-30 07:32:49',0);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_connexion`
--

DROP TABLE IF EXISTS `historique_connexion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique_connexion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int DEFAULT NULL,
  `date_connexion` datetime NOT NULL,
  `succes_connexion` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_connexion`
--

LOCK TABLES `historique_connexion` WRITE;
/*!40000 ALTER TABLE `historique_connexion` DISABLE KEYS */;
INSERT INTO `historique_connexion` VALUES (1,75,'2025-04-29 21:29:28',1),(2,76,'2025-04-29 21:39:51',0),(3,76,'2025-04-29 21:40:03',1),(4,76,'2025-04-29 21:42:29',1),(5,NULL,'2025-04-29 21:43:40',0),(6,NULL,'2025-04-29 21:43:48',0),(7,NULL,'2025-04-29 21:43:54',0),(8,NULL,'2025-04-29 21:43:58',0),(9,NULL,'2025-04-29 21:44:25',0),(10,NULL,'2025-04-29 21:44:31',0),(11,NULL,'2025-04-29 21:44:40',0),(12,NULL,'2025-04-29 21:45:03',0),(13,NULL,'2025-04-29 21:45:03',0),(14,NULL,'2025-04-29 21:45:55',0),(15,NULL,'2025-04-29 21:46:01',0),(16,NULL,'2025-04-29 21:46:33',0),(17,NULL,'2025-04-29 21:46:34',0),(18,76,'2025-04-29 21:46:38',1),(19,NULL,'2025-04-29 21:46:58',0),(20,75,'2025-04-29 21:47:24',1),(21,75,'2025-04-29 21:47:32',0),(22,NULL,'2025-04-29 21:47:38',0),(23,75,'2025-04-29 21:47:40',0),(24,75,'2025-04-29 21:47:58',1),(25,NULL,'2025-04-29 21:48:12',0),(26,75,'2025-04-29 21:48:23',0),(27,75,'2025-04-29 21:48:26',1),(28,76,'2025-04-29 21:49:13',1),(29,75,'2025-04-29 21:55:54',1),(30,77,'2025-04-29 21:59:02',1),(31,75,'2025-04-29 21:59:56',1),(32,NULL,'2025-04-29 22:00:37',0),(33,79,'2025-04-29 22:00:57',1),(34,75,'2025-04-29 22:02:07',1),(35,79,'2025-04-29 22:02:50',1),(36,79,'2025-04-29 22:10:20',1),(37,79,'2025-04-29 22:14:02',1),(38,NULL,'2025-04-29 22:14:54',0),(39,79,'2025-04-29 22:14:58',1),(40,79,'2025-04-29 22:16:00',1),(41,79,'2025-04-29 22:18:22',1),(42,79,'2025-04-29 22:22:54',1),(43,79,'2025-04-29 22:23:12',1),(44,79,'2025-04-29 22:25:18',1),(45,79,'2025-04-29 22:27:28',1),(46,79,'2025-04-29 22:31:26',1),(47,81,'2025-04-29 22:32:52',1),(48,NULL,'2025-04-29 22:35:48',0),(49,81,'2025-04-29 22:35:51',0),(50,81,'2025-04-29 22:36:03',1),(51,81,'2025-04-29 22:37:48',1),(52,81,'2025-04-29 22:38:29',1),(53,NULL,'2025-04-29 23:04:26',0),(54,81,'2025-04-29 23:04:51',1),(55,81,'2025-04-29 23:05:20',1),(56,81,'2025-04-29 23:05:35',1),(57,81,'2025-04-29 23:08:50',1),(58,81,'2025-04-29 23:09:29',1),(59,81,'2025-04-29 23:11:07',1),(60,81,'2025-04-29 23:13:06',1),(61,81,'2025-04-29 23:13:43',1),(62,81,'2025-04-29 23:14:23',1),(63,81,'2025-04-29 23:20:10',1),(64,82,'2025-04-30 07:20:19',1),(65,82,'2025-04-30 07:21:06',1),(66,82,'2025-04-30 07:22:31',0),(67,82,'2025-04-30 07:22:35',1),(68,82,'2025-04-30 07:24:35',1),(69,82,'2025-04-30 07:31:33',1),(70,82,'2025-04-30 07:33:03',1),(71,82,'2025-04-30 07:38:03',1),(72,83,'2025-04-30 07:40:51',1),(73,81,'2025-04-30 07:54:12',1),(74,83,'2025-04-30 07:54:33',1),(75,81,'2025-04-30 07:56:27',1),(76,NULL,'2025-04-30 07:56:59',0),(77,81,'2025-04-30 07:57:04',1),(78,84,'2025-04-30 08:00:26',1),(79,84,'2025-04-30 08:09:55',1),(80,85,'2025-04-30 08:28:31',1);
/*!40000 ALTER TABLE `historique_connexion` ENABLE KEYS */;
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
  `gender` enum('Homme','Femme','Autre','PreferePasDire') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `member_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verification_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (83,'Ayman','$2y$10$wofioSIpG5w1bCnpK2dt7.YwCKXJ01HvFKfwzl43QMQAaYO0WuMD2','SABRI','YOUNES','younesysabri53@gmail.com','http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg','complexe',10,'avance','2025-04-18','Homme',21,'child','f1e01ef2bc82f39e570acc7a1b91ab5237d264dde148e30a33eb8232fd61dd10',1),(84,'Admin','$2y$10$CGxXdjycDc0vc0gtgefWSO6BFiTXLe862TQry.OzNtH55cC7fBDmS','ADMIN','ADMIN','comptedepense205@gmail.com','http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg','admin',30,'expert','2025-04-10','Autre',21,'mother','003617177bdd6f213dc43983cd9dda07c7dfca4cab5ac8abc35c532b0a476300',1),(85,'younes','$2y$10$qHPOYEp2FYpsqcgljRRrhOLqrQjJH9n7oES5PXy3HOWiwCaR/.TfO','sabri','younes','younesysabri@hotmail.fr','http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg','admin',21,'expert','2025-04-17','Femme',21,'father','15ac9670dc99dc8c0512e59077fb169ecbce0c04134dbe3436e91515adda03f0',1);
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

-- Dump completed on 2025-04-30 10:36:15
