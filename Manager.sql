-- =========================================================
-- CYHOME ‑ Dump complet (structure)
-- Compatible MySQL ≥ 8.0 / MariaDB ≥ 10.4
-- =========================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
 /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
 /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 /*!40101 SET NAMES utf8mb4 */;

SET SQL_MODE       = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone      = '+00:00';
SET foreign_key_checks = 0;

-- --------------------------------------------------------
--  B A S E   D E   D O N N É E S
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `depenses` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `depenses`;

-- --------------------------------------------------------
-- 1) TABLE  users   (migrée en InnoDB)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `username`     VARCHAR(100) NOT NULL,
  `password`     VARCHAR(255) NOT NULL,   -- hash bcrypt/argon2
  `email`        VARCHAR(100) NOT NULL,
  `photo`        VARCHAR(255) NOT NULL,
  `role`         ENUM('visiteur','simple','complexe','admin') DEFAULT 'visiteur',
  `points`       INT          DEFAULT 0,
  `niveau`       INT          DEFAULT 0,
  `birthdate`    DATE         DEFAULT NULL,
  `gender`       ENUM('M','F','Autre')    DEFAULT NULL,
  `age`          INT          DEFAULT NULL,
  `member_type`  VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY  `uniq_username` (`username`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- 2) TABLE  devices   (objets connectés)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id`                INT NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(120)                       NOT NULL,
  `type`              ENUM('thermostat','climatiseur','volets','lumière','sécurité','météo') NOT NULL,
  `status`            ENUM('actif','inactif')            DEFAULT 'actif',
  `room`              VARCHAR(80)                        NOT NULL,
  `data`              JSON                               NULL,      -- propriétés spécifiques
  `energyConsumption` INT                                DEFAULT 0,
  `batteryLevel`      INT                                DEFAULT 100,
  `lastMaintenance`   DATE                               DEFAULT CURRENT_DATE,
  `created_at`        TIMESTAMP                          DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP                          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3) TABLE  device_delete_requests   (demandes de suppression)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `device_delete_requests`;
CREATE TABLE `device_delete_requests` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `device_id`    INT NOT NULL,
  `user_id`      INT NOT NULL,
  `comment`      VARCHAR(255) DEFAULT NULL,
  `requested_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `handled`      TINYINT(1)   DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ddr_device`
    FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_ddr_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--  (facultatif) insertion d’un compte admin démo
-- --------------------------------------------------------
INSERT INTO `users`
  (`username`, `password`,          `email`,            `photo`,          `role`, `points`)
VALUES
  ('admin',   '$2y$10$ixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- hash bcrypt: "admin123"
   'comptedepense205@gmail.com', '/uploads/default-avatar.png', 'admin', 0);

SET foreign_key_checks = 1;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
 /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
 /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
