-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 27 avr. 2025 à 12:57
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
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nom`, `prenom`, `email`, `photo`, `role`, `points`, `niveau`, `birthdate`, `gender`, `age`, `member_type`, `verification_token`, `is_verified`) VALUES
(3, 'Admin', '$2y$10$unIL4WquuCRDXcnJGtJU/OYNfkj84ki781lZvzWzxq5W5EwZedpWa', 'DuChef', 'Admin', 'comptedepense205@gmail.com', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'admin', 0, 'expert', '2025-04-10', '', 50, 'grandparent', NULL, 0),
(7, 'admin123', '$2y$10$lxS/RfRyYClQfTX6ba4tuOyQjVh957W1GsfXf9E5nVNlOunBSq7Py', 'Sabri', 'Younes', 'younesysabri53@gmail.com', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'simple', 0, 'debutant', '0000-00-00', '', 0, '', NULL, 0),
(8, 'Younes', '$2y$10$Q6nOgmy2x29a3f6Bj3sQH.hmlbnC8qYwGBykd68U.htVl7Ju3D9bq', 'SABRI', 'Younes', 'younesysabri@hotmail.fr', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'simple', 0, 'debutant', '0000-00-00', '', 21, '', NULL, 1),
(9, 'Younesa', '$2y$10$Uul09W3v8qUqQ.DZJVDJD.3ncDjbIDy1.wxbxkTRbAr4F6VSij3yu', 'SABRI', 'Younes', 'younesysabri@hotmail.fr', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'visiteur', 0, 'debutant', '0000-00-00', '', 21, '', '9e756ed01b0bcc4866f860136111fb1cea652ad0104356f3d5ee7ef6bfaba1cc', 0),
(10, 'patrick', '$2y$10$nwpBfF6tP1CCYqroRRnZ4.CArd5uJIr8JJK908XjISbl3o2W.yRqu', 'SABRI', 'Younes', 'younesysabri53@hotmail.fr', 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg', 'visiteur', 0, 'debutant', '0000-00-00', '', 21, '', '88ed3b708d04b482a09978adf52a5599067623eca48c1fa349d1683508e9c525', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
