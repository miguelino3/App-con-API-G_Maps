-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2023 at 08:51 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rutasgm`
--
CREATE DATABASE IF NOT EXISTS `rutasgm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `rutasgm`;

-- --------------------------------------------------------

--
-- Table structure for table `marcadores`
--

DROP TABLE IF EXISTS `marcadores`;
CREATE TABLE `marcadores` (
  `IDMark` int(11) NOT NULL,
  `nombreRuta` varchar(255) NOT NULL,
  `indice` int(11) NOT NULL,
  `latit` double NOT NULL,
  `longit` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `marcadores`
--

INSERT INTO `marcadores` (`IDMark`, `nombreRuta`, `indice`, `latit`, `longit`) VALUES
(1, 'Ruta 1', 0, 43.55318193350987, -5.7148251780496935),
(2, 'Ruta 1', 1, 43.53414434593699, -5.726841474436412),
(3, 'Ruta 1', 2, 43.51846181856026, -5.6997189768778185),
(5, 'Ruta II', 0, 43.57047230759045, -5.713520550537112),
(6, 'Ruta II', 1, 43.601553274900525, -5.663461299499068),
(7, 'Ruta II', 2, 43.580142149400544, -5.6723785400390625),
(13, 'RutaDefault', 0, 43.55686752311877, -5.714132351877441),
(14, 'RutaDefault', 1, 43.535466679705635, -5.748807950021972),
(15, 'RutaDefault', 2, 43.52351871919663, -5.71790890217041),
(16, 'RutaDefault', 3, 43.528746243147246, -5.68494991779541),
(17, 'RutaDefault', 4, 43.54095809876934, -5.684051513671875),
(20, 'aa', 0, 43.54026864768381, -5.727108866105319),
(21, 'aa', 1, 43.525707914799725, -5.713890940079929),
(22, 'aa', 2, 43.523965369382545, -5.6654824317791475);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `marcadores`
--
ALTER TABLE `marcadores`
  ADD PRIMARY KEY (`IDMark`),
  ADD UNIQUE KEY `nombreRuta` (`nombreRuta`,`indice`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `marcadores`
--
ALTER TABLE `marcadores`
  MODIFY `IDMark` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
