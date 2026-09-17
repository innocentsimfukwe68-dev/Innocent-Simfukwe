-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Database: `cosmetics_shop`
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

CREATE DATABASE IF NOT EXISTS `cosmetics_shop` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cosmetics_shop`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for table `branches`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `branches`;
CREATE TABLE `branches` (
  `LocationID` int(11) NOT NULL,
  `LocationName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `branches` (`LocationID`, `LocationName`) VALUES
(1, 'Duka Kuu');

-- --------------------------------------------------------
-- Table structure for table `brands`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `BrandID` int(11) NOT NULL,
  `BrandName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `brands` (`BrandID`, `BrandName`) VALUES
(2, 'Dove'),
(4, 'Garnier'),
(6, 'Johnson\'s'),
(5, 'Nice & Lovely'),
(1, 'Nivea'),
(3, 'Vaseline');

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`CategoryID`, `CategoryName`) VALUES
(6, 'Body Oil'),
(4, 'Hair Care'),
(1, 'Lotion'),
(5, 'Makeup'),
(2, 'Perfume'),
(3, 'Soap'),
(7, 'Urembo na Vifaa');

-- --------------------------------------------------------
-- Table structure for table `customers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `CustomerName` varchar(100) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `customers` (`CustomerID`, `CustomerName`, `Phone`) VALUES
(1, 'Asha', '0711111111'),
(2, 'Neema', '0755555555'),
(3, 'Rehema', '0766666666');

-- --------------------------------------------------------
-- Table structure for table `locations`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `LocationID` int(11) NOT NULL,
  `LocationName` varchar(100) NOT NULL,
  `Description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `locations` (`LocationID`, `LocationName`, `Description`) VALUES
(0, 'Store A', 'Stoo kuu ya ndani'),
(2, 'Shelf 1', 'Ushoroba wa mbele wa vinyunyishi'),
(3, 'Counter B', 'Eneo la kulipia karibu na mlango'),
(4, 'AA 01A', 'Shelf / Section AA 01A'),
(5, 'AA 01B', 'Shelf / Section AA 01B'),
(6, 'AA 01C', 'Shelf / Section AA 01C'),
(7, 'AA 01D', 'Shelf / Section AA 01D'),
(8, 'AA 01E', 'Shelf / Section AA 01E'),
(9, 'AA 02A', 'Shelf / Section AA 02A'),
(10, 'AA 02B', 'Shelf / Section AA 02B'),
(11, 'AA 02C', 'Shelf / Section AA 02C'),
(12, 'AA 02D', 'Shelf / Section AA 02D'),
(13, 'AA 02E', 'Shelf / Section AA 02E'),
(14, 'AA 03B', 'Shelf / Section AA 03B'),
(15, 'AA 03C', 'Shelf / Section AA 03C'),
(16, 'AA 03D', 'Shelf / Section AA 03D'),
(17, 'AA 03E', 'Shelf / Section AA 03E'),
(18, 'AA 04B', 'Shelf / Section AA 04B'),
(19, 'AA 04C', 'Shelf / Section AA 04C'),
(20, 'AA 04D', 'Shelf / Section AA 04D'),
(21, 'AA 04E', 'Shelf / Section AA 04E'),
(22, 'AA 05B', 'Shelf / Section AA 05B'),
(23, 'AA 05C', 'Shelf / Section AA 05C'),
(24, 'AA 05D', 'Shelf / Section AA 05D'),
(25, 'AA 05E', 'Shelf / Section AA 05E'),
(26, 'AA O1E', 'Shelf / Section AA O1E'),
(27, 'AA O2B', 'Shelf / Section AA O2B'),
(28, 'AA O2C', 'Shelf / Section AA O2C'),
(29, 'AA O3A', 'Shelf / Section AA O3A'),
(30, 'AA O4C', 'Shelf / Section AA O4C'),
(31, 'AB 01B', 'Shelf / Section AB 01B'),
(32, 'AB 01C', 'Shelf / Section AB 01C'),
(33, 'AB 01D', 'Shelf / Section AB 01D'),
(34, 'AB 01E', 'Shelf / Section AB 01E'),
(35, 'AB 01F', 'Shelf / Section AB 01F'),
(36, 'AB 02B', 'Shelf / Section AB 02B'),
(37, 'AB 02C', 'Shelf / Section AB 02C'),
(38, 'AB 02D', 'Shelf / Section AB 02D'),
(39, 'AB 02E', 'Shelf / Section AB 02E'),
(40, 'AB 02F', 'Shelf / Section AB 02F'),
(41, 'AB 03B', 'Shelf / Section AB 03B'),
(42, 'AB 03C', 'Shelf / Section AB 03C'),
(43, 'AB 03D', 'Shelf / Section AB 03D'),
(44, 'AB 03E', 'Shelf / Section AB 03E'),
(45, 'AB 03F', 'Shelf / Section AB 03F'),
(46, 'AB 04B', 'Shelf / Section AB 04B'),
(47, 'AB 04C', 'Shelf / Section AB 04C'),
(48, 'AB 04D', 'Shelf / Section AB 04D'),
(49, 'AB 04E', 'Shelf / Section AB 04E'),
(50, 'AB 04F', 'Shelf / Section AB 04F'),
(51, 'AB 05B', 'Shelf / Section AB 05B'),
(52, 'AB 05C', 'Shelf / Section AB 05C'),
(53, 'AB 05D', 'Shelf / Section AB 05D'),
(54, 'AB 05E', 'Shelf / Section AB 05E'),
(55, 'AB 05F', 'Shelf / Section AB 05F'),
(56, 'AB 06B', 'Shelf / Section AB 06B'),
(57, 'AB 06C', 'Shelf / Section AB 06C'),
(58, 'AB 06D', 'Shelf / Section AB 06D'),
(59, 'AB 06E', 'Shelf / Section AB 06E'),
(60, 'AB 06F', 'Shelf / Section AB 06F'),
(61, 'AB O6E', 'Shelf / Section AB O6E'),
(62, 'AC 01B', 'Shelf / Section AC 01B'),
(63, 'AC 01C', 'Shelf / Section AC 01C'),
(64, 'AC 01D', 'Shelf / Section AC 01D'),
(65, 'AC 01E', 'Shelf / Section AC 01E'),
(66, 'AC 01F', 'Shelf / Section AC 01F'),
(67, 'AC 02B', 'Shelf / Section AC 02B'),
(68, 'AC 02C', 'Shelf / Section AC 02C'),
(69, 'AC 02D', 'Shelf / Section AC 02D'),
(70, 'AC 02E', 'Shelf / Section AC 02E'),
(71, 'AC 03B', 'Shelf / Section AC 03B'),
(72, 'AC 03C', 'Shelf / Section AC 03C'),
(73, 'AC 03D', 'Shelf / Section AC 03D'),
(74, 'AC 03E', 'Shelf / Section AC 03E'),
(75, 'AC03E', 'Shelf / Section AC03E'),
(76, 'AD 01A', 'Shelf / Section AD 01A'),
(77, 'DA 01A', 'Shelf / Section DA 01A'),
(78, 'HA', 'Shelf / Section HA'),
(79, 'JA 01A', 'Shelf / Section JA 01A'),
(80, 'JA 0A1A', 'Shelf / Section JA 0A1A'),
(81, 'JA O1A', 'Shelf / Section JA O1A');

-- --------------------------------------------------------
-- Table structure for table `suppliers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `SupplierID` int(11) NOT NULL AUTO_INCREMENT,
  `SupplierName` varchar(100) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suppliers` (`SupplierID`, `SupplierName`, `Phone`, `Address`) VALUES
(1, 'Beauty Supplies Ltd', '0712345678', 'Dar es Salaam'),
(2, 'Cosmetic World', '0755123456', 'Mwanza');

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) NOT NULL,
  `Username` varchar(50) NOT NULL UNIQUE,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Cashier') NOT NULL DEFAULT 'Cashier',
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`UserID`, `FullName`, `Username`, `Password`, `Role`, `Status`) VALUES
(1, 'Administrator', 'innocent simfukwe', 'franciss@1939', 'Admin', 'Active'),
(2, 'Cashier One', 'cashier', 'cash123', 'Cashier', 'Active');

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) NOT NULL,
  `Barcode` varchar(100) DEFAULT NULL UNIQUE,
  `CategoryID` int(11) NOT NULL,
  `BrandID` int(11) DEFAULT NULL,
  `LocationID` int(11) DEFAULT NULL,
  `SupplierID` int(11) NOT NULL,
  `BuyingPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `SellingPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `CostPrice` decimal(10,2) DEFAULT 0.00,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `ReorderLevel` int(11) DEFAULT 3,
  `ExpiryDate` date DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `CategoryID` (`CategoryID`),
  KEY `BrandID` (`BrandID`),
  KEY `SupplierID` (`SupplierID`),
  KEY `LocationID` (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products` (`ProductID`, `ProductName`, `Barcode`, `CategoryID`, `BrandID`, `LocationID`, `SupplierID`, `BuyingPrice`, `SellingPrice`, `CostPrice`, `Quantity`, `ReorderLevel`, `ExpiryDate`) VALUES
(1, 'super black beuty (60ml)', NULL, 1, NULL, 4, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(2, 'super black (28+23ml)', NULL, 1, NULL, 4, 1, 0.00, 2500.00, 0.00, 5, 3, NULL),
(3, 'Superblack (30ml)', NULL, 1, NULL, 4, 1, 600.00, 1000.00, 0.00, 19, 3, NULL),
(4, 'Eggy skin (200ml)', NULL, 1, NULL, 5, 1, 7500.00, 10000.00, 0.00, 0, 3, NULL),
(5, 'Eggyskin (450ml)', NULL, 1, NULL, 5, 1, 18000.00, 25000.00, 0.00, 3, 3, NULL),
(6, 'Eggyskin (300ml)', NULL, 1, NULL, 5, 1, 8000.00, 12000.00, 0.00, 3, 3, NULL),
(7, 'Eggyskin (120ml)', NULL, 1, NULL, 5, 1, 3500.00, 5000.00, 0.00, 18, 3, NULL),
(8, 'Amara cocoabutter (400ml)', NULL, 1, NULL, 6, 1, 3500.00, 13000.00, 0.00, 2, 3, NULL),
(9, 'Amara for men (400ml)', NULL, 1, NULL, 6, 1, 8500.00, 13000.00, 0.00, 2, 3, NULL),
(10, 'Amara for men (200ml)', NULL, 1, NULL, 6, 1, 4500.00, 6000.00, 0.00, 2, 3, NULL),
(11, 'Skala (50ml)', NULL, 1, NULL, 6, 1, 2500.00, 3000.00, 0.00, 8, 3, NULL),
(12, 'Nivea Radiunt (400ml)', NULL, 1, 1, 7, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(13, 'Vaseline extra (200ml)', NULL, 1, 3, 7, 1, 0.00, 0.00, 0.00, 0, 3, NULL),
(14, 'Vaselin for men in extra (400ml)', NULL, 1, NULL, 7, 1, 0.00, 12000.00, 0.00, 0, 3, NULL),
(15, 'Kojic oil (200ml)', NULL, 1, NULL, 8, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(16, 'Licorice root lotion (500ml)', NULL, 1, NULL, 8, 1, 0.00, 15000.00, 0.00, 3, 3, NULL),
(17, 'Rich&Pure (275ml)', NULL, 1, NULL, 8, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(18, 'White rose (400ml)', NULL, 1, NULL, 8, 1, 0.00, 8000.00, 0.00, 2, 3, NULL),
(19, 'Minara (200ml)', NULL, 1, NULL, 10, 1, 1500.00, 2000.00, 0.00, 13, 3, NULL),
(20, 'Parachut (500ml)', NULL, 1, NULL, 10, 1, 9000.00, 10000.00, 0.00, 0, 3, NULL),
(21, 'Parachut (100ml)', NULL, 1, NULL, 10, 1, 2000.00, 3000.00, 0.00, 6, 3, NULL),
(22, 'soft coconut (200ml)', NULL, 1, NULL, 10, 1, 1700.00, 2500.00, 0.00, 13, 3, NULL),
(23, 'vaceline cooling (400ml)', NULL, 1, 3, 11, 1, 0.00, 12000.00, 0.00, 2, 3, NULL),
(24, 'vaceline cooling (200ml)', NULL, 1, 3, 11, 1, 5000.00, 5000.00, 0.00, 3, 3, NULL),
(25, 'Vaseline fast (400ml)', NULL, 1, 3, 11, 1, 0.00, 12000.00, 0.00, 0, 3, NULL),
(26, 'RDL papaya (600ml)', NULL, 1, NULL, 12, 1, 0.00, 12000.00, 0.00, 3, 3, NULL),
(27, 'Rubeer (473ml)', NULL, 1, NULL, 12, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(28, 'Dove  essential (400ml)', NULL, 1, 2, 13, 1, 0.00, 12000.00, 0.00, 0, 3, NULL),
(29, 'Dove nourish secret awakening (400ml)', NULL, 1, 2, 13, 1, 7500.00, 10000.00, 0.00, 2, 3, NULL),
(30, 'Peau claire (150ml)', NULL, 1, NULL, 13, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(31, 'Bio oil', NULL, 1, NULL, 13, 1, 7000.00, 75000.00, 0.00, 4, 3, NULL),
(32, 'Cocopulp (300ml)', NULL, 1, NULL, 14, 1, 7500.00, 10000.00, 0.00, 2, 3, NULL),
(33, 'Cocopulp (150ml)', NULL, 1, NULL, 14, 1, 3500.00, 5000.00, 0.00, 3, 3, NULL),
(34, 'D.E.S (125ml)', NULL, 1, NULL, 14, 1, 3500.00, 5000.00, 0.00, 2, 3, NULL),
(35, 'Gluta white (125ml)', NULL, 1, NULL, 14, 1, 5500.00, 5000.00, 0.00, 3, 3, NULL),
(36, 'Gluta white (275ml)', NULL, 1, NULL, 14, 1, 9000.00, 12000.00, 0.00, 1, 3, NULL),
(37, 'paw paw (300ml)', NULL, 1, NULL, 14, 1, 5000.00, 10000.00, 0.00, 5, 3, NULL),
(38, 'Pawpaw (120ml)', NULL, 1, NULL, 14, 1, 3500.00, 5000.00, 0.00, 9, 3, NULL),
(39, 'Bella vie (240ml)', NULL, 1, NULL, 15, 1, 9000.00, 12000.00, 0.00, 5, 3, NULL),
(40, 'Bella vie (125ml)', NULL, 1, NULL, 15, 1, 8500.00, 10000.00, 0.00, 0, 3, NULL),
(41, 'Bella vie (300ml)', NULL, 1, NULL, 15, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(42, 'Belle vie (475ml)', NULL, 1, NULL, 15, 1, 0.00, 25000.00, 0.00, 1, 3, NULL),
(43, 'Golden glow (500ml)', NULL, 1, NULL, 15, 1, 13000.00, 18000.00, 0.00, 1, 3, NULL),
(44, 'American touch (500ml)', NULL, 1, NULL, 16, 1, 23000.00, 28000.00, 0.00, 0, 3, NULL),
(45, 'Elegance (160ml)', NULL, 1, NULL, 16, 1, 4000.00, 5000.00, 0.00, 2, 3, NULL),
(46, 'Elegance (330ml)', NULL, 1, NULL, 16, 1, 7500.00, 10000.00, 0.00, 2, 3, NULL),
(47, 'Bio gold (600ml)', NULL, 1, NULL, 17, 1, 9500.00, 15000.00, 0.00, 0, 3, NULL),
(48, 'Jaune (300ml)', NULL, 1, NULL, 17, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(49, 'Elle lightening (250gr)', NULL, 1, NULL, 17, 1, 0.00, 7000.00, 0.00, 1, 3, NULL),
(50, 'Curcuma (250ml)', NULL, 1, NULL, 18, 1, 0.00, 12000.00, 0.00, 0, 3, NULL),
(51, 'Curcuma (120ml)', NULL, 1, NULL, 18, 1, 0.00, 5000.00, 0.00, 5, 3, NULL),
(52, 'CT clear (200ml)', NULL, 1, NULL, 18, 1, 0.00, 12000.00, 0.00, 6, 3, NULL),
(53, 'Mega white (300ml)', NULL, 1, NULL, 18, 1, 0.00, 14000.00, 0.00, 2, 3, NULL),
(54, 'Mega white (230ml)', NULL, 1, NULL, 18, 1, 0.00, 15000.00, 0.00, 3, 3, NULL),
(55, 'Dodo (150gr)', NULL, 1, NULL, 19, 1, 6000.00, 10000.00, 0.00, 2, 3, NULL),
(56, 'Glowy jaune (120ml)', NULL, 1, NULL, 19, 1, 0.00, 5000.00, 0.00, 0, 3, NULL),
(57, 'Miss lemon (500ml)', NULL, 1, NULL, 19, 1, 12000.00, 20000.00, 0.00, 2, 3, NULL),
(58, 'Glowly (300ml)', NULL, 1, NULL, 19, 1, 8500.00, 10000.00, 0.00, 3, 3, NULL),
(59, 'Elixir light (500ml)', NULL, 1, NULL, 20, 1, 0.00, 24000.00, 0.00, 0, 3, NULL),
(60, 'Elixir light (220ml)', NULL, 1, NULL, 20, 1, 12000.00, 15000.00, 0.00, 2, 3, NULL),
(61, 'Nivea cocoa butter (400ml)', NULL, 1, 1, 21, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(62, 'Nivea nourishing cocoa (200ml)', NULL, 1, 1, 21, 1, 0.00, 9000.00, 0.00, 1, 3, NULL),
(63, 'Nivea nourishing cocoa (100ml)', NULL, 1, 1, 21, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(64, 'Nivea rich (100ml)', NULL, 1, 1, 21, 1, 0.00, 5000.00, 0.00, 4, 3, NULL),
(65, 'Nivea rich nourishing (200ml)', NULL, 1, 1, 21, 1, 0.00, 9000.00, 0.00, 2, 3, NULL),
(66, 'Miku gel (500g)', NULL, 4, NULL, 22, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(67, 'Movit hair food (200g)', NULL, 4, NULL, 22, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(68, 'Movit surphur (1oog)', NULL, 4, NULL, 22, 1, 0.00, 3500.00, 0.00, 2, 3, NULL),
(69, 'Movit hair food (100g)', NULL, 4, NULL, 22, 1, 0.00, 3000.00, 0.00, 2, 3, NULL),
(70, 'Movit hair food (70g)', NULL, 4, NULL, 22, 1, 1700.00, 2000.00, 0.00, 8, 3, NULL),
(71, 'Movit hair sulphur (50g)', NULL, 4, NULL, 22, 1, 0.00, 2000.00, 0.00, 0, 3, NULL),
(72, 'Easy wave (125ml)', NULL, 1, NULL, 23, 1, 3000.00, 3500.00, 0.00, 3, 3, NULL),
(73, 'Easy wave (250ml)', NULL, 1, NULL, 23, 1, 4000.00, 6000.00, 0.00, 3, 3, NULL),
(74, 'Shampoo telesa (1000ml)', NULL, 4, NULL, 23, 1, 1000.00, 1500.00, 0.00, 7, 3, NULL),
(75, 'Easy wave (300ml)', NULL, 1, NULL, 24, 1, 5000.00, 10000.00, 0.00, 3, 3, NULL),
(76, 'Radiant hair (200g)', NULL, 4, NULL, 24, 1, 4500.00, 6000.00, 0.00, 0, 3, NULL),
(77, 'Radiant hair (100g)', NULL, 4, NULL, 24, 1, 0.00, 13000.00, 0.00, 0, 3, NULL),
(78, 'Movit gel (250ml)', NULL, 4, NULL, 24, 1, 0.00, 3500.00, 0.00, 0, 3, NULL),
(79, 'blue magic gel (500ml)', NULL, 4, NULL, 24, 1, 0.00, 12000.00, 0.00, 2, 3, NULL),
(80, 'CT shower y (175ml)', NULL, 1, NULL, 25, 1, 6000.00, 7000.00, 0.00, 0, 3, NULL),
(81, 'Jelly allsun (60ml)', NULL, 1, NULL, 25, 1, 3500.00, 5000.00, 0.00, 3, 3, NULL),
(82, 'Jelly allsun (500g)', NULL, 1, NULL, 25, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(83, 'Jelly allsun (500ml)', NULL, 1, NULL, 25, 1, 6000.00, 7000.00, 0.00, 1, 3, NULL),
(84, 'Miku hair food (250ml)', NULL, 4, NULL, 25, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(85, 'Licorice root oil (2ooml)', NULL, 1, NULL, 26, 1, 0.00, 11000.00, 0.00, 4, 3, NULL),
(86, 'Parachut (50ml)', NULL, 1, NULL, 27, 1, 1000.00, 1500.00, 0.00, 2, 3, NULL),
(87, 'vaceline cocoa radiant (200ml)', NULL, 1, 3, 28, 1, 5000.00, 7000.00, 0.00, 9, 3, NULL),
(88, 'vaceline cocoa radiant (400ml)', NULL, 1, 3, 28, 1, 8500.00, 12000.00, 0.00, 3, 3, NULL),
(89, 'Faundation', NULL, 5, NULL, 29, 1, 9000.00, 12000.00, 0.00, 9, 3, NULL),
(90, 'Vacceline mgando (95ml)', NULL, 1, NULL, 30, 1, 2500.00, 3000.00, 0.00, 7, 3, NULL),
(91, 'Amara body milk (200ml)', NULL, 1, NULL, 31, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(92, 'Amara body milk (400ml)', NULL, 1, NULL, 31, 1, 0.00, 12000.00, 0.00, 2, 3, NULL),
(93, 'American cocoa butter (400ml)', NULL, 1, NULL, 31, 1, 0.00, 25000.00, 0.00, 3, 3, NULL),
(94, 'Nivea intensive (400ml)', NULL, 1, 1, 31, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(95, 'Nivea cocoa butter (400ml)', NULL, 1, 1, 32, 1, 0.00, 13000.00, 0.00, 3, 3, NULL),
(96, 'Nivea intensive (400ml)', NULL, 1, 1, 32, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(97, 'Revlon original formula (350ml)', NULL, 1, NULL, 32, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(98, 'Nivea cool (400ml)', NULL, 1, 1, 33, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(99, 'Nivea deep (400ml)', NULL, 1, 1, 33, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(100, 'Nivea rich nourishing (400ml)', NULL, 1, 1, 33, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(101, 'Nivea maximum (400ml)', NULL, 1, 1, 33, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(102, 'Nivea revitalising (400ml)', NULL, 1, 1, 33, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(103, 'Rinju Beaute (473ml)', NULL, 1, NULL, 34, 1, 0.00, 15000.00, 0.00, 3, 3, NULL),
(104, 'Gluta terminal white (500ml)', NULL, 1, NULL, 34, 1, 0.00, 15000.00, 0.00, 3, 3, NULL),
(105, 'Revlon original (600ml)', NULL, 1, NULL, 34, 1, 0.00, 15000.00, 0.00, 4, 3, NULL),
(106, 'Rinju body &hand (453ml)', NULL, 1, NULL, 34, 1, 0.00, 13000.00, 0.00, 3, 3, NULL),
(107, 'Beckon', NULL, 1, NULL, 35, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(108, 'Paris carote (500ml)', NULL, 1, NULL, 35, 1, 0.00, 25000.00, 0.00, 1, 3, NULL),
(109, 'Paris royal (500ml)', NULL, 1, NULL, 35, 1, 0.00, 25000.00, 0.00, 1, 3, NULL),
(110, 'Paris ultime gold or luxe (750ml)', NULL, 1, NULL, 35, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(111, 'Bronze (125ml)', NULL, 1, NULL, 36, 1, 5000.00, 8000.00, 0.00, 2, 3, NULL),
(112, 'Bronze (275ml)', NULL, 1, NULL, 36, 1, 1000.00, 12000.00, 0.00, 1, 3, NULL),
(113, 'Bronze (200ml)', NULL, 1, NULL, 36, 1, 9000.00, 10000.00, 0.00, 1, 3, NULL),
(114, 'Bronze (300ml)', NULL, 1, NULL, 36, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(115, 'Nivea revitalising (400ml)', NULL, 1, 1, 37, 1, 0.00, 13000.00, 0.00, 2, 3, NULL),
(116, 'Nivea maximum for men (400ml)', NULL, 1, 1, 37, 1, 0.00, 13000.00, 0.00, 0, 3, NULL),
(117, 'Nivea men cool kick (200ml)', NULL, 1, 1, 37, 1, 0.00, 7000.00, 0.00, 0, 3, NULL),
(118, 'Nivea men deep (400ml)', NULL, 1, 1, 37, 1, 0.00, 13000.00, 0.00, 0, 3, NULL),
(119, 'Nivea rich nourishing (400ml)', NULL, 1, 1, 37, 1, 0.00, 13000.00, 0.00, 2, 3, NULL),
(120, 'Nivea Shea smooth (100ml)', NULL, 1, 1, 37, 1, 3500.00, 5000.00, 0.00, 1, 3, NULL),
(121, 'Cocoa butter  jerry (125ml)', NULL, 1, NULL, 38, 1, 0.00, 2500.00, 0.00, 5, 3, NULL),
(122, 'Molato lotion (500ml)', NULL, 1, NULL, 38, 1, 0.00, 13000.00, 0.00, 3, 3, NULL),
(123, 'Nivea deodorant stress (50ml)', NULL, 1, 1, 38, 1, 400.00, 5000.00, 0.00, 14, 3, NULL),
(124, 'Gluter berry shower gelly (1000ml)', NULL, 4, NULL, 39, 1, 10000.00, 20000.00, 0.00, 2, 3, NULL),
(125, 'Dawmy maxitoner', NULL, 1, NULL, 39, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(126, 'Final glow shower (1000ml)', NULL, 1, NULL, 39, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(127, 'Revlon aloe Vera (600ml)', NULL, 1, NULL, 39, 1, 0.00, 12000.00, 0.00, 0, 3, NULL),
(128, 'Beauted (450ml)', NULL, 1, NULL, 40, 1, 0.00, 25000.00, 0.00, 2, 3, NULL),
(129, 'Bicarbolight (500ml)', NULL, 1, NULL, 40, 1, 0.00, 25000.00, 0.00, 1, 3, NULL),
(130, 'Bicarbolight (250ml)', NULL, 1, NULL, 40, 1, 9000.00, 12000.00, 0.00, 2, 3, NULL),
(131, 'Bicarbolight (140ml)', NULL, 1, NULL, 40, 1, 0.00, 7000.00, 0.00, 2, 3, NULL),
(132, 'Glycerine aloe Vera (100ml)', NULL, 1, NULL, 41, 1, 0.00, 2500.00, 0.00, 12, 3, NULL),
(133, 'Glycerine aloe Vera (50ml)', NULL, 1, NULL, 41, 1, 700.00, 1000.00, 0.00, 3, 3, NULL),
(134, 'Glycerine bannister (100ml)', NULL, 1, NULL, 41, 1, 0.00, 3000.00, 0.00, 3, 3, NULL),
(135, 'Nivea cool kick (400ml)', NULL, 1, 1, 41, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(136, 'CT OIL (75ml)', NULL, 1, NULL, 42, 1, 0.00, 5000.00, 0.00, 5, 3, NULL),
(137, 'Turmeric lotion (300ml)', NULL, 1, NULL, 42, 1, 0.00, 17000.00, 0.00, 2, 3, NULL),
(138, 'Turmeric omega oil (200ml)', NULL, 1, NULL, 42, 1, 0.00, 17000.00, 0.00, 2, 3, NULL),
(139, 'Turmeric super oil (200ml)', NULL, 1, NULL, 42, 1, 5000.00, 17000.00, 0.00, 0, 3, NULL),
(140, 'Dettol shower gel cream (1200ml)', NULL, 4, NULL, 43, 1, 10000.00, 15000.00, 0.00, 2, 3, NULL),
(141, 'Dove purely (500ml)', NULL, 1, 2, 43, 1, 7500.00, 12000.00, 0.00, 4, 3, NULL),
(142, 'Aha body shower gel (1000ml)', NULL, 4, NULL, 44, 1, 0.00, 22000.00, 0.00, 2, 3, NULL),
(143, 'Glutathione shower gel (1000ml)', NULL, 4, NULL, 44, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(144, 'Max ant vergeture shower (1000ml)', NULL, 1, NULL, 44, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(145, 'Bloom gluta shower gel (1000ml)', NULL, 4, NULL, 45, 1, 0.00, 20000.00, 0.00, 1, 3, NULL),
(146, 'Original glutathione showergel (1000ml)', NULL, 4, NULL, 45, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(147, 'Sk vitamin c college showergel (1000ml)', NULL, 4, NULL, 45, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(148, 'Whiting scrub shower gel (1000ml)', NULL, 4, NULL, 45, 1, 0.00, 20000.00, 0.00, 1, 3, NULL),
(149, 'Herbal (50g)', NULL, 1, NULL, 46, 1, 0.00, 1000.00, 0.00, 12, 3, NULL),
(150, 'Habib jerry (50g)', NULL, 1, NULL, 46, 1, 0.00, 1000.00, 0.00, 12, 3, NULL),
(151, 'Podoa (50g)', NULL, 1, NULL, 46, 1, 0.00, 1000.00, 0.00, 10, 3, NULL),
(152, 'Skala mgando (25g)', NULL, 1, NULL, 47, 1, 0.00, 500.00, 0.00, 7, 3, NULL),
(153, 'baby care (25g)', NULL, 1, NULL, 47, 1, 0.00, 500.00, 0.00, 9, 3, NULL),
(154, 'Body luxe (50g)', NULL, 1, NULL, 47, 1, 0.00, 1000.00, 0.00, 11, 3, NULL),
(155, 'herbal (25g)', NULL, 1, NULL, 47, 1, 0.00, 500.00, 0.00, 12, 3, NULL),
(156, 'Clear nourishing (125ml)', NULL, 1, NULL, 48, 1, 2500.00, 4000.00, 0.00, 2, 3, NULL),
(157, 'Clear nourishing (300ml)', NULL, 1, NULL, 48, 1, 4000.00, 7000.00, 0.00, 2, 3, NULL),
(158, 'Clere nourishing (500ml)', NULL, 1, NULL, 48, 1, 4500.00, 25000.00, 0.00, 2, 3, NULL),
(159, 'Amalfi carrot shower gel (750ml)', NULL, 4, NULL, 49, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(160, 'Amalfi coco shower gel (750ml)', NULL, 4, NULL, 49, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(161, 'Amalfi intense shower gel (750ml)', NULL, 4, NULL, 49, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(162, 'Amalfi pure shower gel (750ml)', NULL, 4, NULL, 50, 1, 0.00, 12000.00, 0.00, 1, 3, NULL),
(163, 'Amalfi supreme shower gel (1000ml)', NULL, 4, NULL, 50, 1, 0.00, 20000.00, 0.00, 1, 3, NULL),
(164, 'Shea butter shower gel covonut (1000ml)', NULL, 4, NULL, 50, 1, 0.00, 20000.00, 0.00, 2, 3, NULL),
(165, 'Shea butter vanills (500ml)', NULL, 1, NULL, 51, 1, 0.00, 15000.00, 0.00, 1, 3, NULL),
(166, 'Bio plus lemon (500ml)', NULL, 1, NULL, 51, 1, 0.00, 15000.00, 0.00, 0, 3, NULL),
(167, 'Bio plus papaya (175ml)', NULL, 1, NULL, 51, 1, 0.00, 8000.00, 0.00, 2, 3, NULL),
(168, 'Bio plus papaya (500ml)', NULL, 1, NULL, 51, 1, 0.00, 15000.00, 0.00, 0, 3, NULL),
(169, 'Infini clear (300ml)', NULL, 1, NULL, 52, 1, 7500.00, 10000.00, 0.00, 3, 3, NULL),
(170, 'Infini clear (120ml)', NULL, 1, NULL, 52, 1, 3500.00, 5000.00, 0.00, 5, 3, NULL),
(171, 'Cocoa butter formula (140ml)', NULL, 1, NULL, 53, 1, 8500.00, 10000.00, 0.00, 2, 3, NULL),
(172, 'Bicarbolight shower gel (400ml)', NULL, 4, NULL, 53, 1, 0.00, 13000.00, 0.00, 2, 3, NULL),
(173, 'Always young shower gel (1000ml)', NULL, 4, NULL, 54, 1, 10000.00, 15000.00, 0.00, 2, 3, NULL),
(174, 'Satiskin shower gel (1lt)', NULL, 4, NULL, 54, 1, 7500.00, 10000.00, 0.00, 2, 3, NULL),
(175, 'Pilipil (474ml)', NULL, 1, NULL, 55, 1, 0.00, 10000.00, 0.00, 0, 3, NULL),
(176, 'Veerox (120ml)', NULL, 1, NULL, 55, 1, 0.00, 6000.00, 0.00, 2, 3, NULL),
(177, 'Pretty white (300ml)', NULL, 1, NULL, 56, 1, 3500.00, 6000.00, 0.00, 3, 3, NULL),
(178, 'Razac lotion (150ml)', NULL, 1, NULL, 56, 1, 7000.00, 10000.00, 0.00, 3, 3, NULL),
(179, 'Chicon (300ml)', NULL, 1, NULL, 57, 1, 0.00, 10000.00, 0.00, 0, 3, NULL),
(180, 'Chicon (120ml)', NULL, 1, NULL, 57, 1, 0.00, 1000.00, 0.00, 0, 3, NULL),
(181, 'esapharma (300ml)', NULL, 1, NULL, 58, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(182, 'extra clair (120ml)', NULL, 1, NULL, 58, 1, 0.00, 5000.00, 0.00, 8, 3, NULL),
(183, 'Garnier body (400ml)', NULL, 1, 4, 58, 1, 0.00, 20000.00, 0.00, 0, 3, NULL),
(184, 'movit body lotion (250ml)', NULL, 4, NULL, 58, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(185, 'Extra Clair caroti (300ml)', NULL, 1, NULL, 58, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(186, 'Clear men (120ml)', NULL, 1, NULL, 59, 1, 3500.00, 5000.00, 0.00, 3, 3, NULL),
(187, 'Baby powder (250g)', NULL, 5, NULL, 60, 1, 4000.00, 500.00, 0.00, 16, 3, NULL),
(188, 'After shave (140ml)', NULL, 1, NULL, 60, 1, 0.00, 1000.00, 0.00, 1, 3, NULL),
(189, 'Clear men (300ml)', NULL, 1, NULL, 61, 1, 7000.00, 10000.00, 0.00, 3, 3, NULL),
(190, 'Movit gel (500g)', NULL, 4, NULL, 62, 1, 7000.00, 13000.00, 0.00, 2, 3, NULL),
(191, 'Movit gel (150g)', NULL, 4, NULL, 62, 1, 3000.00, 3500.00, 0.00, 0, 3, NULL),
(192, 'Movit gel (1kg)', NULL, 4, NULL, 62, 1, 0.00, 17000.00, 0.00, 2, 3, NULL),
(193, 'Tcb hair relaxer (1Kg)', NULL, 4, NULL, 62, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(194, 'Revlon hair leraxer (226g)', NULL, 4, NULL, 63, 1, 0.00, 7000.00, 0.00, 3, 3, NULL),
(195, 'Revlon hair (150g)', NULL, 4, NULL, 63, 1, 3000.00, 3500.00, 0.00, 3, 3, NULL),
(196, 'Movit (150g)', NULL, 4, NULL, 63, 1, 3000.00, 3500.00, 0.00, 3, 3, NULL),
(197, 'Soft free (250ml)', NULL, 1, NULL, 63, 1, 4000.00, 5000.00, 0.00, 2, 3, NULL),
(198, 'soft free (125g)', NULL, 1, NULL, 64, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(199, 'Soft free crem relaxer (500g)', NULL, 4, NULL, 64, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(200, 'Radiant hair relaxer (250g)', NULL, 4, NULL, 64, 1, 4000.00, 6000.00, 0.00, 0, 3, NULL),
(201, 'Radiant hair relaxer (1kg)', NULL, 4, NULL, 64, 1, 0.00, 18000.00, 0.00, 0, 3, NULL),
(202, 'Movit hair relaxer (250g)', NULL, 4, NULL, 65, 1, 0.00, 8000.00, 0.00, 2, 3, NULL),
(203, 'Perfect hair relaxer (1000g)', NULL, 4, NULL, 65, 1, 0.00, 13000.00, 0.00, 2, 3, NULL),
(204, 'Perfect hair relaxer (500g)', NULL, 4, NULL, 65, 1, 0.00, 12000.00, 0.00, 4, 3, NULL),
(205, 'Mega growth (500g)', NULL, 1, NULL, 65, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(206, 'Radiant hair relaxer (1000ml)', NULL, 4, NULL, 66, 1, 0.00, 17000.00, 0.00, 0, 3, NULL),
(207, 'Roushun hair mayonnaise', NULL, 4, NULL, 66, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(208, 'Movit hair relaxer (1Kg)', NULL, 4, NULL, 66, 1, 0.00, 17000.00, 0.00, 2, 3, NULL),
(209, 'Lorys (500g)', NULL, 1, NULL, 67, 1, 0.00, 7000.00, 0.00, 4, 3, NULL),
(210, 'Lorys avocado and garlic (340g)', NULL, 1, NULL, 68, 1, 0.00, 12000.00, 0.00, 2, 3, NULL),
(211, 'miku hair food (236ml)', NULL, 4, NULL, 68, 1, 0.00, 7000.00, 0.00, 0, 3, NULL),
(212, 'Eco (340g)', NULL, 1, NULL, 68, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(213, 'Eco argan oil gel (250ml)', NULL, 4, NULL, 68, 1, 0.00, 8000.00, 0.00, 3, 3, NULL),
(214, 'Dark and love (50g)', NULL, 1, NULL, 68, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(215, 'Soft free gel (100ml)', NULL, 4, NULL, 69, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(216, 'Movit spray hair (125ml)', NULL, 4, NULL, 69, 1, 0.00, 7000.00, 0.00, 0, 3, NULL),
(217, 'mouldin gel wax (332g)', NULL, 4, NULL, 69, 1, 0.00, 8000.00, 0.00, 2, 3, NULL),
(218, 'Vatika oil (275g)', NULL, 1, NULL, 69, 1, 0.00, 7000.00, 0.00, 3, 3, NULL),
(219, 'Olive oil spray (85g)', NULL, 1, NULL, 70, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(220, 'Olive oil spray (332g)', NULL, 1, NULL, 70, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(221, 'Tcb oil spray (450g)', NULL, 4, NULL, 70, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(222, 'Tcb spray (85g)', NULL, 4, NULL, 70, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(223, 'Tcb spray (27Oml)', NULL, 4, NULL, 70, 1, 0.00, 7000.00, 0.00, 3, 3, NULL),
(224, 'Soulmate (80g)', NULL, 1, NULL, 71, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(225, 'Soul mate (330g)', NULL, 1, NULL, 71, 1, 0.00, 10000.00, 0.00, 0, 3, NULL),
(226, 'Soulmate (50g)', NULL, 1, NULL, 72, 1, 0.00, 12000.00, 0.00, 2, 3, NULL),
(227, 'Movit hair food (250ml)', NULL, 4, NULL, 73, 1, 4000.00, 7000.00, 0.00, 4, 3, NULL),
(228, 'Blow out (125ml)', NULL, 1, NULL, 73, 1, 3000.00, 3500.00, 0.00, 3, 3, NULL),
(229, 'Blow out (425g)', NULL, 1, NULL, 73, 1, 7000.00, 10000.00, 0.00, 3, 3, NULL),
(230, 'Blow out (212g)', NULL, 1, NULL, 73, 1, 4000.00, 5000.00, 0.00, 3, 3, NULL),
(231, 'Tcb natural (425g)', NULL, 4, NULL, 74, 1, 0.00, 12000.00, 0.00, 3, 3, NULL),
(232, 'Tcb natural (212g)', NULL, 4, NULL, 75, 1, 7000.00, 10000.00, 0.00, 3, 3, NULL),
(233, 'Halisi madogo (70ml)', NULL, 1, NULL, 76, 1, 750.00, 1000.00, 0.00, 10, 3, NULL),
(234, 'Cacha kubwa', NULL, 1, NULL, 76, 1, 375.00, 1500.00, 0.00, 18, 3, NULL),
(235, 'Butter fly', NULL, 1, NULL, 76, 1, 416.00, 1000.00, 0.00, 7, 3, NULL),
(236, 'Dove soap', NULL, 3, 2, 76, 1, 2500.00, 5000.00, 0.00, 0, 3, NULL),
(237, 'Hee cone ndogo', NULL, 1, NULL, 76, 1, 600.00, 2000.00, 0.00, 13, 3, NULL),
(238, 'Vibanio mnati', NULL, 1, NULL, 76, 1, 400.00, 1000.00, 0.00, 12, 3, NULL),
(239, 'Chanuo chapete', NULL, 1, NULL, 76, 1, 200.00, 5000.00, 0.00, 11, 3, NULL),
(240, 'Pini shungi ndogo', NULL, 1, NULL, 76, 1, 10.00, 5000.00, 0.00, 800, 3, NULL),
(241, 'Vibanio vya neno', NULL, 1, NULL, 76, 1, 250.00, 500.00, 0.00, 12, 3, NULL),
(242, 'Eva shower gel cap', NULL, 4, NULL, 76, 1, 400.00, 1000.00, 0.00, 12, 3, NULL),
(243, 'Body lux spray (50ml)', NULL, 1, NULL, 77, 1, 2500.00, 3000.00, 0.00, 5, 3, NULL),
(244, 'Aloe Vera soap', NULL, 3, NULL, 77, 1, 0.00, 1500.00, 0.00, 10, 3, NULL),
(245, 'Chen za pete', NULL, 1, NULL, 77, 1, 400.00, 1500.00, 0.00, 12, 3, NULL),
(246, 'U.S.A soap', NULL, 3, NULL, 77, 1, 0.00, 5000.00, 0.00, 5, 3, NULL),
(247, 'Beauty soap', NULL, 3, NULL, 77, 1, 0.00, 600.00, 0.00, 4, 3, NULL),
(248, 'cacha', NULL, 1, NULL, 77, 1, 200.00, 1000.00, 0.00, 102, 3, NULL),
(249, 'chen stainless steel (300ml)', NULL, 1, NULL, 77, 1, 1000.00, 3000.00, 0.00, 2, 3, NULL),
(250, 'Cacha kubwa', NULL, 1, NULL, 77, 1, 50.00, 1500.00, 0.00, 18, 3, NULL),
(251, 'Softcare pad', NULL, 1, NULL, 77, 1, 1500.00, 2000.00, 0.00, 6, 3, NULL),
(252, 'Family soap', NULL, 3, NULL, 77, 1, 0.00, 600.00, 0.00, 5, 3, NULL),
(253, 'Hair bands', NULL, 4, NULL, 77, 1, 0.00, 1000.00, 0.00, 5, 3, NULL),
(254, 'Heena cone KUCHORA', NULL, 1, NULL, 77, 1, 0.00, 2000.00, 0.00, 10, 3, NULL),
(255, 'Henna cone', NULL, 1, NULL, 77, 1, 0.00, 2000.00, 0.00, 9, 3, NULL),
(256, 'HQ pad (360gr)', NULL, 1, NULL, 77, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(257, 'Imperial soap (360gr)', NULL, 3, NULL, 77, 1, 0.00, 2500.00, 0.00, 3, 3, NULL),
(258, 'Jancho hair dryer', NULL, 4, NULL, 77, 1, 0.00, 2500.00, 0.00, 5, 3, NULL),
(259, 'Glycolic toner', NULL, 1, NULL, 77, 1, 0.00, 25000.00, 0.00, 3, 3, NULL),
(260, 'kiss beauty powder green', NULL, 5, NULL, 77, 1, 0.00, 7000.00, 0.00, 3, 3, NULL),
(261, 'kiss beauty powder', NULL, 5, NULL, 77, 1, 0.00, 7000.00, 0.00, 2, 3, NULL),
(262, 'kiss touch powder', NULL, 5, NULL, 77, 1, 0.00, 7000.00, 0.00, 1, 3, NULL),
(263, 'Kojic white soap', NULL, 3, NULL, 77, 1, 0.00, 4000.00, 0.00, 5, 3, NULL),
(264, 'Kope', NULL, 1, NULL, 77, 1, 500.00, 1000.00, 0.00, 14, 3, NULL),
(265, 'lipstick', NULL, 5, NULL, 77, 1, 0.00, 2000.00, 0.00, 10, 3, NULL),
(266, 'Lipstick kijLlll', NULL, 5, NULL, 77, 1, 0.00, 3000.00, 0.00, 7, 3, NULL),
(267, 'make up kit (110ml)', NULL, 5, NULL, 77, 1, 0.00, 7000.00, 0.00, 1, 3, NULL),
(268, 'micolor powder (330ml)', NULL, 5, NULL, 77, 1, 0.00, 7000.00, 0.00, 2, 3, NULL),
(269, 'Magic lipstick', NULL, 5, NULL, 77, 1, 0.00, 2000.00, 0.00, 21, 3, NULL),
(270, 'Mascala', NULL, 1, NULL, 77, 1, 0.00, 2000.00, 0.00, 4, 3, NULL),
(271, 'DR.s soap', NULL, 3, NULL, 77, 1, 470.00, 600.00, 0.00, 8, 3, NULL),
(272, 'Natural twist (300ml)', NULL, 1, NULL, 77, 1, 8000.00, 10000.00, 0.00, 1, 3, NULL),
(273, 'Pink oil (65ml)', NULL, 1, NULL, 77, 1, 2500.00, 3500.00, 0.00, 1, 3, NULL),
(274, 'Turmeric soap (100g)', NULL, 3, NULL, 77, 1, 2500.00, 3500.00, 0.00, 2, 3, NULL),
(275, 'Turmeric (250ml)', NULL, 1, NULL, 77, 1, 3500.00, 6500.00, 0.00, 2, 3, NULL),
(276, 'wanja mnene', NULL, 1, NULL, 77, 1, 0.00, 1000.00, 0.00, 22, 3, NULL),
(277, 'Wigcap', NULL, 4, NULL, 77, 1, 0.00, 1000.00, 0.00, 23, 3, NULL),
(278, 'Ances soap (175g)', NULL, 3, NULL, 77, 1, 3500.00, 5000.00, 0.00, 4, 3, NULL),
(279, 'Delto soap', NULL, 3, NULL, 77, 1, 2500.00, 3500.00, 0.00, 6, 3, NULL),
(280, 'Paw pwa soap', NULL, 3, NULL, 77, 1, 3500.00, 5000.00, 0.00, 3, 3, NULL),
(281, 'Tetmosol', NULL, 1, NULL, 77, 1, 2500.00, 3000.00, 0.00, 9, 3, NULL),
(282, 'Johnson soap', NULL, 3, 6, 77, 1, 2500.00, 3000.00, 0.00, 6, 3, NULL),
(283, 'Egg yolk soap', NULL, 3, NULL, 77, 1, 3500.00, 5000.00, 0.00, 7, 3, NULL),
(284, 'Covex', NULL, 1, NULL, 77, 1, 0.00, 1500.00, 0.00, 3, 3, NULL),
(285, 'Egg skin', NULL, 1, NULL, 77, 1, 5000.00, 7000.00, 0.00, 3, 3, NULL),
(286, 'Gluter powder', NULL, 5, NULL, 77, 1, 6000.00, 8000.00, 0.00, 3, 3, NULL),
(287, 'Vidonge vya lotion', NULL, 1, NULL, 77, 1, 1200.00, 8000.00, 0.00, 5, 3, NULL),
(288, 'Pen spray', NULL, 1, NULL, 77, 1, 1200.00, 2000.00, 0.00, 15, 3, NULL),
(289, 'Orange brightening gel', NULL, 4, NULL, 77, 1, 10000.00, 15000.00, 0.00, 2, 3, NULL),
(290, 'Pin za shungi', NULL, 1, NULL, 77, 1, 100.00, 300.00, 0.00, 48, 3, NULL),
(291, 'Brazilian hair', NULL, 4, NULL, 77, 1, 850.00, 1500.00, 0.00, 40, 3, NULL),
(292, 'Wanja mwembamba', NULL, 1, NULL, 77, 1, 0.00, 500.00, 0.00, 19, 3, NULL),
(293, 'Bb snail powder (110ml)', NULL, 5, NULL, 77, 1, 0.00, 5000.00, 0.00, 5, 3, NULL),
(294, 'Carambora soap (120ml)', NULL, 3, NULL, 77, 1, 0.00, 4000.00, 0.00, 1, 3, NULL),
(295, 'Omni gold (259ml)', NULL, 1, NULL, 77, 1, 0.00, 7000.00, 0.00, 1, 3, NULL),
(296, 'Rungu soap (150ml)', NULL, 3, NULL, 77, 1, 0.00, 600.00, 0.00, 5, 3, NULL),
(297, 'Vishanga', NULL, 1, NULL, 77, 1, 200.00, 1000.00, 0.00, 32, 3, NULL),
(298, 'Asante ya ukwaju soap (320ml)', NULL, 3, NULL, 77, 1, 2500.00, 3000.00, 0.00, 14, 3, NULL),
(299, 'dark night perfume', NULL, 2, NULL, 78, 1, 30000.00, 35000.00, 0.00, 1, 3, NULL),
(300, 'Monte leone perfume', NULL, 2, NULL, 78, 1, 34000.00, 35000.00, 0.00, 1, 3, NULL),
(301, 'Epic adventure perfume', NULL, 2, NULL, 78, 1, 30000.00, 40000.00, 0.00, 1, 3, NULL),
(302, 'dark fever perfume', NULL, 2, NULL, 78, 1, 22000.00, 30000.00, 0.00, 1, 3, NULL),
(303, 'mousuf perfume', NULL, 2, NULL, 78, 1, 22000.00, 30000.00, 0.00, 0, 3, NULL),
(304, 'kiss of love spray', NULL, 1, NULL, 78, 1, 8500.00, 10000.00, 0.00, 6, 3, NULL),
(305, 'sweet deser spray', NULL, 1, NULL, 78, 1, 7500.00, 10000.00, 0.00, 2, 3, NULL),
(306, 'Doldy', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 2, 3, NULL),
(307, 'Palm spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 1, 3, NULL),
(308, 'Amir spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 1, 3, NULL),
(309, 'instagram spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 1, 3, NULL),
(310, 'smart spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 3, 3, NULL),
(311, 'victory spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 2, 3, NULL),
(312, 'Garax spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 1, 3, NULL),
(313, 'pure love spray', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 2, 3, NULL),
(314, 'tuestday', NULL, 1, NULL, 78, 1, 4500.00, 7000.00, 0.00, 4, 3, NULL),
(315, 'Monday', NULL, 1, NULL, 78, 1, 4500.00, 6000.00, 0.00, 2, 3, NULL),
(316, 'Secret spray', NULL, 1, NULL, 78, 1, 4500.00, 6000.00, 0.00, 0, 3, NULL),
(317, 'Adorabe spray', NULL, 1, NULL, 78, 1, 4500.00, 6000.00, 0.00, 1, 3, NULL),
(318, 'Emperial spray', NULL, 1, NULL, 78, 1, 4500.00, 6000.00, 0.00, 2, 3, NULL),
(319, 'Rebellion spray', NULL, 1, NULL, 78, 1, 4500.00, 6000.00, 0.00, 1, 3, NULL),
(320, 'Mayari  spray', NULL, 1, NULL, 78, 1, 4000.00, 6000.00, 0.00, 1, 3, NULL),
(321, 'Blue space spray', NULL, 1, NULL, 78, 1, 3500.00, 5000.00, 0.00, 1, 3, NULL),
(322, 'Diable blue', NULL, 1, NULL, 78, 1, 3500.00, 5000.00, 0.00, 1, 3, NULL),
(323, 'Active woman', NULL, 1, NULL, 78, 1, 5000.00, 6000.00, 0.00, 3, 3, NULL),
(324, 'Fighting temptation spray', NULL, 1, NULL, 78, 1, 3500.00, 6000.00, 0.00, 3, 3, NULL),
(325, 'Odor epic sprash', NULL, 1, NULL, 78, 1, 3500.00, 5000.00, 0.00, 5, 3, NULL),
(326, 'Rasta', NULL, 1, NULL, 78, 1, 950.00, 1300.00, 0.00, 39, 3, NULL),
(327, 'Top clair plus (450ml)', NULL, 1, NULL, 79, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(328, 'Extra clear carrot (120ml)', NULL, 1, NULL, 79, 1, 3500.00, 5000.00, 0.00, 3, 3, NULL),
(329, 'Actif plus clibetasol', NULL, 1, NULL, 79, 1, 2500.00, 3000.00, 0.00, 2, 3, NULL),
(330, 'B.B Clear (110ml)', NULL, 1, NULL, 79, 1, 5000.00, 7000.00, 0.00, 3, 3, NULL),
(331, 'cT+ (500ml)', NULL, 1, NULL, 79, 1, 0.00, 20000.00, 0.00, 1, 3, NULL),
(332, 'epidem tube', NULL, 1, NULL, 79, 1, 1000.00, 1500.00, 0.00, 16, 3, NULL),
(333, 'Top Lemon (100g)', NULL, 1, NULL, 79, 1, 4500.00, 6000.00, 0.00, 2, 3, NULL),
(334, 'betasol tube (250g)', NULL, 1, NULL, 79, 1, 1000.00, 1500.00, 0.00, 15, 3, NULL),
(335, 'White max clobetasol (50g)', NULL, 1, NULL, 79, 1, 4000.00, 6000.00, 0.00, 3, 3, NULL),
(336, 'whitemax clobetasol (30ml)', NULL, 1, NULL, 79, 1, 2500.00, 3000.00, 0.00, 3, 3, NULL),
(337, 'arena gold beauty cream cream with serum', NULL, 1, NULL, 79, 1, 5000.00, 7000.00, 0.00, 1, 3, NULL),
(338, 'B.B Clear (320ml)', NULL, 1, NULL, 79, 1, 0.00, 25000.00, 0.00, 2, 3, NULL),
(339, 'cheni', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 39, 3, NULL),
(340, 'citrolight (300ml)', NULL, 1, NULL, 79, 1, 0.00, 10000.00, 0.00, 2, 3, NULL),
(341, 'citrolight (200ml)', NULL, 1, NULL, 79, 1, 0.00, 12000.00, 0.00, 5, 3, NULL),
(342, 'Carolight (300ml)', NULL, 1, NULL, 79, 1, 0.00, 10000.00, 0.00, 3, 3, NULL),
(343, 'Carolight (50ml)', NULL, 1, NULL, 79, 1, 0.00, 2500.00, 0.00, 1, 3, NULL),
(344, 'Carolight (120ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(345, 'Carotone (150ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(346, 'Clinic Clear (50ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(347, 'Cocoderm', NULL, 1, NULL, 79, 1, 0.00, 2500.00, 0.00, 2, 3, NULL),
(348, 'diprososn (30ml)', NULL, 1, NULL, 79, 1, 1000.00, 3000.00, 0.00, 5, 3, NULL),
(349, 'Diana water', NULL, 1, NULL, 79, 1, 2500.00, 600.00, 0.00, 7, 3, NULL),
(350, 'eclair 600 (250ml)', NULL, 1, NULL, 79, 1, 0.00, 9000.00, 0.00, 2, 3, NULL),
(351, 'Glorious (360ml)', NULL, 1, NULL, 79, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(352, 'Goldie cream (280ml)', NULL, 1, NULL, 79, 1, 0.00, 1000.00, 0.00, 2, 3, NULL),
(353, 'Intense Flair (150gm)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 0, 3, NULL),
(354, 'Intense Flair (360ml)', NULL, 1, NULL, 79, 1, 0.00, 2500.00, 0.00, 2, 3, NULL),
(355, 'miki (110ml)', NULL, 1, NULL, 79, 1, 0.00, 4000.00, 0.00, 6, 3, NULL),
(356, 'miki clair (330ml)', NULL, 1, NULL, 79, 1, 0.00, 6000.00, 0.00, 1, 3, NULL),
(357, 'miss mimi (30ml)', NULL, 1, NULL, 79, 1, 0.00, 3000.00, 0.00, 11, 3, NULL),
(358, 'perfect white (300ml)', NULL, 1, NULL, 79, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(359, 'prince claire (250ml)', NULL, 1, NULL, 79, 1, 0.00, 8000.00, 0.00, 2, 3, NULL),
(360, 'pure white (500ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(361, 'Princess Claire (500ml)', NULL, 1, NULL, 79, 1, 0.00, 15000.00, 0.00, 2, 3, NULL),
(362, 'sunskin (320ml)', NULL, 1, NULL, 79, 1, 6500.00, 7000.00, 0.00, 1, 3, NULL),
(363, 'Secret white lotion (320ml)', NULL, 1, NULL, 79, 1, 0.00, 10000.00, 0.00, 1, 3, NULL),
(364, 'top Claire (250ml)', NULL, 1, NULL, 79, 1, 0.00, 7000.00, 0.00, 3, 3, NULL),
(365, 'Teint Clair (60ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 3, 3, NULL),
(366, 'paw paw serum (170ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 4, 3, NULL),
(367, 'egg skin serum (60ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 2, 3, NULL),
(368, 'coco pulpy serum (15ml)', NULL, 1, NULL, 79, 1, 0.00, 5000.00, 0.00, 1, 3, NULL),
(369, 'perfect white (500ml)', NULL, 1, NULL, 80, 1, 0.00, 13000.00, 0.00, 1, 3, NULL),
(370, 'Jerry (500ml)', NULL, 1, NULL, 75, 1, 15000.00, 18000.00, 0.00, 1, 3, NULL),
(371, 'miss mimi (50g)', NULL, 1, NULL, 81, 1, 0.00, 6000.00, 0.00, 9, 3, NULL),
(372, 'TOTAL', NULL, 1, NULL, NULL, 1, 853621.00, 3301600.00, 0.00, 2378, 3, NULL);

-- --------------------------------------------------------
-- Table structure for table `purchases`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `purchases`;
CREATE TABLE `purchases` (
  `PurchaseID` int(11) NOT NULL AUTO_INCREMENT,
  `PurchaseDate` datetime DEFAULT current_timestamp(),
  `SupplierID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `TotalAmount` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`PurchaseID`),
  KEY `SupplierID` (`SupplierID`),
  KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `purchases` (`PurchaseID`, `PurchaseDate`, `SupplierID`, `UserID`, `TotalAmount`) VALUES
(1, '2026-07-19 11:20:58', 1, 1, 625000.00);

-- --------------------------------------------------------
-- Table structure for table `purchasedetails`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `purchasedetails`;
CREATE TABLE `purchasedetails` (
  `PurchaseDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `PurchaseID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `BuyingPrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`PurchaseDetailID`),
  KEY `PurchaseID` (`PurchaseID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `sales`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `SaleID` int(11) NOT NULL AUTO_INCREMENT,
  `SaleDate` datetime DEFAULT current_timestamp(),
  `CustomerID` int(11) DEFAULT NULL,
  `UserID` int(11) NOT NULL,
  `TotalAmount` decimal(10,2) DEFAULT 0.00,
  `PaymentMethod` varchar(50) DEFAULT 'Cash',
  PRIMARY KEY (`SaleID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `UserID` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sales` (`SaleID`, `SaleDate`, `CustomerID`, `UserID`, `TotalAmount`, `PaymentMethod`) VALUES
(1, '2026-07-19 11:23:24', 1, 2, 57000.00, 'Cash'),
(2, '2026-07-19 11:29:28', 1, 1, 18000.00, 'M-Pesa'),
(3, '2026-07-19 17:51:16', 2, 1, 18000.00, 'Cash'),
(4, '2026-07-19 17:51:29', NULL, 1, 12000.00, 'Tigo Pesa'),
(5, '2026-07-23 09:27:50', NULL, 1, 3500.00, 'Cash'),
(6, '2026-07-23 09:33:09', NULL, 1, 3500.00, 'Cash'),
(7, '2026-07-23 09:36:47', NULL, 1, 18000.00, 'Cash'),
(8, '2026-07-23 09:38:58', NULL, 1, 3500.00, 'Cash'),
(9, '2026-07-23 10:30:27', NULL, 1, 3500.00, 'Airtel Money'),
(10, '2026-07-23 15:13:52', NULL, 1, 18000.00, 'Cash');

-- --------------------------------------------------------
-- Table structure for table `saledetails`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `saledetails`;
CREATE TABLE `saledetails` (
  `SaleDetailID` int(11) NOT NULL AUTO_INCREMENT,
  `SaleID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `UnitPrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`SaleDetailID`),
  KEY `SaleID` (`SaleID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `sale_items`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items` (
  `ItemID` int(11) NOT NULL AUTO_INCREMENT,
  `SaleID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`ItemID`),
  KEY `SaleID` (`SaleID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table structure for table `expenses`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `ExpenseID` int(11) NOT NULL AUTO_INCREMENT,
  `ExpenseDate` date NOT NULL,
  `Category` varchar(100) NOT NULL,
  `Amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Description` varchar(255) DEFAULT NULL,
  `RecordedBy` varchar(100) NOT NULL DEFAULT 'Admin',
  `LocationID` int(11) NOT NULL DEFAULT 1,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ExpenseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `expenses` (`ExpenseID`, `ExpenseDate`, `Category`, `Amount`, `Description`, `RecordedBy`, `LocationID`) VALUES
(1, CURDATE(), 'Umeme (LUKU)', 15000.00, 'Malipo ya Umeme wa Duka LUKU', 'innocent simfukwe', 1),
(2, CURDATE(), 'Mifuko ya Kufungia Bidhaa', 8000.00, 'Mifuko ya nailoni na karatasi', 'cashier', 1),
(3, CURDATE(), 'Usafi na Maji', 5000.00, 'Dawa ya usafi na maji ya kunywa', 'cashier', 1);

-- --------------------------------------------------------
-- Table structure for table `sales_alert_config`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sales_alert_config`;
CREATE TABLE `sales_alert_config` (
  `ConfigID` int(11) NOT NULL AUTO_INCREMENT,
  `Enabled` tinyint(1) NOT NULL DEFAULT 1,
  `TargetAmount` decimal(12,2) NOT NULL DEFAULT 200000.00,
  `TimeWindowHours` int(11) NOT NULL DEFAULT 24,
  `CheckIntervalMinutes` int(11) NOT NULL DEFAULT 60,
  `LastTriggered` datetime DEFAULT NULL,
  `NotificationMessage` varchar(255) DEFAULT 'Tahadhari: Mauzo hayajafikia lengo la saa 24 zilizopita.',
  PRIMARY KEY (`ConfigID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sales_alert_config` (`ConfigID`, `Enabled`, `TargetAmount`, `TimeWindowHours`, `CheckIntervalMinutes`, `NotificationMessage`) VALUES
(1, 1, 200000.00, 24, 60, 'Tahadhari: Mauzo hayajafikia lengo la TZS 200,000 ndani ya saa 24 zilizopita.');

-- --------------------------------------------------------
-- Triggers
-- --------------------------------------------------------
DELIMITER $$
DROP TRIGGER IF EXISTS `trg_purchase_stock`$$
CREATE TRIGGER `trg_purchase_stock` AFTER INSERT ON `purchasedetails` FOR EACH ROW BEGIN
    UPDATE products
    SET Quantity = Quantity + NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END$$

DROP TRIGGER IF EXISTS `trg_sale_stock`$$
CREATE TRIGGER `trg_sale_stock` AFTER INSERT ON `saledetails` FOR EACH ROW BEGIN
    UPDATE products
    SET Quantity = Quantity - NEW.Quantity
    WHERE ProductID = NEW.ProductID;
END$$
DELIMITER ;

-- --------------------------------------------------------
-- Foreign Keys
-- --------------------------------------------------------
ALTER TABLE `products`
  ADD CONSTRAINT `fk_prod_cat` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prod_brand` FOREIGN KEY (`BrandID`) REFERENCES `brands` (`BrandID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prod_supplier` FOREIGN KEY (`SupplierID`) REFERENCES `suppliers` (`SupplierID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_prod_loc` FOREIGN KEY (`LocationID`) REFERENCES `locations` (`LocationID`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `purchasedetails`
  ADD CONSTRAINT `fk_purch_header` FOREIGN KEY (`PurchaseID`) REFERENCES `purchases` (`PurchaseID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_purch_prod` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

ALTER TABLE `purchases`
  ADD CONSTRAINT `fk_purch_supp` FOREIGN KEY (`SupplierID`) REFERENCES `suppliers` (`SupplierID`),
  ADD CONSTRAINT `fk_purch_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

ALTER TABLE `saledetails`
  ADD CONSTRAINT `fk_sd_sale` FOREIGN KEY (`SaleID`) REFERENCES `sales` (`SaleID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sd_prod` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

ALTER TABLE `sales`
  ADD CONSTRAINT `fk_sales_cust` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_sales_user` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

COMMIT;
