-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-11-2025 a las 12:30:50
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inmotech`
--
CREATE DATABASE IF NOT EXISTS `inmotech` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inmotech`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `appointments`:
--   `propertyId`
--       `properties` -> `id`
--   `userId`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

DROP TABLE IF EXISTS `chats`;
CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `buyerId` int(11) NOT NULL,
  `sellerId` int(11) NOT NULL,
  `intermediaryId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `chats`:
--   `buyerId`
--       `users` -> `id`
--   `sellerId`
--       `users` -> `id`
--   `intermediaryId`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `files`
--

DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `messageId` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `uploadedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `files`:
--   `messageId`
--       `messages` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `fileUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `messages`:
--   `chatId`
--       `chats` -> `id`
--   `senderId`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `read` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `notifications`:
--   `userId`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `offers`
--

DROP TABLE IF EXISTS `offers`;
CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `buyerId` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `terms` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `offers`:
--   `propertyId`
--       `properties` -> `id`
--   `buyerId`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `allowed` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `permissions`:
--   `roleId`
--       `roles` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pricehistories`
--

DROP TABLE IF EXISTS `pricehistories`;
CREATE TABLE `pricehistories` (
  `id` int(11) NOT NULL,
  `propertyId` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `pricehistories`:
--   `propertyId`
--       `properties` -> `id`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profiles`
--

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `showContactInfo` tinyint(1) NOT NULL DEFAULT 1,
  `receiveEmailNotifications` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `profiles`:
--   `userId`
--       `users` -> `id`
--

--
-- Volcado de datos para la tabla `profiles`
--

INSERT INTO `profiles` (`id`, `userId`, `firstName`, `lastName`, `phone`, `avatar`, `preferences`, `createdAt`, `updatedAt`, `showContactInfo`, `receiveEmailNotifications`) VALUES
(1, 3, 'jonathan', 'rendon', '+57 3116761276', '/uploads/01728dc3bf8f0fdd5bbfc3e64780c3b7', '{\"location\":\"tumaco\",\"priceRange\":{\"min\":\"123456789\",\"max\":\"123456789\"},\"propertyType\":\"apartment\",\"bedrooms\":\"2\",\"bathrooms\":\"2\"}', '2025-11-04 14:39:50', '2025-11-19 23:05:02', 1, 1),
(2, 2, 'jonathan', 'rendon', '+57 3216417337', '/uploads/3083f074066f838f9f92211095cd4450', '{\"location\":\"\",\"priceRange\":{\"min\":\"\",\"max\":\"\"},\"propertyType\":\"\",\"bedrooms\":\"\",\"bathrooms\":\"\"}', '2025-11-14 17:29:17', '2025-11-21 03:10:27', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `properties`
--

DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `area` int(11) DEFAULT NULL,
  `parkingSpaces` int(11) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `sellerId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `propertyType` varchar(255) DEFAULT NULL,
  `furnished` tinyint(1) DEFAULT 0,
  `petFriendly` tinyint(1) DEFAULT 0,
  `elevator` tinyint(1) DEFAULT 0,
  `balcony` tinyint(1) DEFAULT 0,
  `garden` tinyint(1) DEFAULT 0,
  `pool` tinyint(1) DEFAULT 0,
  `gym` tinyint(1) DEFAULT 0,
  `security` tinyint(1) DEFAULT 0,
  `airConditioning` tinyint(1) DEFAULT 0,
  `heating` tinyint(1) DEFAULT 0,
  `internet` tinyint(1) DEFAULT 0,
  `laundry` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `properties`:
--   `sellerId`
--       `users` -> `id`
--

--
-- Volcado de datos para la tabla `properties`
--

INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `address`, `bedrooms`, `bathrooms`, `area`, `parkingSpaces`, `images`, `sellerId`, `createdAt`, `updatedAt`, `city`, `state`, `postalCode`, `status`, `propertyType`, `furnished`, `petFriendly`, `elevator`, `balcony`, `garden`, `pool`, `gym`, `security`, `airConditioning`, `heating`, `internet`, `laundry`) VALUES
(1, 'jonathan rendon', 'asdfghjkl', 10000000, 'bosques de obary', 'av ciudad de cali calle 42 sur cra 90c-21 piso 2 barrio las brisas', NULL, NULL, NULL, NULL, '[]', 2, '2025-11-21 01:51:35', '2025-11-21 08:04:02', 'bogota', '', '', 'active', 'apartment', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 'mki', 'mki', 10000000, NULL, 'av ciudad de cali calle 42 sur cra 90c-21 piso 2 barrio las brisas', NULL, NULL, NULL, NULL, NULL, 2, '2025-11-21 01:59:51', '2025-11-21 01:59:51', NULL, NULL, NULL, 'active', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 'tgb', 'tgb', 10000000, 'bosques de obary', 'av ciudad de cali calle 42 sur cra 90c-21 piso 2 barrio las brisas', 1, 1, 30, 1, '[{\"url\":\"https://res.cloudinary.com/dv8cyp6p4/image/upload/v1763692425/h7k8relobuk9rflhraup.jpg\",\"caption\":\"\",\"isPrimary\":true}]', 2, '2025-11-21 02:33:46', '2025-11-21 02:33:46', 'bogota', '', '', 'active', 'apartment', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
(4, 'asd', 'asd', 12345678, 'bosques de obary', 'av ciudad de cali calle 42 sur cra 90c-21 piso 2 barrio las brisas', 1, 1, 98, 0, '[{\"url\":\"https://res.cloudinary.com/dv8cyp6p4/image/upload/v1763705502/iostbkiqxoukk4bpnvyw.jpg\",\"caption\":\"\",\"isPrimary\":true}]', 2, '2025-11-21 06:11:44', '2025-11-21 06:11:45', 'bogota', '', '', 'active', 'apartment', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `roles`:
--

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'buyer', 'Comprador', '2025-11-01 04:00:39', '2025-11-01 04:00:39'),
(2, 'seller', 'Vendedor', '2025-11-01 04:00:40', '2025-11-01 04:00:40'),
(3, 'agent', 'Agente', '2025-11-01 04:00:40', '2025-11-01 04:00:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- RELACIONES PARA LA TABLA `sequelizemeta`:
--

--
-- Volcado de datos para la tabla `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251104-create-profile.js'),
('20251114-add-email-verification-fields-to-user.js'),
('20251118-add-privacy-fields-to-profile.js'),
('20251120-add-fields-to-properties.js'),
('20251121-remove-type-from-properties.js');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'buyer',
  `verified` tinyint(1) DEFAULT 0,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `emailVerificationCode` varchar(255) DEFAULT NULL,
  `emailVerificationExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `users`:
--   `role`
--       `roles` -> `name`
--

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `verified`, `phone`, `avatar`, `createdAt`, `updatedAt`, `emailVerified`, `emailVerificationCode`, `emailVerificationExpires`) VALUES
(2, 'jonathan rendon', 'jonathan_bermeo014@hotmail.com', '$2b$10$h1.wDUnbo0tdXcu2e.RzIue9H7zjMYAOoHMKWwnhiI113mWc1sY1.', 'seller', 0, NULL, NULL, '2025-11-01 04:02:02', '2025-11-14 18:11:57', 1, NULL, NULL),
(3, 'ivan rendon', 'ivanrendon@gmail.com', '$2b$10$vTh/H71A/7scyqlHcY5eDOxNR90fUrmEgqWQreTfs/Lw/lfjindnS', 'buyer', 0, '+57 987 654 3210', NULL, '2025-11-04 12:36:18', '2025-11-14 16:25:03', 0, '550377', '2025-11-14 16:40:03'),
(4, 'rendon bermeo', 'rendonbermeo@gmail.com', '$2b$10$gL4KiwnHMAPTXt4r2LPSruLDHOJ7OjwAxjRdoOb66mICNjvx8.NiO', 'agent', 0, NULL, NULL, '2025-11-04 12:41:40', '2025-11-04 12:41:40', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verifications`
--

DROP TABLE IF EXISTS `verifications`;
CREATE TABLE `verifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELACIONES PARA LA TABLA `verifications`:
--   `userId`
--       `users` -> `id`
--

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propertyId` (`propertyId`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyerId` (`buyerId`),
  ADD KEY `sellerId` (`sellerId`),
  ADD KEY `intermediaryId` (`intermediaryId`);

--
-- Indices de la tabla `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messageId` (`messageId`);

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatId` (`chatId`),
  ADD KEY `senderId` (`senderId`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propertyId` (`propertyId`),
  ADD KEY `buyerId` (`buyerId`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleId` (`roleId`);

--
-- Indices de la tabla `pricehistories`
--
ALTER TABLE `pricehistories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `propertyId` (`propertyId`);

--
-- Indices de la tabla `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indices de la tabla `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sellerId` (`sellerId`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role` (`role`);

--
-- Indices de la tabla `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pricehistories`
--
ALTER TABLE `pricehistories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `verifications`
--
ALTER TABLE `verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`buyerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `chats_ibfk_3` FOREIGN KEY (`intermediaryId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`buyerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pricehistories`
--
ALTER TABLE `pricehistories`
  ADD CONSTRAINT `pricehistories_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `verifications`
--
ALTER TABLE `verifications`
  ADD CONSTRAINT `verifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
