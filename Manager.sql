-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 21 avr. 2025 à 10:24
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `depenses`
--

-- --------------------------------------------------------

--
-- Structure de la table `delete_requests`
--

DROP TABLE IF EXISTS `delete_requests`;
CREATE TABLE IF NOT EXISTS `delete_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `item_id` int NOT NULL,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `devices`
--

DROP TABLE IF EXISTS `devices`;
CREATE TABLE IF NOT EXISTS `devices` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('thermostat','climatiseur','volets','lumière','sécurité','météo') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('actif','inactif') COLLATE utf8mb4_general_ci DEFAULT 'actif',
  `room` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `data` json DEFAULT NULL,
  `energyConsumption` int DEFAULT '0',
  `batteryLevel` int DEFAULT '100',
  `lastMaintenance` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `suppressionDemandee` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `devices`
--

INSERT INTO `devices` (`id`, `name`, `type`, `status`, `room`, `data`, `energyConsumption`, `batteryLevel`, `lastMaintenance`, `created_at`, `updated_at`, `suppressionDemandee`) VALUES
(1, 'dd', 'thermostat', 'actif', 'dd', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:21:05', '2025-04-19 17:21:05', 0),
(2, 'ff', 'thermostat', 'actif', 'ff', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:38:02', '2025-04-19 17:47:01', 1),
(4, 'DD', 'thermostat', 'actif', 'dd', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:39:14', '2025-04-19 17:46:48', 1),
(5, 'aa', 'thermostat', 'actif', 'aa', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:42:14', '2025-04-19 18:02:36', 1),
(6, 'aa', 'lumière', 'actif', 'aa', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:42:27', '2025-04-19 17:42:27', 0),
(7, 'aa', 'lumière', 'actif', 'qq', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 17:42:40', '2025-04-19 17:42:40', 0),
(8, 'SABRI', 'thermostat', 'actif', 'cuisine', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 18:18:27', '2025-04-19 18:18:27', 0),
(9, 'qqq', 'thermostat', 'actif', 'qqq', NULL, 0, 100, '2025-04-19 00:00:00', '2025-04-19 18:27:47', '2025-04-19 18:27:47', 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('visiteur','simple','complexe','admin') COLLATE utf8mb4_general_ci DEFAULT 'simple',
  `points` int DEFAULT '0',
  `niveau` enum('debutant','intermediaire','avance','expert') COLLATE utf8mb4_general_ci DEFAULT 'debutant',
  `birthdate` date DEFAULT NULL,
  `gender` enum('M','F','Autre','PreferePasDire') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age` int DEFAULT NULL,
  `member_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `photo`, `role`, `points`, `niveau`, `birthdate`, `gender`, `age`, `member_type`) VALUES
(3, 'Admin', '$2y$10$unIL4WquuCRDXcnJGtJU/OYNfkj84ki781lZvzWzxq5W5EwZedpWa', 'comptedepense205@gmail.com', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'admin', 0, 'expert', '2025-04-10', '', 50, 'grandparent'),
(7, 'admin123', '$2y$10$lxS/RfRyYClQfTX6ba4tuOyQjVh957W1GsfXf9E5nVNlOunBSq7Py', 'younesysabri53@gmail.com', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'simple', 0, 'debutant', '0000-00-00', '', 0, '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
