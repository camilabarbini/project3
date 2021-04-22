-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-06-2020 a las 05:06:37
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilahresto`
--
CREATE DATABASE IF NOT EXISTS `delilahresto` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `delilahresto`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productsDetail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`productsDetail`)),
  `status` varchar(60) NOT NULL,
  `total` int(11) NOT NULL,
  `payloadMethod` varchar(60) NOT NULL,
  `address` varchar(60) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `title` varchar(60) NOT NULL,
  `price` int(11) NOT NULL,
  `img` varchar(160) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`productId`, `title`, `price`, `img`) VALUES
(1, 'Sushi', 400, 'https://s3.eestatic.com/2015/05/11/cocinillas/Cocinillas_32506750_116175093_1706x960.jpg'),
(2, 'Sandwich Veggie', 320, 'https://assets.bonappetit.com/photos/57aca69153e63daf11a4d915/master/pass/california-veggie-sandwich.jpg'),
(3, 'Hamburguesa Clásica', 350, 'https://recetinas.com/wp-content/uploads/2018/08/hamburguesas-clasicas-de-carne-picada.jpg'),
(4, 'Ensalada Veggie', 340, 'https://www.madridvegano.es/wp-content/uploads/2016/05/ensalada-veggie.jpg'),
(5, 'Veggie Abocado', 310, 'https://media-cdn.tripadvisor.com/media/photo-s/11/ed/98/a0/veggie-avocado-tomato.jpg'),
(6, 'Panqueques con Dulce de Leche', 310, 'https://www.casanhelp.com.ar/wp-content/uploads/2017/05/1452-GR-panqueques-de-dulce-de-leche_1_web.jpg'),
(7, 'Crema de Calabazas y Jengibre', 355, 'https://www.hola.com/imagenes/cocina/recetas/20180226120919/crema-calabaza-jengibre/0-724-626/crema-calabaza-m.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `status`
--

CREATE TABLE `status` (
  `statusId` int(11) NOT NULL,
  `status` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `status`
--

INSERT INTO `status` (`statusId`, `status`) VALUES
(1, 'nuevo'),
(2, 'confirmado'),
(3, 'preparando'),
(4, 'enviando'),
(5, 'entregado'),
(6, 'cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `fullName` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `address` varchar(60) NOT NULL,
  `celphone` varchar(60) NOT NULL,
  `favoriteProductsById` varchar(60) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`userId`, `fullName`, `email`, `password`, `address`, `celphone`, `favoriteProductsById`, `isAdmin`) VALUES
(1, 'Jose Martinez', 'jose.martinez@gmail.com', '$2b$12$JMdazeI/MXaV4u8p1/ekp.ut3o03nj5FVqUNOrTgs4xUQ0BGTKXsy', 'Santamarina 123', '2569568743', NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Indices de la tabla `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`statusId`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `status`
--
ALTER TABLE `status`
  MODIFY `statusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
