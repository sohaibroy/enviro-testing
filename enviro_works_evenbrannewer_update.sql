-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Aug 03, 2025 at 09:13 PM
-- Server version: 10.9.8-MariaDB-1:10.9.8+maria~ubu2204
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enviro_works`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `credit_card` varchar(19) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `company_id`, `first_name`, `last_name`, `password`, `email`, `phone_number`, `is_active`, `street_address`, `city`, `province`, `postal_code`, `country`, `credit_card`, `job_title`) VALUES
(6, 8, 'Ruan', 'Carvalho', '$2y$12$Gd4fNGiztNLjdNCkNgNf2ORqYF94Xbnpy69pM0RngBAZSy5BMJBCW', '1ruanscarvalho@gmail.com', '8253430302', 1, '', '', '', '', '', NULL, NULL),
(7, 8, 'Cole', 'McArthur', '$2y$12$omK1OAosKAAUaY6m8KipA.9Vym6gX7C0xAPEbspEZXvuwJoZnRNnq', 'crobertmcarthur@gmail.com', '(780) 223-2345', 1, '', '', '', '', '', NULL, NULL),
(8, 8, 'Brendan', 'Spencer', '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'bp.spence@hotmail.com', '(780) 221-2347', 1, '', '', '', '', '', NULL, NULL),
(9, 9, 'Jewelyn', 'Canada', '$2y$12$0k9nk6corif7VNc5jhdrtul1aeQrMcJ6XExNGxuyDZ4gpzmCIpXu.', 'jewelyn@gmail.com', '(780) 222-2222', 1, '', '', '', '', '', NULL, NULL),
(10, 9, 'Yiteng', 'Z.', '$2y$12$1wq7A0O6bskarO0dMQOvrus4Wcixx9y3dp3M0hjk/R2LbAI//BBci', 'yiteng@gmail.com', '(825) 111-1234', 1, '', '', '', '', '', NULL, NULL),
(11, 10, 'Nathan', 'Humphrey', '$2y$12$t0xoAgjUrOu4a5p7nOJHFuOwsDJ4HmTyRY4LLsxai0uVp74kkrRTG', 'nathan@gmail.com', '(780) 111-9876', 1, '', '', '', '', '', NULL, NULL),
(13, 1, 'Ruan', 'DangerField', '$2y$12$SZfqdlSi.nTzfEsBnTl9iuftUOm/kq.nz7o5iNgspAeALzbibnuhG', 'ruanscarvalho@gmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(14, 1, 'Dan', 'DangerField', '$2y$12$0evOSW6456WTvwniSvrAPuKImJKO/2bIuWZv699sMIEtM1iZqgeRK', 'tanner@gmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(15, 1, 'Keller', 'DangerField', '$2y$12$v42j2UbBfMX.Iw.REbKaI.lOoiHRy0eGBVyxNWDoQRX8PYWRegfH.', 'acb@gmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(16, 1, 'Linda', 'DangerField', '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'b@gmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(17, 1, 'Appel', 'DangerField', '$2y$12$/wjtFJJgbzPlbC2NA3dtG.FGU6s8Jml5S0ZR9ZAObOpJ3WbiHvELK', 'g@gmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(18, 1, 'RuanG', 'DangerField', '$2y$12$YLvYwDRpj3tfkZaVbtZdpOhES5XVbdv6CCHoyV1X6FUga.Tp3xJEG', '1bp.spence@hotmail.com', '1-999-999-9999', 0, '', '', '', '', '', NULL, NULL),
(19, 12, 'Richard', 'Robert', '$2y$12$39B/Xdu.sxnTTLWIEjHbKuqGAvvlEFyXj1PgxyKU75gYOcETijone', 'r.robert@gmal.com', '1-222-222-2222', 1, '', '', '', '', '', NULL, NULL),
(22, 1, 'Walkin', 'Joe', '$2y$12$LDpUtKKkadbrJqJV3ygUnewF/Bne7pvkBx2UyrWOEglFeiN30o3Zi', 'J.walkin@a.com', '111-111-1111', 0, '', '', '', '', '', NULL, NULL),
(23, 1, 'Running', 'Dans', '$2y$12$U/34NPVowLN8GH.sf4eSsebQZcpqJzPYzB8b6.7nxF60uGYJDKzPG', 'Drunning@a.com', '111-111-1111', 0, '', '', '', '', '', NULL, NULL),
(24, 1, 'hacker', 'one', '$2y$12$DSG6Dh8IEAXXaGjbYjDA0.8lhC8U0aRtnwiOU0cn.QDka/uYU3V.K', 'admin@hacks.com', '1111111111', 0, '', '', '', '', '', NULL, NULL),
(25, 1, 'John', 'Doe', '$2y$12$LUQ5cUlbTqqSFHaPUvtp7e8SbXwVT.KiNSckCepXxvyN5q243DuSm', 'test860@example.com', NULL, 1, '', '', '', '', '', NULL, NULL),
(26, 1, 'Updated Jester', 'Updated Long', '$2y$12$jLwspj7DB8LsF7MCtbtV3uJlEeBoFJjLMwP9racGayoenB.yH0zie', 'test336@example.com', '234-234-2344', 1, '', '', '', '', '', NULL, NULL),
(27, NULL, NULL, NULL, '$2y$12$1aVFtauRmv1ym9WbEm6TNegaw.TTTWtY7ACFvYyk6DX5zoTQpXCKy', 'rfeest@example.com', NULL, NULL, '', '', '', '', '', NULL, NULL),
(28, 1, 'Walkin', 'Cust', '$2y$12$eTm3WSu8CnofmneoI28AjevBIXhT80m6jOzlrdd4TOzbqH254sCXa', 'w.cust@gmail.com', '111-111-1111', 0, '', '', '', '', '', NULL, NULL),
(29, 1, 'John', 'Doe', '$2y$12$TzoHMKMYaQdHGF0h.h0Ksu1mvQUtXJP9TsV0CQWi1fRFnB5ewQi6i', 'test433@example.com', NULL, 1, '', '', '', '', '', NULL, NULL),
(30, 1, 'Updated Jester', 'Updated Long', '$2y$12$DWfivRse4v7ZakgCEuQKHeshFUG8S.f90DYwwbEhbPO/3Q2ifiNNy', 'test641@example.com', '234-234-2344', 1, '', '', '', '', '', NULL, NULL),
(31, NULL, NULL, NULL, '$2y$12$vdQdcpTefTtYmgZcX0b4A.VMkYy.r8bF/XzkMvQZT9RZcEf.gZbHq', 'brandi46@example.net', NULL, NULL, '', '', '', '', '', NULL, NULL),
(32, NULL, NULL, NULL, '$2y$12$tDES1e/pXRdwBZlOC.epDeWWlClODw08H9D5VHH1V6hDxBRcg.ClC', 'sienna.waelchi@example.net', NULL, NULL, '', '', '', '', '', NULL, NULL),
(33, NULL, NULL, NULL, '$2y$12$Bom5MPpUrA2nCFmMHIWLceCX1ArM5WnvKRLIFzuw3b7/Tt4J/VuRm', 'tina.frami@example.org', NULL, NULL, '', '', '', '', '', NULL, NULL),
(34, NULL, NULL, NULL, '$2y$12$BToKjwOUy.S.vQ6wGXIXeuXzjJUxd6ReoDrF2EgONA7EhZpZqKbPu', 'claudia49@example.org', NULL, NULL, '', '', '', '', '', NULL, NULL),
(35, NULL, NULL, NULL, '$2y$12$1NPSk.IOQjlzNUt0BnzctOeXkDOEAvXyKOiDMGQak93dugsH0iGzu', 'holly.kuhn@example.net', NULL, NULL, '', '', '', '', '', NULL, NULL),
(36, NULL, NULL, NULL, '$2y$12$eXQhOBT29tYlpCbsVTEXkeB3J7iYLn6Y1kCqJAolKNwbxDVNsName', 'vpacocha@example.com', NULL, NULL, '', '', '', '', '', NULL, NULL),
(37, NULL, NULL, NULL, '$2y$12$EQmftVmgGGV8Y1jY0cBQEeFlxs3yQ9j78qpTIoyVrZCbgo0911RMG', 'ykuhn@example.com', NULL, NULL, '', '', '', '', '', NULL, NULL),
(38, NULL, NULL, NULL, '$2y$12$wF6y4r6KDcNNksl6Wl5Og.Lsj/gLLSRHpWKSctPnMw7.rd16O8XZi', 'dstoltenberg@example.org', NULL, NULL, '', '', '', '', '', NULL, NULL),
(39, NULL, NULL, NULL, '$2y$12$tF8eb0QbpUFb55EuZWn7tuBV57tmy73OciiSa.dKxROKNqKcsB8Pq', 'salvador50@example.org', NULL, NULL, '', '', '', '', '', NULL, NULL),
(40, 1, 'John', 'Doe', '$2y$12$sHCTrPP8Nm1gktTzT.zSxuFFAFPlY.kAV54SEakSe5SJ8fVlv7rfy', 'test650@example.com', NULL, 1, '', '', '', '', '', NULL, NULL),
(41, 1, 'Updated Jester', 'Updated Long', '$2y$12$wWnPCYMxC.MlpSXY4Foai.n/r0gwyPhGSbxuJFSrwRthzUPjrkYsO', 'test838@example.com', '234-234-2344', 1, '', '', '', '', '', NULL, NULL),
(42, NULL, NULL, NULL, '$2y$12$f2bH5hl/9g.Onxi5RfAznO1Gl5bzNDbRtH107Ax2CYf3FPuceX1/a', 'rebeka.rutherford@example.org', NULL, NULL, '', '', '', '', '', NULL, NULL),
(43, 1, 'John', 'Smith', '$2y$12$hZ0dZPVmxAc8F/FAVI/cgu2UvEc0Dw/Rr8mEhx7EJOBRAGyPpWsO2', 'johnsmith@example.com', '7801234567', 0, '', '', '', '', '', NULL, NULL),
(55, NULL, 'Bryce', 'Fisher', NULL, 's@gmail.com', '5879742435', 1, '8938 83 Avenue Northwest', 'Edmonton', 'AB', 'T6C 1B5', 'Canada', '', NULL),
(56, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(57, NULL, 'Ruan', 'Carvalho', NULL, '1ruanscarvalho@gmail.com', '8253430302', 1, '', '', '', '', '', '', NULL),
(58, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(59, NULL, 'Ruan', 'Carvalho', NULL, '1ruanscarvalho@gmail.com', '8253430302', 1, '', '', '', '', '', '', NULL),
(60, NULL, 'Bryce', 'Fisher', NULL, 's@gmail.com', '5879742435', 1, '8938 83 Avenue Northwest', 'Edmonton', 'AB', 'T6C 1B5', 'Canada', '', NULL),
(61, NULL, 'Bryce', 'Fisher', NULL, 's@gmail.com', '5879742435', 1, '8938 83 Avenue Northwest', 'Edmonton', 'AB', 'T6C 1B5', 'Canada', '', NULL),
(62, NULL, 'Bryce', 'Fisher', NULL, 'bfisher20@nait.ca', '7777777894', 1, '9137 83 avenue', 'Edmonton', 'Alberta', 't6c1b6', 'CA', '', NULL),
(63, NULL, 'bryce', 'f', NULL, 'b@gmail.com', '5875011111', 1, '11  went', 'Edmonotn', 'a', 't6c1b6', 'ca', '', NULL),
(64, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(65, NULL, 'Bryce', 'Fisher', NULL, 'bfisher20@nait.ca', '7778887894', 1, '9137 83 avenue', 'Edmonton', 'Alberta', 't6c1b6', 'CA', '', NULL),
(66, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(67, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(68, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(69, NULL, 'Ruan', 'Carvalho', NULL, '1ruanscarvalho@gmail.com', '8253430302', 1, '', '', '', '', '', '', NULL),
(71, NULL, 'Test', 'User', NULL, 'test@example.com', '1234567890', 1, '123 Main St', 'Testville', 'AB', 'T3X 0B3', 'Canada', '4242424242424242', NULL),
(73, NULL, 'Test', 'User', NULL, 'test@example.com', '1234567890', 1, '123 Main St', 'Testville', 'AB', 'T3X 0B3', 'Canada', '4242424242424242', NULL),
(74, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(75, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(76, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(77, NULL, '', '', NULL, '', '', 1, '', '', '', '', '', '', NULL),
(78, NULL, 'Bryce', 'Fisher', NULL, 'bfisher20@nait.ca', '8253430302', 1, '9137 83 avenue', 'Edmonton', 'Alberta', 't6c1b6', 'CA', '', NULL),
(80, NULL, 'Bryce', 'Fisher', NULL, 's@gmail.com', '5879742435', 1, '8938 83 Avenue Northwest', 'Edmonton', 'AB', 'T6C 1B5', 'Canada', '', NULL),
(81, 1, 'Unknown', 'Person', '$2y$12$6ymwOBriFExxauMxl7BRFeEihsF4NwOxQo.NqoYhgQme/nqFjXFOC', 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', NULL, NULL),
(104, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(105, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(106, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(107, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(108, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(109, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(110, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(111, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(112, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(113, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(114, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(115, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(116, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(117, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(118, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(119, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(120, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(121, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(122, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(123, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(124, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(125, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(126, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(127, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(128, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(129, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(130, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(131, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(132, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(133, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(134, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(135, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(136, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(137, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(138, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(139, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(140, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(141, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(142, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(143, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(144, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(145, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(146, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(147, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(148, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(149, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(150, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(151, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(152, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(153, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(154, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(155, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(156, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(157, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(158, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(159, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(160, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(161, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(162, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(163, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(164, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(165, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(166, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(167, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(168, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(169, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(170, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(171, NULL, '', '', NULL, 'admin@gmail.com', '', 1, '', '', '', '', '', '', NULL),
(172, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(173, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(174, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(175, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL),
(176, NULL, 'Unknown', 'Person', NULL, 'roysohaib@hotmail.com', '7801234567', 1, '123 Smackdown Street', 'Edmonton', 'AB', 'T6L2X8', 'Canada', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `password`, `email`) VALUES
(1, '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'admin@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `analytes`
--

DROP TABLE IF EXISTS `analytes`;
CREATE TABLE IF NOT EXISTS `analytes` (
  `analyte_id` int(11) NOT NULL AUTO_INCREMENT,
  `analyte_name` varchar(100) DEFAULT NULL,
  `cas_number` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `analytes`
--

INSERT INTO `analytes` (`analyte_id`, `analyte_name`, `cas_number`, `is_active`) VALUES
(27, 'Algae enumeration', '123-123', 1),
(28, 'Allergen', '22-88-654', 1),
(29, 'Asbestos', '1332-21-4', 1),
(30, 'Fly/Coal Ash', '331-7446', 1),
(31, 'Test Analyte', '123-4567', 1),
(32, 'Test Analyte', '123-4567', 1),
(33, 'Test Analyte', '123-4567', 1),
(34, 'Test Analyte', '123-4567', 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `analyte_id` int(11) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `technique` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `analyte_id` (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `analyte_id`, `category_name`, `technique`, `is_active`) VALUES
(3, NULL, NULL, NULL, NULL),
(9, 27, 'Other\r\n', 'Light Microscopy\r\n', 1),
(10, 28, 'Allergens\r\n', 'MARIA, ELISA\r\n', 1),
(11, 29, 'Asbestos\r\n', 'PCM\r\n', 1),
(12, 29, 'Asbestos', 'TEM\r\n', 1),
(13, 30, 'Other\r\n', 'PLM/TEM\r\n', 1),
(14, NULL, 'Test Category', 'Test Technique', NULL),
(15, NULL, 'Test Category', 'Test Technique', NULL),
(16, NULL, 'Test Category', 'Test Technique', NULL),
(17, NULL, 'Test Category', 'Test Technique', 1),
(18, NULL, 'Test Category', 'Test Technique', 1),
(19, NULL, 'Test Category', 'Test Technique', 1),
(20, 27, 'Test Category', 'Test Technique', 1),
(21, NULL, 'Test Category', 'Test Technique', 1),
(22, 27, 'Test Category', 'Test Technique', 1),
(23, NULL, 'Test Category', 'Test Technique', 1),
(24, 27, 'Test Category', 'Test Technique', 1),
(25, NULL, 'Test Category', 'Test Technique', 1);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `company_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) DEFAULT NULL,
  `company_phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `company_name`, `company_phone`, `address`, `is_active`) VALUES
(1, 'Walking Customer', '', '18949 111 Ave NW, Edmonton AB T5S 2X4 ', 1),
(8, 'PBR Laboratories Inc', '(780) 450-3957', '9960 67 Ave NW', 1),
(9, 'Bureau Veritas', '780) 577-7100', '4326 76 Ave NW, Edmonton, AB T6B 2T8', 1),
(10, 'DynaLIFE Medical Labs', '(780) 451-3702', '200 10150 102 Street, Edmonton, AB T5J 5E2', 1),
(11, 'Biogeochemical Analytical Service Laboratory', '(780) 492-5497', '2-255, Edmonton, AB T6G 2H7', 1),
(12, 'MacDonalds', '1-780-333-1231', '123 Suryp St Edmonton Alberta f1f-2f1', 1),
(13, 'Test Company', '123456789', '123 Test St', 1),
(14, 'Updated Company', '555555555', '789 Updated St', 0),
(15, 'Test Company', '123456789', '123 Test St', 1),
(16, 'Updated Company', '555555555', '789 Updated St', 0),
(17, 'Test Company', '123456789', '123 Test St', 1),
(18, 'Updated Company', '555555555', '789 Updated St', 0);

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `equipment_id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `specsheet` varchar(255) DEFAULT NULL,
  `daily_cost` float NOT NULL,
  `available_quantity` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipment_id`, `equipment_name`, `description`, `image_path`, `specsheet`, `daily_cost`, `available_quantity`, `is_active`, `type_id`) VALUES
(1, 'Zefon Escort Elf Pump', NULL, 'Zefron-Escort-Elf-Pump.jpg', NULL, 50, 14, 1, 1),
(2, 'SKC Aircheck XR5000', NULL, 'SKC-Aircheck-XR5000.jpg', NULL, 50, 6, 1, 2),
(3, 'Gilair3', NULL, 'gilian-gilair-3.webp', NULL, 50, 9, 1, 2),
(4, 'SKC Pocket Pump (210-1000 Series)', NULL, 'SKC-Pocket-Pump.jpeg', NULL, 50, 3, 1, 1),
(5, 'Zefon Diaphragm Pump', NULL, 'Zefon-Diaphragm-Pump.jpg', NULL, 50, 14, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_attributes`
--

DROP TABLE IF EXISTS `equipment_attributes`;
CREATE TABLE IF NOT EXISTS `equipment_attributes` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_type_id` int(11) NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_data_type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  KEY `fk_equipment_type_id` (`equipment_type_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_attributes`
--

INSERT INTO `equipment_attributes` (`attribute_id`, `equipment_type_id`, `attribute_name`, `attribute_data_type`) VALUES
(1, 1, 'Flow Rate', 'string'),
(2, 1, 'Low Flow Adapter', 'string');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_details`
--

DROP TABLE IF EXISTS `equipment_details`;
CREATE TABLE IF NOT EXISTS `equipment_details` (
  `serial_number` varchar(50) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `status` enum('available','rented','maintenance','retired') NOT NULL DEFAULT 'available',
  `serial_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`serial_id`),
  KEY `equipment_id` (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_details`
--

INSERT INTO `equipment_details` (`serial_number`, `equipment_id`, `status`, `serial_id`) VALUES
('ZEF-1001', 1, 'rented', 1),
('ZEF-1002', 1, 'rented', 2),
('ZEF-1003', 1, 'rented', 3),
('ZEF-1004', 1, 'rented', 4),
('ZEF-1005', 1, 'rented', 5),
('ZEF-1006', 1, 'rented', 6),
('ZEF-1007', 1, 'rented', 7),
('ZEF-1008', 1, 'rented', 8),
('ZEF-1009', 1, 'rented', 9),
('ZEF-1010', 1, 'rented', 10),
('SKC-2001', 2, 'rented', 11),
('SKC-2002', 2, 'rented', 12),
('SKC-2003', 2, 'rented', 13),
('SKC-2004', 2, 'rented', 14),
('SKC-2005', 2, 'rented', 15),
('SKC-2006', 2, 'rented', 16),
('GIL-3001', 3, 'rented', 17),
('GIL-3002', 3, 'rented', 18),
('GIL-3003', 3, 'rented', 19),
('GIL-3004', 3, 'rented', 20),
('GIL-3005', 3, 'rented', 21),
('GIL-3006', 3, 'rented', 22),
('SKC-4001', 4, 'rented', 26),
('SKC-4002', 4, 'rented', 27),
('SKC-4003', 4, 'available', 28),
('ZDP-5001', 5, 'available', 29),
('ZDP-5002', 5, 'available', 30),
('ZDP-5003', 5, 'rented', 31),
('ZDP-5004', 5, 'rented', 32),
('ZDP-5005', 5, 'rented', 33),
('ZDP-5006', 5, 'rented', 34),
('ZDP-5007', 5, 'rented', 35),
('ZDP-5008', 5, 'rented', 36),
('ZDP-5009', 5, 'available', 37),
('ZDP-5010', 5, 'available', 38),
('ZDP-5011', 5, 'available', 39),
('ZDP-5012', 5, 'available', 40),
('ZDP-5013', 5, 'available', 41),
('ZDP-5014', 5, 'available', 42);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_types`
--

DROP TABLE IF EXISTS `equipment_types`;
CREATE TABLE IF NOT EXISTS `equipment_types` (
  `equipment_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_type_name` varchar(100) NOT NULL,
  PRIMARY KEY (`equipment_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_types`
--

INSERT INTO `equipment_types` (`equipment_type_id`, `equipment_type_name`) VALUES
(1, 'Pump'),
(2, 'Calibrator'),
(3, 'Cyclone'),
(4, 'Sample Holder'),
(5, 'Tubing');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_values`
--

DROP TABLE IF EXISTS `equipment_values`;
CREATE TABLE IF NOT EXISTS `equipment_values` (
  `equipment_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value` varchar(100) DEFAULT NULL,
  KEY `fk_attribute_id` (`attribute_id`),
  KEY `fk_equipment_id` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_values`
--

INSERT INTO `equipment_values` (`equipment_id`, `attribute_id`, `attribute_value`) VALUES
(1, 1, '0.5 - 3.0 L/min'),
(1, 2, 'Available'),
(2, 1, '1.0 - 5.0 L/min'),
(2, 2, 'Available'),
(3, 1, '0.5 - 3.0 L/min'),
(3, 2, 'Available'),
(4, 1, '0.02 - 0.225 L/min'),
(4, 2, NULL),
(5, 1, '3.0 - 14 L/min'),
(5, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `event_execution_log`
--

DROP TABLE IF EXISTS `event_execution_log`;
CREATE TABLE IF NOT EXISTS `event_execution_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(255) DEFAULT NULL,
  `execution_time` datetime DEFAULT NULL,
  `rows_deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_execution_log`
--

INSERT INTO `event_execution_log` (`id`, `event_name`, `execution_time`, `rows_deleted`) VALUES
(1, 'DeleteExpiredTokensEvent', '2024-04-03 15:37:32', NULL),
(2, 'DeleteExpiredTokensEvent', '2024-04-03 15:38:32', NULL),
(3, 'DeleteExpiredTokensEvent', '2024-04-03 15:41:32', 0),
(4, 'DeleteExpiredTokensEvent', '2024-04-03 15:42:32', 0),
(5, 'DeleteExpiredTokensEvent', '2024-04-03 15:43:32', 1),
(6, 'DeleteExpiredTokensEvent', '2024-04-03 15:44:32', 0),
(7, 'DeleteExpiredTokensEvent', '2024-04-03 15:45:32', 0),
(8, 'DeleteExpiredTokensEvent', '2024-04-03 15:46:32', 0),
(9, 'DeleteExpiredTokensEvent', '2024-04-03 15:46:58', 0),
(10, 'DeleteExpiredTokensEvent', '2024-04-03 15:46:59', 0),
(11, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:00', 0),
(12, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:01', 0),
(13, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:02', 0),
(14, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:03', 0),
(15, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:04', 0),
(16, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:05', 0),
(17, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:06', 0),
(18, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:07', 0),
(19, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:08', 0),
(20, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:09', 0),
(21, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:10', 0),
(22, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:11', 0),
(23, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:12', 0),
(24, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:13', 0),
(25, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:14', 0),
(26, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:15', 0),
(27, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:16', 0),
(28, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:17', 0),
(29, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:18', 0),
(30, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:19', 0),
(31, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:20', 0),
(32, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:21', 0),
(33, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:22', 0),
(34, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:23', 0),
(35, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:24', 0),
(36, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:25', 0),
(37, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:26', 0),
(38, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:27', 0),
(39, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:28', 0),
(40, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:29', 0),
(41, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:30', 0),
(42, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:31', 0),
(43, 'DeleteExpiredTokensEvent', '2025-06-28 03:33:00', 19);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `feedback_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`feedback_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `methods`
--

DROP TABLE IF EXISTS `methods`;
CREATE TABLE IF NOT EXISTS `methods` (
  `method_id` int(11) NOT NULL AUTO_INCREMENT,
  `analyte_id` int(11) DEFAULT NULL,
  `method_name` varchar(100) DEFAULT NULL,
  `matrix` varchar(100) DEFAULT NULL,
  `media` varchar(100) DEFAULT NULL,
  `measurement` varchar(100) DEFAULT NULL,
  `sample_rate` varchar(100) DEFAULT NULL,
  `limit_of_quantification` varchar(100) DEFAULT NULL,
  `general_comments` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`method_id`),
  KEY `analyte_id` (`analyte_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `methods`
--

INSERT INTO `methods` (`method_id`, `analyte_id`, `method_name`, `matrix`, `media`, `measurement`, `sample_rate`, `limit_of_quantification`, `general_comments`, `is_active`) VALUES
(13, 27, 'Algae Enumeration In Water', 'Water', 'Bottle', '10 - 100 mL', 'N/A', '4 organisms per ml', NULL, 1),
(14, 28, 'Cat, Fel d1 (sub-contracted)', 'Dust', 'Cassette', '>50 mg', '>2 min. (vacuum)', '0.02-0.8 ng/ml', NULL, 1),
(15, 28, 'Cockroach, Bla g2 (sub-contracted)', 'Dust', 'Cassette', '>50 mg', '>2 min. (vacuum)', '0.98-2 ng/ml', NULL, 1),
(16, 28, 'Dog, Can f1 (sub-contracted)', 'Dust', 'Cassette', '>50 mg', '>2 min. (vacuum)', '0.06-2 ng/ml', NULL, 1),
(17, 29, 'OSHA ID-160', 'Air', 'Cassette', '<50 to >2000 L', '0.5-16.0 LPM', 'Volume Dependent', NULL, 1),
(18, 29, 'OSHA with TWA', 'Air', 'Cassette', '<50 to >2000 L', '0.5-16.0 LPM', 'Volume Dependent', NULL, 1),
(19, 29, 'AHERA (40 CFR Part 763)', 'Air', 'Cassette', '600-1800 L, Ideally >1200 L', '<10.0 LPM', 'Volume Dependent', NULL, 1),
(20, 30, 'MACP', 'Bulk', 'N/A', '>1.0 g', 'N/A', '1%', NULL, 1),
(21, 30, 'MACP', 'Bulk', 'N/A', '>1.0 g', 'N/A', '1%', NULL, 1),
(22, 27, 'Lead in Air', 'Water', 'Workplace Air', 'Test', '1', '0.0pq', 'test', 1),
(23, 27, 'Niosh', 'Soil', 'Cassette', '1kg', '1', '0.0pq', NULL, 1),
(24, 27, 'Test Method', 'Test Matrix', 'Test Media', 'Test Measurement', 'Test Sample Rate', 'Test Limit of Quantification', 'Test General Comments', 1),
(25, 27, 'Test Method', 'Test Matrix', 'Test Media', 'Test Measurement', 'Test Sample Rate', 'Test Limit of Quantification', 'Test General Comments', 1),
(26, 27, 'Test Method', 'Test Matrix', 'Test Media', 'Test Measurement', 'Test Sample Rate', 'Test Limit of Quantification', 'Test General Comments', 1),
(27, 27, 'Test Method', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(28, 27, 'Test Method', 'Test Matrix', 'Test Media', 'Test Measurement', 'Test Sample Rate', 'Test Limit of Quantification', 'Test General Comments', 1);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(3, '2025_07_27_041321_add_gst_and_total_amount_to_orders_table', 2),
(4, '2024_02_16_210142_admins', 3),
(5, '2024_03_04_211004_accounts', 3),
(6, '2024_03_04_211054_analytes', 3),
(7, '2024_03_04_211109_categories', 3),
(8, '2024_03_04_211119_companies', 3),
(9, '2024_03_04_211130_methods', 3),
(10, '2024_03_04_211138_orders', 3),
(11, '2024_03_04_211151_order_details', 3),
(12, '2024_03_04_211201_price_overrides', 3),
(13, '2024_03_04_211212_turn_around_times', 3),
(14, '2025_02_13_013412_create_feedback_table', 3),
(15, '2025_02_21_201306_create_rentals_table', 3),
(16, '2025_02_21_202617_create_rental_details_table', 3),
(17, '2025_02_21_202741_create_equipment_table', 3),
(18, '2025_02_25_202646_create_equipment_types_table', 3),
(19, '2025_02_25_202658_create_equipment_attributes_table', 3),
(20, '2025_02_25_202713_create_equipment_values_table', 3),
(21, '2025_04_08_020011_create_payments_table', 3),
(22, '2025_04_08_020018_create_transactions_table', 3),
(23, '2025_04_08_020028_create_equipment_details_table', 3),
(24, '2025_06_18_211753_add_image_url_to_equipment_table', 3),
(25, '2025_07_27_222207_add_gst_and_total_to_orders_table', 3),
(26, '2025_07_28_153008_create_orders_table', 4),
(29, '2025_07_28_165630_create_order_details_table', 1),
(30, '2025_07_28_154614_create_order_equipment_table', 5),
(31, '2025_07_29_174154_add_status_to_orders_table', 6),
(32, '2025_07_29_175856_drop_is_active_from_orders_table', 7),
(33, '2025_07_30_041949_add_payment_status_to_orders_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `subtotal` double(8,2) DEFAULT NULL,
  `gst` double(8,2) DEFAULT NULL,
  `total_amount` double(8,2) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `transaction_id`, `order_date`, `subtotal`, `gst`, `total_amount`, `status`, `created_at`, `updated_at`, `payment_status`) VALUES
(1, 1001, '2025-07-28 15:51:08', 250.00, 12.50, 262.50, 2, '2025-07-28 15:51:08', '2025-07-28 15:51:08', 'pending'),
(2, 62, '2025-07-28 16:39:03', 650.00, 32.50, 682.50, 2, NULL, NULL, 'pending'),
(3, 63, '2025-07-28 16:45:48', 450.00, 22.50, 472.50, 2, NULL, NULL, 'pending'),
(4, 64, '2025-07-28 16:51:01', 500.00, 25.00, 525.00, 2, NULL, NULL, 'pending'),
(6, 66, '2025-07-28 17:27:48', 450.00, 22.50, 472.50, 2, NULL, NULL, 'pending'),
(7, 67, '2025-07-28 23:59:31', 800.00, 40.00, 840.00, 1, NULL, NULL, 'pending'),
(8, 68, '2025-07-29 18:44:46', 400.00, 20.00, 420.00, 0, NULL, NULL, 'pending'),
(9, 69, '2025-07-29 20:56:30', 400.00, 20.00, 420.00, 0, NULL, NULL, 'pending'),
(10, 70, '2025-07-29 21:02:32', 400.00, 20.00, 420.00, 0, NULL, NULL, 'pending'),
(11, 71, '2025-07-29 21:05:34', 400.00, 20.00, 420.00, 0, NULL, NULL, 'pending'),
(12, 72, '2025-07-29 21:08:14', 400.00, 20.00, 420.00, 0, NULL, NULL, 'pending'),
(13, 73, '2025-07-29 21:13:35', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(14, 74, '2025-07-29 21:27:35', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(15, 75, '2025-07-29 21:29:48', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(16, 76, '2025-07-29 21:34:46', 200.00, 10.00, 210.00, 0, NULL, NULL, 'pending'),
(17, 77, '2025-07-29 21:37:59', 200.00, 10.00, 210.00, 0, NULL, NULL, 'pending'),
(18, 78, '2025-07-29 22:47:57', 300.00, 15.00, 315.00, 0, NULL, NULL, 'pending'),
(19, 79, '2025-07-30 03:39:43', 250.00, 12.50, 262.50, 0, NULL, NULL, 'pending'),
(20, 80, '2025-07-30 03:49:10', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(21, 81, '2025-07-30 03:59:57', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(22, 82, '2025-07-30 04:07:56', 200.00, 10.00, 210.00, 0, NULL, NULL, 'pending'),
(23, 83, '2025-07-30 04:17:51', 350.00, 17.50, 367.50, 0, NULL, NULL, 'pending'),
(24, 84, '2025-07-30 04:27:54', 350.00, 17.50, 367.50, 0, NULL, NULL, 'paid'),
(25, NULL, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(26, NULL, NULL, 682.50, 34.12, NULL, 0, NULL, NULL, 'pending'),
(27, NULL, NULL, 682.50, 34.12, NULL, 0, NULL, NULL, 'pending'),
(28, 93, NULL, 682.50, 34.12, NULL, 0, NULL, NULL, 'pending'),
(29, 94, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(30, 95, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(31, 96, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(32, 97, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(33, 98, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(34, 99, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(35, 100, NULL, 367.50, 18.38, NULL, 0, NULL, NULL, 'pending'),
(36, 102, '2025-07-30 23:27:33', 367.50, 18.38, 367.50, 0, '2025-07-30 23:27:33', '2025-07-30 23:27:33', 'paid'),
(37, 103, '2025-07-30 23:29:31', 210.00, 10.50, 210.00, 0, '2025-07-30 23:29:31', '2025-07-30 23:29:31', 'paid'),
(40, 110, '2025-07-31 00:29:32', 262.50, 13.13, 262.50, 0, '2025-07-31 00:29:32', '2025-07-31 00:29:32', 'paid'),
(41, 111, '2025-07-31 00:41:03', 315.00, 15.75, 315.00, 0, '2025-07-31 00:41:03', '2025-07-31 00:41:03', 'paid'),
(42, 112, '2025-07-31 00:48:39', 210.00, 10.50, 210.00, 0, '2025-07-31 00:48:39', '2025-07-31 00:48:39', 'paid'),
(43, 113, '2025-07-31 00:56:08', 210.00, 10.50, 210.00, 0, '2025-07-31 00:56:08', '2025-07-31 00:56:08', 'paid'),
(44, 114, '2025-07-31 02:36:09', 210.00, 10.50, 210.00, 0, '2025-07-31 02:36:09', '2025-07-31 02:36:09', 'paid'),
(48, 118, '2025-07-31 02:57:01', 367.50, 18.38, 367.50, 0, '2025-07-31 02:57:01', '2025-07-31 02:57:01', 'paid'),
(49, 120, '2025-07-31 03:05:01', 472.50, 23.63, 472.50, 0, '2025-07-31 03:05:01', '2025-07-31 03:05:01', 'paid'),
(50, 121, '2025-07-31 03:14:10', 420.00, 21.00, 420.00, 0, '2025-07-31 03:14:10', '2025-07-31 03:14:10', 'paid'),
(51, 122, '2025-07-31 03:25:30', 420.00, 21.00, 420.00, 0, '2025-07-31 03:25:30', '2025-07-31 03:25:30', 'paid'),
(52, 123, '2025-07-31 03:32:33', 367.50, 18.38, 367.50, 0, '2025-07-31 03:32:33', '2025-07-31 03:32:33', 'paid'),
(53, 124, '2025-07-31 03:48:47', 157.50, 7.88, 157.50, 0, '2025-07-31 03:48:47', '2025-07-31 03:48:47', 'paid'),
(54, 125, '2025-07-31 03:56:13', 157.50, 7.88, 157.50, 1, '2025-07-31 03:56:13', '2025-07-31 03:56:13', 'paid'),
(55, 126, '2025-07-31 04:10:46', 315.00, 15.75, 315.00, 2, '2025-07-31 04:10:46', '2025-07-31 04:10:46', 'paid'),
(56, 128, '2025-08-01 23:19:27', 210.00, 10.50, 210.00, 2, '2025-08-01 23:19:27', '2025-08-01 23:19:27', 'paid'),
(57, 129, '2025-08-02 20:58:45', 367.50, 18.38, 367.50, 2, '2025-08-02 20:58:45', '2025-08-02 20:58:45', 'paid'),
(58, 130, '2025-08-03 01:51:04', 262.50, 13.13, 262.50, 1, '2025-08-03 01:51:04', '2025-08-03 01:51:04', 'paid'),
(59, 131, '2025-08-03 03:15:26', 630.00, 31.50, 630.00, 2, '2025-08-03 03:15:26', '2025-08-03 03:15:26', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `method_id` int(11) DEFAULT NULL,
  `analyte_id` int(11) DEFAULT NULL,
  `turn_around_id` bigint(20) UNSIGNED DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `required_quantity` int(11) NOT NULL DEFAULT 1,
  `required_pumps` int(11) DEFAULT NULL,
  `required_media` varchar(255) DEFAULT NULL,
  `customer_comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `method_id`, `analyte_id`, `turn_around_id`, `price`, `required_quantity`, `required_pumps`, `required_media`, `customer_comment`, `created_at`, `updated_at`) VALUES
(2, 6, NULL, NULL, 26, 250.00, 1, 0, NULL, NULL, '2025-07-28 17:27:48', '2025-07-28 17:27:48'),
(3, 7, NULL, NULL, 26, 250.00, 1, 0, NULL, NULL, '2025-07-28 23:59:31', '2025-07-28 23:59:31'),
(4, 8, NULL, NULL, 26, 250.00, 1, 0, NULL, NULL, '2025-07-29 18:44:46', '2025-07-29 18:44:46'),
(5, 9, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 20:56:30', '2025-07-29 20:56:30'),
(6, 10, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:02:32', '2025-07-29 21:02:32'),
(7, 11, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:05:34', '2025-07-29 21:05:34'),
(8, 12, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:08:14', '2025-07-29 21:08:14'),
(9, 13, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:13:35', '2025-07-29 21:13:35'),
(10, 14, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:27:35', '2025-07-29 21:27:35'),
(11, 15, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:29:48', '2025-07-29 21:29:48'),
(12, 16, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:34:46', '2025-07-29 21:34:46'),
(13, 17, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-29 21:37:59', '2025-07-29 21:37:59'),
(14, 18, NULL, NULL, 27, 300.00, 1, 0, NULL, NULL, '2025-07-29 22:47:57', '2025-07-29 22:47:57'),
(15, 19, NULL, NULL, 26, 250.00, 1, 0, NULL, NULL, '2025-07-30 03:39:43', '2025-07-30 03:39:43'),
(16, 20, NULL, NULL, 28, 350.00, 1, 0, NULL, NULL, '2025-07-30 03:49:10', '2025-07-30 03:49:10'),
(17, 21, NULL, NULL, 28, 350.00, 1, 0, NULL, NULL, '2025-07-30 03:59:57', '2025-07-30 03:59:57'),
(18, 22, NULL, NULL, 13, 200.00, 1, 0, NULL, NULL, '2025-07-30 04:07:56', '2025-07-30 04:07:56'),
(19, 23, NULL, NULL, 28, 350.00, 1, 0, NULL, NULL, '2025-07-30 04:17:51', '2025-07-30 04:17:51'),
(20, 24, NULL, NULL, 28, 350.00, 1, 0, NULL, NULL, '2025-07-30 04:27:54', '2025-07-30 04:27:54'),
(21, 42, NULL, NULL, NULL, 200.00, 1, NULL, NULL, NULL, '2025-07-31 00:48:39', '2025-07-31 00:48:39'),
(22, 43, NULL, NULL, NULL, 200.00, 1, NULL, NULL, NULL, '2025-07-31 00:56:08', '2025-07-31 00:56:08'),
(23, 44, NULL, NULL, NULL, 200.00, 1, NULL, NULL, NULL, '2025-07-31 02:36:09', '2025-07-31 02:36:09'),
(27, 48, NULL, NULL, NULL, 200.00, 1, NULL, NULL, NULL, '2025-07-31 02:57:01', '2025-07-31 02:57:01'),
(28, 49, NULL, NULL, NULL, 300.00, 1, NULL, NULL, NULL, '2025-07-31 03:05:01', '2025-07-31 03:05:01'),
(29, 50, NULL, NULL, NULL, 300.00, 1, NULL, NULL, NULL, '2025-07-31 03:14:10', '2025-07-31 03:14:10'),
(30, 51, NULL, NULL, NULL, 250.00, 1, NULL, NULL, NULL, '2025-07-31 03:25:30', '2025-07-31 03:25:30'),
(31, 52, NULL, NULL, NULL, 200.00, 1, NULL, NULL, NULL, '2025-07-31 03:32:33', '2025-07-31 03:32:33'),
(32, 55, NULL, NULL, 27, 300.00, 1, NULL, NULL, NULL, '2025-07-31 04:10:46', '2025-07-31 04:10:46'),
(33, 56, NULL, NULL, 13, 200.00, 1, 2, '2', 'i need everything', '2025-08-01 23:19:27', '2025-08-01 23:19:27'),
(34, 57, NULL, NULL, 25, 200.00, 1, 1, '1', 'none', '2025-08-02 20:58:45', '2025-08-02 20:58:45'),
(35, 58, NULL, NULL, 26, 250.00, 1, 0, '0', NULL, '2025-08-03 01:51:04', '2025-08-03 01:51:04'),
(36, 59, 22, 27, 26, 250.00, 1, 0, '0', NULL, '2025-08-03 03:15:26', '2025-08-03 03:15:26');

-- --------------------------------------------------------

--
-- Table structure for table `order_equipment`
--

DROP TABLE IF EXISTS `order_equipment`;
CREATE TABLE IF NOT EXISTS `order_equipment` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` int(10) UNSIGNED NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `return_date` date NOT NULL,
  `quantity` int(11) NOT NULL,
  `daily_cost` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_equipment_order_id_foreign` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_equipment`
--

INSERT INTO `order_equipment` (`id`, `order_id`, `equipment_name`, `category`, `start_date`, `return_date`, `quantity`, `daily_cost`, `created_at`, `updated_at`) VALUES
(1, 6, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-28', '2025-08-01', 1, 50.00, '2025-07-28 17:27:48', '2025-07-28 17:27:48'),
(2, 7, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-09', 1, 50.00, '2025-07-28 23:59:31', '2025-07-28 23:59:31'),
(3, 8, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-01', 1, 50.00, '2025-07-29 18:44:46', '2025-07-29 18:44:46'),
(4, 9, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-02', 1, 50.00, '2025-07-29 20:56:30', '2025-07-29 20:56:30'),
(5, 10, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-02', 1, 50.00, '2025-07-29 21:02:32', '2025-07-29 21:02:32'),
(6, 11, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-02', 1, 50.00, '2025-07-29 21:05:34', '2025-07-29 21:05:34'),
(7, 12, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-29', '2025-08-02', 1, 50.00, '2025-07-29 21:08:14', '2025-07-29 21:08:14'),
(8, 13, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-29 21:13:35', '2025-07-29 21:13:35'),
(9, 14, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-29 21:27:35', '2025-07-29 21:27:35'),
(10, 15, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-29 21:29:48', '2025-07-29 21:29:48'),
(11, 48, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 02:57:01', '2025-07-31 02:57:01'),
(12, 49, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 03:05:01', '2025-07-31 03:05:01'),
(13, 50, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-01', 1, 50.00, '2025-07-31 03:14:10', '2025-07-31 03:14:10'),
(14, 51, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 03:25:30', '2025-07-31 03:25:30'),
(15, 52, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 03:32:33', '2025-07-31 03:32:33'),
(16, 53, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 03:48:47', '2025-07-31 03:48:47'),
(17, 54, 'Zefon Diaphragm Pump', 'Calibrator', '2025-07-30', '2025-08-02', 1, 50.00, '2025-07-31 03:56:13', '2025-07-31 03:56:13'),
(18, 57, 'Zefon Diaphragm Pump', 'Calibrator', '2025-08-02', '2025-08-05', 1, 50.00, '2025-08-02 20:58:46', '2025-08-02 20:58:46'),
(19, 59, 'Zefon Diaphragm Pump', 'Calibrator', '2025-08-02', '2025-08-09', 1, 50.00, '2025-08-03 03:15:26', '2025-08-03 03:15:26');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `payment_method` varchar(50) DEFAULT 'credit card',
  `payment_status` varchar(50) DEFAULT 'pending',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `card_holder_name` varchar(255) DEFAULT NULL,
  `card_last_four` char(4) DEFAULT NULL,
  `card_expiry_month` char(2) DEFAULT NULL,
  `card_expiry_year` char(4) DEFAULT NULL,
  `payment_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `transaction_id`, `payment_method`, `payment_status`, `transaction_reference`, `amount`, `created_at`, `updated_at`, `card_holder_name`, `card_last_four`, `card_expiry_month`, `card_expiry_year`, `payment_token`) VALUES
(1, 10, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 06:34:49', '2025-04-10 06:34:49', 'N/A', '', '', '', NULL),
(2, 11, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 06:50:09', '2025-04-10 06:50:09', 'N/A', '', '', '', NULL),
(3, 12, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 07:12:11', '2025-04-10 07:12:11', 'N/A', '', '', '', NULL),
(4, 13, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 18:46:39', '2025-04-10 18:46:39', 'N/A', '', '', '', NULL),
(5, 14, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 19:24:10', '2025-04-10 19:24:10', 'N/A', '', '', '', NULL),
(6, 15, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 20:07:07', '2025-04-10 20:07:07', 'N/A', '', '', '', NULL),
(7, 16, 'credit_card', 'pending', NULL, 52.50, '2025-04-10 20:15:03', '2025-04-10 20:15:03', 'N/A', '', '', '', NULL),
(8, 17, 'credit_card', 'pending', NULL, 52.50, '2025-04-11 19:47:45', '2025-04-11 19:47:45', 'N/A', '', '', '', NULL),
(9, 18, 'credit_card', 'pending', NULL, 52.50, '2025-04-11 20:43:44', '2025-04-11 20:43:44', 'N/A', '', '', '', NULL),
(10, 19, 'credit_card', 'pending', NULL, 52.50, '2025-04-12 20:45:47', '2025-04-12 20:45:47', 'N/A', '', '', '', NULL),
(11, 20, 'credit_card', 'pending', NULL, 52.50, '2025-04-12 20:47:12', '2025-04-12 20:47:12', 'N/A', '', '', '', NULL),
(12, 21, 'credit_card', 'pending', NULL, 52.50, '2025-04-12 21:26:31', '2025-04-12 21:26:31', 'N/A', '', '', '', NULL),
(13, 22, 'credit_card', 'pending', NULL, 157.50, '2025-04-12 21:29:56', '2025-04-12 21:29:56', 'N/A', '', '', '', NULL),
(14, 23, 'credit_card', 'pending', NULL, 52.50, '2025-04-12 21:42:28', '2025-04-12 21:42:28', 'N/A', '', '', '', NULL),
(15, 24, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 01:40:59', '2025-04-13 01:40:59', 'N/A', '', '', '', NULL),
(16, 26, 'credit_card', 'pending', NULL, 105.00, '2025-04-13 01:54:20', '2025-04-13 01:54:20', 'Test User', '4242', '12', '2026', NULL),
(17, 28, 'credit_card', 'pending', NULL, 105.00, '2025-04-13 01:57:41', '2025-04-13 01:57:41', 'Test User', '4242', '12', '2026', NULL),
(18, 29, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 02:20:24', '2025-04-13 02:20:24', 'N/A', '', '', '', NULL),
(19, 30, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 02:34:45', '2025-04-13 02:34:45', 'N/A', '', '', '', NULL),
(20, 31, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 02:39:45', '2025-04-13 02:39:45', 'Guest', '', '', '', NULL),
(21, 32, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 03:17:23', '2025-04-13 03:17:23', 'Guest', '', '', '', NULL),
(22, 33, 'credit_card', 'pending', NULL, 52.50, '2025-04-13 03:42:13', '2025-04-13 03:42:13', 'Ruan Carvalho', '', '', '', NULL),
(23, 34, 'credit_card', 'pending', NULL, 52.50, '2025-04-14 05:23:07', '2025-04-14 05:23:07', 'Ruan Carvalho', '', '', '', NULL),
(24, 36, 'credit_card', 'pending', NULL, 52.50, '2025-04-14 05:50:00', '2025-04-14 05:50:00', '', '', '', '', NULL),
(26, 38, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 03:43:12', '2025-07-27 03:43:12', 'Unknown Person', '', '', '', NULL),
(27, 39, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 03:49:37', '2025-07-27 03:49:37', 'Unknown Person', '', '', '', NULL),
(28, 40, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 03:52:52', '2025-07-27 03:52:52', 'Unknown Person', '', '', '', NULL),
(29, 41, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 04:17:03', '2025-07-27 04:17:03', 'Unknown Person', '', '', '', NULL),
(30, 42, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 04:20:26', '2025-07-27 04:20:26', 'Unknown Person', '', '', '', NULL),
(31, 43, 'credit_card', 'pending', NULL, 341.25, '2025-07-27 04:34:30', '2025-07-27 04:34:30', 'Unknown Person', '', '', '', NULL),
(32, 44, 'credit_card', 'pending', NULL, 341.25, '2025-07-27 04:39:02', '2025-07-27 04:39:02', 'Unknown Person', '', '', '', NULL),
(33, 45, 'credit_card', 'pending', NULL, 341.25, '2025-07-27 04:41:38', '2025-07-27 04:41:38', 'Unknown Person', '', '', '', NULL),
(34, 46, 'credit_card', 'pending', NULL, 341.25, '2025-07-27 04:44:08', '2025-07-27 04:44:08', 'Unknown Person', '', '', '', NULL),
(35, 47, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 04:49:23', '2025-07-27 04:49:23', 'Unknown Person', '', '', '', NULL),
(36, 48, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 04:55:14', '2025-07-27 04:55:14', 'Unknown Person', '', '', '', NULL),
(37, 49, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 04:56:28', '2025-07-27 04:56:28', 'Unknown Person', '', '', '', NULL),
(38, 50, 'credit_card', 'pending', NULL, 472.50, '2025-07-27 04:58:53', '2025-07-27 04:58:53', 'Unknown Person', '', '', '', NULL),
(39, 51, 'credit_card', 'pending', NULL, 178.50, '2025-07-27 05:06:08', '2025-07-27 05:06:08', 'Unknown Person', '', '', '', NULL),
(40, 52, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 05:10:04', '2025-07-27 05:10:04', 'Unknown Person', '', '', '', NULL),
(41, 53, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 05:15:52', '2025-07-27 05:15:52', 'Unknown Person', '', '', '', NULL),
(42, 54, 'credit_card', 'pending', NULL, 472.50, '2025-07-27 05:22:01', '2025-07-27 05:22:01', 'Unknown Person', '', '', '', NULL),
(43, 55, 'credit_card', 'pending', NULL, 262.50, '2025-07-27 05:27:45', '2025-07-27 05:27:45', 'Unknown Person', '', '', '', NULL),
(44, 56, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 06:02:18', '2025-07-27 06:02:18', 'Unknown Person', '', '', '', NULL),
(45, 57, 'credit_card', 'pending', NULL, 210.00, '2025-07-27 06:15:07', '2025-07-27 06:15:07', 'Unknown Person', '', '', '', NULL),
(46, 58, 'credit_card', 'pending', NULL, 210.00, '2025-07-28 01:03:19', '2025-07-28 01:03:19', 'Unknown Person', '', '', '', NULL),
(47, 59, 'credit_card', 'pending', NULL, 525.00, '2025-07-28 16:19:50', '2025-07-28 16:19:50', 'Unknown Person', '', '', '', NULL),
(48, 60, 'credit_card', 'pending', NULL, 525.00, '2025-07-28 16:32:46', '2025-07-28 16:32:46', 'Unknown Person', '', '', '', NULL),
(49, 61, 'credit_card', 'pending', NULL, 682.50, '2025-07-28 16:34:19', '2025-07-28 16:34:19', 'Unknown Person', '', '', '', NULL),
(50, 62, 'credit_card', 'pending', NULL, 682.50, '2025-07-28 16:39:00', '2025-07-28 16:39:00', 'Unknown Person', '', '', '', NULL),
(51, 63, 'credit_card', 'pending', NULL, 472.50, '2025-07-28 16:45:45', '2025-07-28 16:45:45', 'Unknown Person', '', '', '', NULL),
(52, 64, 'credit_card', 'pending', NULL, 525.00, '2025-07-28 16:51:00', '2025-07-28 16:51:00', 'Unknown Person', '', '', '', NULL),
(53, 65, 'credit_card', 'pending', NULL, 472.50, '2025-07-28 17:22:10', '2025-07-28 17:22:10', 'Unknown Person', '', '', '', NULL),
(54, 66, 'credit_card', 'pending', NULL, 472.50, '2025-07-28 17:27:47', '2025-07-28 17:27:47', 'Unknown Person', '', '', '', NULL),
(55, 67, 'credit_card', 'pending', NULL, 840.00, '2025-07-28 23:59:27', '2025-07-28 23:59:27', 'Unknown Person', '', '', '', NULL),
(56, 68, 'credit_card', 'pending', NULL, 420.00, '2025-07-29 18:44:45', '2025-07-29 18:44:45', 'Unknown Person', '', '', '', NULL),
(57, 69, 'credit_card', 'pending', NULL, 420.00, '2025-07-29 20:56:29', '2025-07-29 20:56:29', 'Unknown Person', '', '', '', NULL),
(58, 70, 'credit_card', 'pending', NULL, 420.00, '2025-07-29 21:02:26', '2025-07-29 21:02:26', 'Unknown Person', '', '', '', NULL),
(59, 71, 'credit_card', 'pending', NULL, 420.00, '2025-07-29 21:05:33', '2025-07-29 21:05:33', 'Unknown Person', '', '', '', NULL),
(60, 72, 'credit_card', 'pending', NULL, 420.00, '2025-07-29 21:08:11', '2025-07-29 21:08:11', 'Unknown Person', '', '', '', NULL),
(61, 73, 'credit_card', 'pending', NULL, 367.50, '2025-07-29 21:13:33', '2025-07-29 21:13:33', 'Unknown Person', '', '', '', NULL),
(62, 74, 'credit_card', 'pending', NULL, 367.50, '2025-07-29 21:27:34', '2025-07-29 21:27:34', 'Unknown Person', '', '', '', NULL),
(63, 75, 'credit_card', 'pending', NULL, 367.50, '2025-07-29 21:29:45', '2025-07-29 21:29:45', 'Unknown Person', '', '', '', NULL),
(64, 76, 'credit_card', 'pending', NULL, 210.00, '2025-07-29 21:34:43', '2025-07-29 21:34:43', 'Unknown Person', '', '', '', NULL),
(65, 77, 'credit_card', 'pending', NULL, 210.00, '2025-07-29 21:37:56', '2025-07-29 21:37:56', 'Unknown Person', '', '', '', NULL),
(66, 78, 'credit_card', 'pending', NULL, 315.00, '2025-07-29 22:47:54', '2025-07-29 22:47:54', 'Unknown Person', '', '', '', NULL),
(67, 79, 'credit_card', 'pending', NULL, 262.50, '2025-07-30 03:39:42', '2025-07-30 03:39:42', 'Unknown Person', '', '', '', NULL),
(68, 80, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 03:49:10', '2025-07-30 03:49:10', 'Unknown Person', '', '', '', NULL),
(69, 81, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 03:59:57', '2025-07-30 03:59:57', 'Unknown Person', '', '', '', NULL),
(70, 82, 'credit_card', 'pending', NULL, 210.00, '2025-07-30 04:07:56', '2025-07-30 04:07:56', 'Unknown Person', '', '', '', NULL),
(71, 83, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 04:17:50', '2025-07-30 04:17:50', 'Unknown Person', '', '', '', NULL),
(72, 84, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 04:27:52', '2025-07-30 04:27:52', 'Unknown Person', '', '', '', NULL),
(73, 85, 'credit_card', 'pending', NULL, 210.00, '2025-07-30 19:26:52', '2025-07-30 19:26:52', 'Unknown Person', '', '', '', NULL),
(74, 86, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 21:32:48', '2025-07-30 21:32:48', 'Unknown Person', '', '', '', NULL),
(75, 87, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 21:33:56', '2025-07-30 21:33:56', 'Unknown Person', '', '', '', NULL),
(76, 88, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 21:48:13', '2025-07-30 21:48:13', 'Unknown Person', '', '', '', NULL),
(77, 89, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 21:53:45', '2025-07-30 21:53:45', 'Unknown Person', '', '', '', NULL),
(78, 90, 'credit_card', 'pending', NULL, 682.50, '2025-07-30 22:01:23', '2025-07-30 22:01:23', 'Unknown Person', '', '', '', NULL),
(79, 91, 'credit_card', 'pending', NULL, 682.50, '2025-07-30 22:08:00', '2025-07-30 22:08:00', 'Unknown Person', '', '', '', NULL),
(80, 92, 'credit_card', 'pending', NULL, 682.50, '2025-07-30 22:16:54', '2025-07-30 22:16:54', 'Unknown Person', '', '', '', NULL),
(81, 93, 'credit_card', 'pending', NULL, 682.50, '2025-07-30 22:25:35', '2025-07-30 22:25:35', 'Unknown Person', '', '', '', NULL),
(82, 94, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 22:30:42', '2025-07-30 22:30:42', 'Unknown Person', '', '', '', NULL),
(83, 95, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 22:35:36', '2025-07-30 22:35:36', 'Unknown Person', '', '', '', NULL),
(84, 96, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 22:43:53', '2025-07-30 22:43:53', 'Unknown Person', '', '', '', NULL),
(85, 97, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 22:49:50', '2025-07-30 22:49:50', 'Unknown Person', '', '', '', NULL),
(86, 98, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 22:57:20', '2025-07-30 22:57:20', 'Unknown Person', '', '', '', NULL),
(87, 99, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 23:01:22', '2025-07-30 23:01:22', 'Unknown Person', '', '', '', NULL),
(88, 100, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 23:06:52', '2025-07-30 23:06:52', 'Unknown Person', '', '', '', NULL),
(89, 101, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 23:23:45', '2025-07-30 23:23:45', 'Unknown Person', '', '', '', NULL),
(90, 102, 'credit_card', 'pending', NULL, 367.50, '2025-07-30 23:27:12', '2025-07-30 23:27:12', 'Unknown Person', '', '', '', NULL),
(91, 103, 'credit_card', 'pending', NULL, 210.00, '2025-07-30 23:29:06', '2025-07-30 23:29:06', 'Unknown Person', '', '', '', NULL),
(92, 104, 'credit_card', 'pending', NULL, 262.50, '2025-07-30 23:52:50', '2025-07-30 23:52:50', 'Unknown Person', '', '', '', NULL),
(93, 105, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:00:58', '2025-07-31 00:00:58', 'Unknown Person', '', '', '', NULL),
(94, 106, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:04:06', '2025-07-31 00:04:06', 'Unknown Person', '', '', '', NULL),
(95, 107, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:05:23', '2025-07-31 00:05:23', 'Unknown Person', '', '', '', NULL),
(96, 108, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:20:37', '2025-07-31 00:20:37', 'Unknown Person', '', '', '', NULL),
(97, 109, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:25:05', '2025-07-31 00:25:05', 'Unknown Person', '', '', '', NULL),
(98, 110, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 00:29:13', '2025-07-31 00:29:13', 'Unknown Person', '', '', '', NULL),
(99, 111, 'credit_card', 'pending', NULL, 315.00, '2025-07-31 00:40:39', '2025-07-31 00:40:39', 'Unknown Person', '', '', '', NULL),
(100, 112, 'credit_card', 'pending', NULL, 210.00, '2025-07-31 00:48:25', '2025-07-31 00:48:25', 'Unknown Person', '', '', '', NULL),
(101, 113, 'credit_card', 'pending', NULL, 210.00, '2025-07-31 00:55:46', '2025-07-31 00:55:46', 'Unknown Person', '', '', '', NULL),
(102, 114, 'credit_card', 'pending', NULL, 210.00, '2025-07-31 02:35:50', '2025-07-31 02:35:50', 'Unknown Person', '', '', '', NULL),
(103, 115, 'credit_card', 'pending', NULL, 367.50, '2025-07-31 02:38:26', '2025-07-31 02:38:26', 'Unknown Person', '', '', '', NULL),
(104, 116, 'credit_card', 'pending', NULL, 367.50, '2025-07-31 02:48:13', '2025-07-31 02:48:13', 'Unknown Person', '', '', '', NULL),
(105, 117, 'credit_card', 'pending', NULL, 367.50, '2025-07-31 02:52:00', '2025-07-31 02:52:00', 'Unknown Person', '', '', '', NULL),
(106, 118, 'credit_card', 'pending', NULL, 367.50, '2025-07-31 02:56:42', '2025-07-31 02:56:42', 'Unknown Person', '', '', '', NULL),
(107, 119, 'credit_card', 'pending', NULL, 472.50, '2025-07-31 03:01:35', '2025-07-31 03:01:35', 'Unknown Person', '', '', '', NULL),
(108, 120, 'credit_card', 'pending', NULL, 472.50, '2025-07-31 03:04:31', '2025-07-31 03:04:31', 'Unknown Person', '', '', '', NULL),
(109, 121, 'credit_card', 'pending', NULL, 420.00, '2025-07-31 03:13:45', '2025-07-31 03:13:45', 'Unknown Person', '', '', '', NULL),
(110, 122, 'credit_card', 'pending', NULL, 420.00, '2025-07-31 03:24:26', '2025-07-31 03:24:26', 'Unknown Person', '', '', '', NULL),
(111, 123, 'credit_card', 'pending', NULL, 367.50, '2025-07-31 03:32:08', '2025-07-31 03:32:08', 'Unknown Person', '', '', '', NULL),
(112, 124, 'credit_card', 'pending', NULL, 157.50, '2025-07-31 03:48:30', '2025-07-31 03:48:30', 'Unknown Person', '', '', '', NULL),
(113, 125, 'credit_card', 'pending', NULL, 157.50, '2025-07-31 03:54:55', '2025-07-31 03:54:55', 'Unknown Person', '', '', '', NULL),
(114, 126, 'credit_card', 'pending', NULL, 315.00, '2025-07-31 04:10:29', '2025-07-31 04:10:29', '', '', '', '', NULL),
(115, 127, 'credit_card', 'pending', NULL, 262.50, '2025-07-31 07:11:47', '2025-07-31 07:11:47', 'Unknown Person', '', '', '', NULL),
(116, 128, 'credit_card', 'pending', NULL, 210.00, '2025-08-01 23:19:11', '2025-08-01 23:19:11', 'Unknown Person', '', '', '', NULL),
(117, 129, 'credit_card', 'pending', NULL, 367.50, '2025-08-02 20:58:30', '2025-08-02 20:58:30', 'Unknown Person', '', '', '', NULL),
(118, 130, 'credit_card', 'pending', NULL, 262.50, '2025-08-03 01:50:42', '2025-08-03 01:50:42', 'Unknown Person', '', '', '', NULL),
(119, 131, 'credit_card', 'pending', NULL, 630.00, '2025-08-03 03:15:02', '2025-08-03 03:15:02', 'Unknown Person', '', '', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=402 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(128, 'App\\Models\\Accounts', 10, 'test-token', '0234dcac92a8da12d387225d34ec9b227df7c5484bdc137a648af980404a5709', '[\"*\"]', NULL, NULL, '2024-04-24 20:09:54', '2024-04-24 20:09:54'),
(131, 'App\\Models\\Accounts', 10, 'test-token', 'e9f77550a9fe3994b16eee38f11b7841b78ac8a98a0ed4801e0cf1647e7cb323', '[\"*\"]', NULL, NULL, '2024-04-24 20:11:05', '2024-04-24 20:11:05'),
(138, 'App\\Models\\Accounts', 10, 'test-token', '7b3764b8111801d56c6326338e3125db659a325ea78f932ae31f6cf2ddab64fc', '[\"*\"]', NULL, NULL, '2024-04-24 20:13:57', '2024-04-24 20:13:57'),
(154, 'App\\Models\\Accounts', 10, 'test-token', '8efb296f84cd44485d805f009178a0bac4ed060e322672a3e42662e48b7a3f37', '[\"*\"]', NULL, NULL, '2024-04-24 20:14:26', '2024-04-24 20:14:26'),
(263, 'App\\Models\\Admin', 1, '1_admin_token', 'f3ac0019dd9abb3fe31ac53c998239750049f8123c78fc74373256035e091288', '[\"*\"]', '2025-06-28 04:20:56', '2025-06-28 05:20:11', '2025-06-28 04:20:11', '2025-06-28 04:20:56'),
(264, 'App\\Models\\Admin', 1, '1_admin_token', 'ccb120d4c057d3446eb9429e33c68da9669d5271b06a972ce9d02cfe93c0390e', '[\"*\"]', '2025-06-28 05:00:01', '2025-06-28 05:59:55', '2025-06-28 04:59:55', '2025-06-28 05:00:01'),
(265, 'App\\Models\\Admin', 1, '1_admin_token', '05824d14ca352e64a96baa3b1a211db180a2b0ab078efdd3b3471d846f292659', '[\"*\"]', '2025-06-28 05:11:54', '2025-06-28 06:09:27', '2025-06-28 05:09:27', '2025-06-28 05:11:54'),
(266, 'App\\Models\\Admin', 1, '1_admin_token', '26b83cd8c06f954054f642401c30dfad99723ef6088a49bfb05671578416b16c', '[\"*\"]', '2025-06-28 05:43:24', '2025-06-28 06:42:07', '2025-06-28 05:42:07', '2025-06-28 05:43:24'),
(267, 'App\\Models\\Admin', 1, '1_admin_token', '8332a418ae8b050fa53da8840ca3c98653ce9168be02708e857fd28f2034533c', '[\"*\"]', '2025-06-28 06:07:31', '2025-06-28 07:06:58', '2025-06-28 06:06:58', '2025-06-28 06:07:31'),
(268, 'App\\Models\\Admin', 1, '1_admin_token', '019956e909ceb843bf3165c7a5b801320a8a8a323f9832d32942c33ba873a960', '[\"*\"]', '2025-06-28 06:55:18', '2025-06-28 07:55:05', '2025-06-28 06:55:05', '2025-06-28 06:55:18'),
(269, 'App\\Models\\Admin', 1, '1_admin_token', 'fd974545aabab1f5c722f338cbf8e94f96498e22769fb5977a368c23f2bb8cdb', '[\"*\"]', NULL, '2025-06-28 07:56:56', '2025-06-28 06:56:56', '2025-06-28 06:56:56'),
(270, 'App\\Models\\Admin', 1, '1_admin_token', '89071dc2aebf395fe29966da95d9b0894a2e0e07b57ed4fd3abf6d8eac6dc529', '[\"*\"]', '2025-06-28 06:58:25', '2025-06-28 07:58:14', '2025-06-28 06:58:14', '2025-06-28 06:58:25'),
(271, 'App\\Models\\Admin', 1, '1_admin_token', 'da59780dadea10db9127f5a045b8f19050de2432bfd44d4cc9e881007d9f7f4c', '[\"*\"]', '2025-06-28 07:40:49', '2025-06-28 08:40:11', '2025-06-28 07:40:11', '2025-06-28 07:40:49'),
(272, 'App\\Models\\Admin', 1, '1_admin_token', 'd30e5e7248523ce23d9a8204de784d44bdafa206d21f1337761a9a16dc0d8485', '[\"*\"]', '2025-06-28 07:46:46', '2025-06-28 08:44:19', '2025-06-28 07:44:19', '2025-06-28 07:46:46'),
(273, 'App\\Models\\Admin', 1, '1_admin_token', '573433669f372b3e9785fdce681d8405817a5891546d349cbe316b2512f2ef04', '[\"*\"]', '2025-06-28 16:48:14', '2025-06-28 17:47:45', '2025-06-28 16:47:46', '2025-06-28 16:48:14'),
(274, 'App\\Models\\Admin', 1, '1_admin_token', '090bacd06759eca37535381d5b5f0f18473192de5008ffacf8094512dc085bce', '[\"*\"]', NULL, '2025-07-09 19:39:54', '2025-07-09 18:39:54', '2025-07-09 18:39:54'),
(275, 'App\\Models\\Accounts', 81, '81_account_token', 'bf98723f12225e6771410fdc46fc0bef8c31bba9005347cabfd64fe3cab1c94f', '[\"*\"]', NULL, '2025-07-09 19:55:12', '2025-07-09 18:55:12', '2025-07-09 18:55:12'),
(276, 'App\\Models\\Accounts', 81, '81_account_token', '9d58a9dd49a2fa9be8f7589767e10c5e017543c4daf2dd873f34fba7dc9ecf69', '[\"*\"]', NULL, '2025-07-09 20:07:11', '2025-07-09 19:07:11', '2025-07-09 19:07:11'),
(277, 'App\\Models\\Admin', 1, '1_admin_token', '3dfebcea3c4d09ef43ee063f18466049e11a790e5031d4818f69a61ee4221cbd', '[\"*\"]', NULL, '2025-07-09 20:10:51', '2025-07-09 19:10:51', '2025-07-09 19:10:51'),
(278, 'App\\Models\\Accounts', 81, '81_account_token', '351b9c6b224eb8554f17ffa566f64dc351ba8c6b9624753268500fe0010a4eee', '[\"*\"]', NULL, '2025-07-09 20:29:35', '2025-07-09 19:29:36', '2025-07-09 19:29:36'),
(279, 'App\\Models\\Accounts', 81, '81_account_token', '9f0fb50a990db9b9b28f177f39235179f95d4e5c2f78e680e6c0e36361dd2e46', '[\"*\"]', NULL, '2025-07-10 00:20:57', '2025-07-09 23:20:57', '2025-07-09 23:20:57'),
(280, 'App\\Models\\Accounts', 81, '81_account_token', 'a7cb4a3288650ae37585feb847931763d5e3bd15210434769f0d5215f20bfe9a', '[\"*\"]', NULL, '2025-07-10 01:38:36', '2025-07-10 00:38:37', '2025-07-10 00:38:37'),
(281, 'App\\Models\\Accounts', 81, '81_account_token', '0ea72cbdf0fc95b25cfebde82ad4cce34fb64759b831e7fcacb2e4361fd4d6c3', '[\"*\"]', NULL, '2025-07-10 01:43:42', '2025-07-10 00:43:42', '2025-07-10 00:43:42'),
(282, 'App\\Models\\Admin', 1, '1_admin_token', 'c408eab42584a22ff9226a64751668c453f48a026439416df48cdffc640b5906', '[\"*\"]', NULL, '2025-07-10 01:50:55', '2025-07-10 00:50:55', '2025-07-10 00:50:55'),
(283, 'App\\Models\\Accounts', 81, '81_account_token', '3e0b215669b5dc839767d672dd5341ec5593d9796ac781d2a0321a8c5a2155d6', '[\"*\"]', NULL, '2025-07-10 21:50:46', '2025-07-10 20:50:46', '2025-07-10 20:50:46'),
(284, 'App\\Models\\Admin', 1, '1_admin_token', 'ec9399fa552317036a8fec39c85c77c3e2fcd9aed6966b146361b35000234988', '[\"*\"]', NULL, '2025-07-10 21:54:17', '2025-07-10 20:54:17', '2025-07-10 20:54:17'),
(285, 'App\\Models\\Accounts', 81, '81_account_token', '04d73688d234308e16c26ef888fe62c88b1e72e80e2aa2ad74505e52d0fae5e9', '[\"*\"]', NULL, '2025-07-10 22:37:25', '2025-07-10 21:37:25', '2025-07-10 21:37:25'),
(286, 'App\\Models\\Accounts', 81, '81_account_token', 'd63596ca21d26c8b3b4abfcec953b01cd12578352c3496a56e79c4fb332ae839', '[\"*\"]', NULL, '2025-07-11 00:50:50', '2025-07-10 23:50:51', '2025-07-10 23:50:51'),
(287, 'App\\Models\\Accounts', 81, '81_account_token', '4888162d0769c934851c386f1e6454acc111bb8b0929d00e976b07ddc851f960', '[\"*\"]', NULL, '2025-07-11 01:03:40', '2025-07-11 00:03:40', '2025-07-11 00:03:40'),
(288, 'App\\Models\\Accounts', 81, '81_account_token', '61e83cec47e6d5dd71b427d0b348b85e916bb44ce2db800b8898b33eccf94c15', '[\"*\"]', NULL, '2025-07-11 01:11:49', '2025-07-11 00:11:49', '2025-07-11 00:11:49'),
(289, 'App\\Models\\Accounts', 81, '81_account_token', '3a80abc0890959ec5a8c8c825832617fbec30395d37cabd70307d1acbeb26af3', '[\"*\"]', NULL, '2025-07-11 01:19:17', '2025-07-11 00:19:18', '2025-07-11 00:19:18'),
(290, 'App\\Models\\Accounts', 81, '81_account_token', '0df79c288b99043f22901927ff4e602b7b1f93bd44ffe474a8916485bffb4cdc', '[\"*\"]', NULL, '2025-07-11 01:24:13', '2025-07-11 00:24:13', '2025-07-11 00:24:13'),
(291, 'App\\Models\\Accounts', 81, '81_account_token', '8b1be776dbeda4f62c235c40046d362d562d4ed62716a81f5cfcb18e48748742', '[\"*\"]', NULL, '2025-07-11 01:26:47', '2025-07-11 00:26:47', '2025-07-11 00:26:47'),
(292, 'App\\Models\\Accounts', 81, '81_account_token', 'a6efe1c94049bf7a17a7e544c1bf9373213092d160a206a3af55a4ac8f421dbc', '[\"*\"]', NULL, '2025-07-11 01:37:30', '2025-07-11 00:37:30', '2025-07-11 00:37:30'),
(293, 'App\\Models\\Accounts', 81, '81_account_token', 'c469d2b3c8bed14db6ecd9a80351d279b73a3e23f7c16dcbb223a03167129f53', '[\"*\"]', NULL, '2025-07-11 01:45:38', '2025-07-11 00:45:38', '2025-07-11 00:45:38'),
(294, 'App\\Models\\Accounts', 81, '81_account_token', '1340a973892e6f77ecb8e7cd5e98608687b7b3b05fc95ab77eaf7b048fdf72c9', '[\"*\"]', NULL, '2025-07-11 02:04:47', '2025-07-11 01:04:47', '2025-07-11 01:04:47'),
(295, 'App\\Models\\Accounts', 81, '81_account_token', 'fa79aac8310b2c2155fc9c98d3d0b78af18b77e01a214a86a70e348c5660c63b', '[\"*\"]', NULL, '2025-07-11 02:05:43', '2025-07-11 01:05:43', '2025-07-11 01:05:43'),
(296, 'App\\Models\\Accounts', 81, '81_account_token', '136f2bebe9592636be59736152c7c76978f9d5787ef456b52308858cc650a939', '[\"*\"]', NULL, '2025-07-11 02:09:22', '2025-07-11 01:09:22', '2025-07-11 01:09:22'),
(297, 'App\\Models\\Accounts', 81, '81_account_token', 'c156fbfaf13f2f9793cf1c4891966721db4fe14eda937990b01c97a061dc8338', '[\"*\"]', NULL, '2025-07-11 02:19:57', '2025-07-11 01:19:57', '2025-07-11 01:19:57'),
(298, 'App\\Models\\Accounts', 81, '81_account_token', '4751e8bff917de3951b11f8077069cd41983a2b528ac913e8a348b70be0bf485', '[\"*\"]', NULL, '2025-07-11 02:34:45', '2025-07-11 01:34:45', '2025-07-11 01:34:45'),
(299, 'App\\Models\\Accounts', 81, '81_account_token', '34fd08814ef50e5edaaffdd5846850758d63bfa55595c8eef1adca7bc1fe02ec', '[\"*\"]', NULL, '2025-07-11 02:39:19', '2025-07-11 01:39:19', '2025-07-11 01:39:19'),
(300, 'App\\Models\\Accounts', 81, '81_account_token', '4bbdb3cee4199608be221d4deec8000e35c74ad7191c3c4ba37733ad889435a3', '[\"*\"]', '2025-07-11 03:58:20', '2025-07-11 04:03:25', '2025-07-11 03:03:25', '2025-07-11 03:58:20'),
(301, 'App\\Models\\Accounts', 81, '81_account_token', 'ac9820e63341493ff7f539812de2dea56ee0af308cb267c79a4be39084770581', '[\"*\"]', NULL, '2025-07-11 05:00:07', '2025-07-11 04:00:07', '2025-07-11 04:00:07'),
(302, 'App\\Models\\Accounts', 81, '81_account_token', 'fe477040b4afa67ce75e0f483c8ac8c027f904d94c7441f01423506fc8386566', '[\"*\"]', NULL, '2025-07-11 05:00:44', '2025-07-11 04:00:44', '2025-07-11 04:00:44'),
(303, 'App\\Models\\Accounts', 81, '81_account_token', '6e507cc6d53390a349db41ac2d40073bd998347724b40aa2a8a5adea0b955448', '[\"*\"]', NULL, '2025-07-11 05:01:57', '2025-07-11 04:01:57', '2025-07-11 04:01:57'),
(304, 'App\\Models\\Accounts', 81, '81_account_token', '8b0383b5ae0be72e5d8d4852999354e55f095199c8c97e7ebcb5e4d17f27ee7a', '[\"*\"]', NULL, '2025-07-11 05:06:34', '2025-07-11 04:06:34', '2025-07-11 04:06:34'),
(305, 'App\\Models\\Accounts', 81, '81_account_token', '29ad37417440d192b6098d77f8ec2b09f28369ab2f655c3edb6330c3ea0f45d5', '[\"*\"]', '2025-07-11 04:08:28', '2025-07-11 05:07:18', '2025-07-11 04:07:18', '2025-07-11 04:08:28'),
(306, 'App\\Models\\Accounts', 81, '81_account_token', '69ad18e51c19e297d523c2ee036bd47c7e437ffbdd6b536d036eb262d32e8255', '[\"*\"]', '2025-07-11 04:15:19', '2025-07-11 05:13:49', '2025-07-11 04:13:49', '2025-07-11 04:15:19'),
(307, 'App\\Models\\Accounts', 81, '81_account_token', '18c91e95a47da4cf3194ebf5f49af46827f1eb3f97e14d8a160055602dfdb2d7', '[\"*\"]', '2025-07-11 04:46:14', '2025-07-11 05:45:29', '2025-07-11 04:45:29', '2025-07-11 04:46:14'),
(308, 'App\\Models\\Accounts', 81, '81_account_token', '57fde678fe6acbb98bca7d32b2d237c7b416abb8491c68c38d9be57324c81890', '[\"*\"]', NULL, '2025-07-11 18:14:10', '2025-07-11 17:14:10', '2025-07-11 17:14:10'),
(309, 'App\\Models\\Accounts', 81, '81_account_token', 'ca7877fc81621c2df88d1205796318aa4b0ceab8b86c56bd03837514046473a6', '[\"*\"]', NULL, '2025-07-11 18:16:13', '2025-07-11 17:16:13', '2025-07-11 17:16:13'),
(310, 'App\\Models\\Accounts', 81, '81_account_token', 'e13d2ba91c5b7d0302f5fec0b92d05a22a04e9fc90b93b02108c252582e0d5aa', '[\"*\"]', NULL, '2025-07-11 18:17:57', '2025-07-11 17:17:57', '2025-07-11 17:17:57'),
(311, 'App\\Models\\Accounts', 81, '81_account_token', '7131fe3aa5a39d15a13be32f74fe9a73ec998794abbe60680c68357d99ee86d7', '[\"*\"]', NULL, '2025-07-12 01:22:06', '2025-07-12 00:22:06', '2025-07-12 00:22:06'),
(312, 'App\\Models\\Accounts', 81, '81_account_token', '1a653fce8235223eecf2ef3757adfdc3b705df5b2c2052b0e130a7995f12835d', '[\"*\"]', NULL, '2025-07-13 04:51:51', '2025-07-13 03:51:51', '2025-07-13 03:51:51'),
(313, 'App\\Models\\Admin', 1, '1_admin_token', 'e7b401f980e7e8d0378bda822e06898dff1719f6887a3881b792aac15cc64072', '[\"*\"]', NULL, '2025-07-13 05:05:43', '2025-07-13 04:05:43', '2025-07-13 04:05:43'),
(314, 'App\\Models\\Accounts', 81, '81_account_token', '4979b3dca42c3dca80680c12bc66c25481085e02b55ab917af15d498f5505a00', '[\"*\"]', NULL, '2025-07-13 05:06:11', '2025-07-13 04:06:11', '2025-07-13 04:06:11'),
(315, 'App\\Models\\Accounts', 81, '81_account_token', 'd95ebd5c3f973d7d7d9784a0c56b21456e1c729ca35cdfb3a6dd24b9d300bf39', '[\"*\"]', NULL, '2025-07-14 05:42:43', '2025-07-14 04:42:43', '2025-07-14 04:42:43'),
(316, 'App\\Models\\Accounts', 81, '81_account_token', '8db959a40af77fd7ef4b77a51966b5a8f996ea9c09e51eda874c4ae7c0c34d3f', '[\"*\"]', NULL, '2025-07-14 05:57:58', '2025-07-14 04:57:59', '2025-07-14 04:57:59'),
(317, 'App\\Models\\Accounts', 81, '81_account_token', '6dc983e3b743d88949be174b163549ca93a19444270ef97ddb0fad76f3f2eb53', '[\"*\"]', NULL, '2025-07-14 07:59:03', '2025-07-14 06:59:04', '2025-07-14 06:59:04'),
(318, 'App\\Models\\Accounts', 81, '81_account_token', '4b9b6b1c177a7a85e7da5153c283547ccaaafc240cc7802f12dc017453575480', '[\"*\"]', NULL, '2025-07-14 08:57:15', '2025-07-14 07:57:15', '2025-07-14 07:57:15'),
(319, 'App\\Models\\Accounts', 81, '81_account_token', 'ade5f176f9fc77087783d3199d0da8e47130fcc890cdab209f1c4abf47775fa2', '[\"*\"]', NULL, '2025-07-14 09:06:51', '2025-07-14 08:06:52', '2025-07-14 08:06:52'),
(320, 'App\\Models\\Accounts', 81, '81_account_token', '35f442a66cb30ddd0da58f347add22c21cc875030cc1d0e7a3f15288ec178fac', '[\"*\"]', NULL, '2025-07-14 09:21:57', '2025-07-14 08:21:57', '2025-07-14 08:21:57'),
(321, 'App\\Models\\Accounts', 81, '81_account_token', '0262345d2911bdf3b8e10e10144520d6f14cdaa635e4d6e17a077f7a0847462b', '[\"*\"]', NULL, '2025-07-14 16:43:42', '2025-07-14 15:43:42', '2025-07-14 15:43:42'),
(322, 'App\\Models\\Accounts', 81, '81_account_token', 'c5e1b27dfc7fd437594aa034ae4284414cba5ae6669c5f62238cbd256e40af5b', '[\"*\"]', NULL, '2025-07-14 16:46:41', '2025-07-14 15:46:41', '2025-07-14 15:46:41'),
(323, 'App\\Models\\Accounts', 81, '81_account_token', 'dccc4bb6f252eee315856cde329d38fe6d2ecb6b44b54ba4fbac42d46e66f3af', '[\"*\"]', NULL, '2025-07-14 16:55:42', '2025-07-14 15:55:42', '2025-07-14 15:55:42'),
(324, 'App\\Models\\Accounts', 81, '81_account_token', '4ed4377b6481d2ae6e713d794a40dd67671ecb7fd6cc96a3719c0939d8ccc369', '[\"*\"]', NULL, '2025-07-14 19:10:21', '2025-07-14 18:10:21', '2025-07-14 18:10:21'),
(325, 'App\\Models\\Accounts', 81, '81_account_token', '3a37fc654e65510d3f06bf78d4266c3877c96ecfa35d8ff63a7dc5e7aaf99734', '[\"*\"]', NULL, '2025-07-14 19:17:25', '2025-07-14 18:17:25', '2025-07-14 18:17:25'),
(326, 'App\\Models\\Accounts', 81, '81_account_token', '6983421fbfd2b18ffa41819eb5bfcfa305e448b30c5fc8db5af3208ee8b1ecde', '[\"*\"]', NULL, '2025-07-14 20:28:47', '2025-07-14 19:28:47', '2025-07-14 19:28:47'),
(327, 'App\\Models\\Accounts', 81, '81_account_token', '2b9a058af10d19c2c70c0ce6cbf7eee038161ec3b01da581caf7b73311fdd0e6', '[\"*\"]', NULL, '2025-07-14 20:31:21', '2025-07-14 19:31:21', '2025-07-14 19:31:21'),
(328, 'App\\Models\\Accounts', 81, '81_account_token', 'da51f23c18668c389b0773acc1c5e882d9cc61d178f1bf74baea3a6dad9212b7', '[\"*\"]', NULL, '2025-07-14 21:37:49', '2025-07-14 20:37:49', '2025-07-14 20:37:49'),
(329, 'App\\Models\\Accounts', 81, '81_account_token', '3bbc0c9a0eccac14bd04094280c87ae89744e341bb4167e213e0649231910eab', '[\"*\"]', '2025-07-15 00:22:37', '2025-07-15 01:22:02', '2025-07-15 00:22:02', '2025-07-15 00:22:37'),
(330, 'App\\Models\\Accounts', 81, '81_account_token', '9bde6e6d0ee23e8e227f6305d7f607488d504c53cf025fc4008ccf424a45ac60', '[\"*\"]', NULL, '2025-07-15 01:22:58', '2025-07-15 00:22:58', '2025-07-15 00:22:58'),
(331, 'App\\Models\\Accounts', 81, '81_account_token', 'dbd298a47c43e68651b22fe5d0b5d605ca6ccee115e001d89165b559ab365c41', '[\"*\"]', '2025-07-15 00:27:10', '2025-07-15 01:26:37', '2025-07-15 00:26:37', '2025-07-15 00:27:10'),
(332, 'App\\Models\\Accounts', 81, '81_account_token', '6131dd9b433de8619def8e520008b4968a9b105827109b3ae8d2ed379ebe213f', '[\"*\"]', NULL, '2025-07-15 06:20:38', '2025-07-15 05:20:38', '2025-07-15 05:20:38'),
(333, 'App\\Models\\Accounts', 81, '81_account_token', '6d8a98baea5dd9b9330a1adc61aadce8ee27627a0f7d2a09c7007f8d1ca8b918', '[\"*\"]', NULL, '2025-07-15 18:09:36', '2025-07-15 17:09:36', '2025-07-15 17:09:36'),
(334, 'App\\Models\\Accounts', 81, '81_account_token', 'd863adc4cef0358f84a7c073564154cb378926f89e78f2579bd19242d0124d8e', '[\"*\"]', NULL, '2025-07-15 18:54:20', '2025-07-15 17:54:20', '2025-07-15 17:54:20'),
(335, 'App\\Models\\Accounts', 81, '81_account_token', '2afd9646cb1e822e14100a2048a4d14707ed3bb1bd55422d9e39eab05aea3e33', '[\"*\"]', NULL, '2025-07-16 04:17:23', '2025-07-16 03:17:23', '2025-07-16 03:17:23'),
(336, 'App\\Models\\Accounts', 81, '81_account_token', '0180d211c5fa7ef4f0cced6458b7c9dc6435f0d48d97c384842056bd66644c47', '[\"*\"]', NULL, '2025-07-16 20:55:20', '2025-07-16 19:55:20', '2025-07-16 19:55:20'),
(337, 'App\\Models\\Accounts', 81, '81_account_token', '3ea7338f70ad862e3b433c49efb14a53cf90d4e2cbe148a10a7387cd472c128b', '[\"*\"]', NULL, '2025-07-16 21:50:57', '2025-07-16 20:50:57', '2025-07-16 20:50:57'),
(338, 'App\\Models\\Accounts', 81, '81_account_token', 'de60e6b973af967c764d4c2db2c9104dbc7229edcacc6a3d85e84b2fe1bdef38', '[\"*\"]', NULL, '2025-07-18 02:26:55', '2025-07-18 01:26:55', '2025-07-18 01:26:55'),
(339, 'App\\Models\\Accounts', 81, '81_account_token', 'f0f104f0dcceb8468f6cc6c246bb7765995d3ddfa7130e29c829ea25fe7bc1c6', '[\"*\"]', NULL, '2025-07-23 00:51:57', '2025-07-22 23:51:57', '2025-07-22 23:51:57'),
(340, 'App\\Models\\Accounts', 81, '81_account_token', '4693f1ca1a23b8152488fb1087b2f1ea4709d38a8159a30cbb170620cb0e1138', '[\"*\"]', NULL, '2025-07-23 01:22:11', '2025-07-23 00:22:12', '2025-07-23 00:22:12'),
(341, 'App\\Models\\Accounts', 81, '81_account_token', '300dd2907f84d2a1d9682fdfa2dc4ece16445ed4aa1465c239a32760080d5d0c', '[\"*\"]', NULL, '2025-07-23 01:26:58', '2025-07-23 00:26:58', '2025-07-23 00:26:58'),
(342, 'App\\Models\\Accounts', 81, '81_account_token', '534d003c1cc92b6b7471e06c74493c1f2671430e0ad6b7691fd7c690463febe5', '[\"*\"]', NULL, '2025-07-25 02:49:08', '2025-07-25 01:49:08', '2025-07-25 01:49:08'),
(343, 'App\\Models\\Accounts', 81, '81_account_token', '095fb8def1b029460d8b06420e69efb6fbdbff7cddb43c0903e642a22af73f35', '[\"*\"]', NULL, '2025-07-25 03:58:49', '2025-07-25 02:58:49', '2025-07-25 02:58:49'),
(344, 'App\\Models\\Accounts', 81, '81_account_token', 'dd9c3b80e1fc5faf0e670af3df5f2d490df0af8db22b51734a6eeeafe81f1fbb', '[\"*\"]', NULL, '2025-07-25 04:01:44', '2025-07-25 03:01:44', '2025-07-25 03:01:44'),
(345, 'App\\Models\\Accounts', 81, '81_account_token', '3ebf25aea2a0d1aedafad00256756052c603a8d8f70c51ab93e0af9444e901fa', '[\"*\"]', NULL, '2025-07-25 04:03:46', '2025-07-25 03:03:46', '2025-07-25 03:03:46'),
(346, 'App\\Models\\Accounts', 81, '81_account_token', '7decf783b2607a4482f5c4da46bc9f82402be8aaa7c1e93e2bdb5aaaaa187543', '[\"*\"]', NULL, '2025-07-25 04:12:09', '2025-07-25 03:12:09', '2025-07-25 03:12:09'),
(347, 'App\\Models\\Accounts', 81, '81_account_token', '196b9dc4ec0586ff945397e294adf17a6e4da9387ab7f06bfe9ccbf6ab05e54e', '[\"*\"]', NULL, '2025-07-25 04:13:38', '2025-07-25 03:13:38', '2025-07-25 03:13:38'),
(348, 'App\\Models\\Accounts', 81, '81_account_token', '183a1fe09fc08036f14e3fff0ba647dc2f2a65108f772bb6c666c6941308dcf9', '[\"*\"]', NULL, '2025-07-25 06:12:02', '2025-07-25 05:12:02', '2025-07-25 05:12:02'),
(349, 'App\\Models\\Accounts', 81, '81_account_token', '11421129926f97451b1f5d155f3081d9a052dd77248dcc6db14961aab5ed9d76', '[\"*\"]', NULL, '2025-07-25 06:33:02', '2025-07-25 05:33:03', '2025-07-25 05:33:03'),
(350, 'App\\Models\\Accounts', 81, '81_account_token', 'c8cc6106b5b59ca28f5697255e8f10b5218097195d672b512a5f0e21c9813737', '[\"*\"]', NULL, '2025-07-25 21:57:22', '2025-07-25 20:57:22', '2025-07-25 20:57:22'),
(351, 'App\\Models\\Accounts', 81, '81_account_token', '907c3946a5c71ace6d424adc85391ad14d4d0323a92007d94692b1da4292c19c', '[\"*\"]', NULL, '2025-07-27 04:10:54', '2025-07-27 03:10:54', '2025-07-27 03:10:54'),
(352, 'App\\Models\\Accounts', 81, '81_account_token', 'e4e493e13d2e0e1fb84d45b574fb447b4739424a699222819c4296ff62cd93ba', '[\"*\"]', NULL, '2025-07-27 04:17:20', '2025-07-27 03:17:20', '2025-07-27 03:17:20'),
(353, 'App\\Models\\Accounts', 81, '81_account_token', '551e6f8734e7a53df6937290763b97b4398f1386c167a7280ef2168fdc9f975d', '[\"*\"]', NULL, '2025-07-27 06:04:41', '2025-07-27 05:04:41', '2025-07-27 05:04:41'),
(354, 'App\\Models\\Accounts', 81, '81_account_token', 'abb07b803ae863386643596ba35419837d8a609672511d0582ec14aa6581d0e9', '[\"*\"]', NULL, '2025-07-27 06:09:19', '2025-07-27 05:09:19', '2025-07-27 05:09:19'),
(355, 'App\\Models\\Accounts', 81, '81_account_token', '569629bfd7e27e18788f200693e7c183b70842504659de082318479f73e95ee0', '[\"*\"]', NULL, '2025-07-27 06:15:00', '2025-07-27 05:15:01', '2025-07-27 05:15:01'),
(356, 'App\\Models\\Accounts', 81, '81_account_token', '3980612a11538605157ce5f85c7f372d51bc63519842c322e95c0a14142ae45e', '[\"*\"]', NULL, '2025-07-27 07:01:43', '2025-07-27 06:01:43', '2025-07-27 06:01:43'),
(357, 'App\\Models\\Accounts', 81, '81_account_token', '16e6289b35907672326404d36f0cbee706d01dd9447dcea00ff91330fd6ba0d3', '[\"*\"]', NULL, '2025-07-28 02:01:42', '2025-07-28 01:01:42', '2025-07-28 01:01:42'),
(358, 'App\\Models\\Accounts', 81, '81_account_token', 'cdfd254c504f2e58c2df7d40c0d58ea481cbd6f1de4d26bd36c506c92a89f578', '[\"*\"]', NULL, '2025-07-28 02:29:36', '2025-07-28 01:29:36', '2025-07-28 01:29:36'),
(359, 'App\\Models\\Accounts', 81, '81_account_token', '39f2832e511e9276ee6f165d7936fcbdc0da5ee9e0c4e4fa4291db20575e9235', '[\"*\"]', NULL, '2025-07-28 02:30:52', '2025-07-28 01:30:52', '2025-07-28 01:30:52'),
(360, 'App\\Models\\Accounts', 81, '81_account_token', 'a661fd7bba710767a16594d41c31925d88afbf5cdec171b6338025f81ad2d9e5', '[\"*\"]', NULL, '2025-07-28 17:17:50', '2025-07-28 16:17:50', '2025-07-28 16:17:50'),
(361, 'App\\Models\\Accounts', 81, '81_account_token', '5a5ef2c87844235b30d25e8fc945db321f6d6e31f6ac39b8b72e1593122dff70', '[\"*\"]', NULL, '2025-07-28 17:33:26', '2025-07-28 16:33:26', '2025-07-28 16:33:26'),
(362, 'App\\Models\\Admin', 1, '1_admin_token', 'dd16a1c251079bb161ff4dedf7694382ca7c63074a6cf42a0dace7abd970a7d4', '[\"*\"]', NULL, '2025-07-29 00:56:02', '2025-07-28 23:56:03', '2025-07-28 23:56:03'),
(363, 'App\\Models\\Admin', 1, '1_admin_token', '881e5d1e9f6f9bebc915eb77a5385acb39996b66b746702117b83fe638ba83f4', '[\"*\"]', NULL, '2025-07-29 00:57:09', '2025-07-28 23:57:10', '2025-07-28 23:57:10'),
(364, 'App\\Models\\Accounts', 81, '81_account_token', '46a667f45d0ddc77fcf41de6a64b7a7cc627da946c1ee3ef8ef2761433d97414', '[\"*\"]', NULL, '2025-07-29 00:58:01', '2025-07-28 23:58:01', '2025-07-28 23:58:01'),
(365, 'App\\Models\\Admin', 1, '1_admin_token', '3d819518b1acae1feab4d9fa2c8ac9e47edc6ab32cef8b8c606e0cdcc163e340', '[\"*\"]', '2025-07-29 00:00:57', '2025-07-29 00:59:54', '2025-07-28 23:59:54', '2025-07-29 00:00:57'),
(366, 'App\\Models\\Admin', 1, '1_admin_token', '1c07e198d70e69dfe22ca285719b523e1c17aca3811e1b77c6abba9c26044128', '[\"*\"]', NULL, '2025-07-29 01:01:21', '2025-07-29 00:01:21', '2025-07-29 00:01:21'),
(367, 'App\\Models\\Admin', 1, '1_admin_token', 'b5421cf3801d8dc60c8d63333a704bea487295a3498dc044a3657ca918b46cd7', '[\"*\"]', '2025-07-29 18:15:32', '2025-07-29 19:08:05', '2025-07-29 18:08:05', '2025-07-29 18:15:32'),
(368, 'App\\Models\\Accounts', 81, '81_account_token', '3099df55b1d482f2c6cde2e0fdfa951ca9f0d3b891a52eb21648d629beac4558', '[\"*\"]', NULL, '2025-07-29 19:43:41', '2025-07-29 18:43:41', '2025-07-29 18:43:41'),
(369, 'App\\Models\\Accounts', 81, '81_account_token', '81b747b44dbb05c16bfcc5640180d25d58396076da540678f94b0601b8ecd970', '[\"*\"]', NULL, '2025-07-29 21:42:18', '2025-07-29 20:42:18', '2025-07-29 20:42:18'),
(370, 'App\\Models\\Accounts', 81, '81_account_token', '6bc06243e2bac0b1fc5bb916a365e2d1a42718877a87a47096a3e862bf2656ad', '[\"*\"]', NULL, '2025-07-29 21:49:23', '2025-07-29 20:49:23', '2025-07-29 20:49:23'),
(371, 'App\\Models\\Accounts', 81, '81_account_token', '5b0323313289c6485aff956d652e49a978c1b738cbc423c3aa42e2ee3b9df162', '[\"*\"]', NULL, '2025-07-29 22:12:25', '2025-07-29 21:12:25', '2025-07-29 21:12:25'),
(372, 'App\\Models\\Accounts', 81, '81_account_token', '7787b60783389e759162aa81bc858c7c5bbe782cf791f5585a5bf6d14da6ccc1', '[\"*\"]', NULL, '2025-07-29 23:47:04', '2025-07-29 22:47:04', '2025-07-29 22:47:04'),
(373, 'App\\Models\\Accounts', 81, '81_account_token', 'ecfe523f869ead26038ad4e582c60ce12395e95bfb109d9401c10c80fed08995', '[\"*\"]', NULL, '2025-07-30 04:38:53', '2025-07-30 03:38:53', '2025-07-30 03:38:53'),
(374, 'App\\Models\\Accounts', 81, '81_account_token', '4f7f08e6afa3c38d3405a24da321eb288da23697dd4121e7dc99ecaf40d2a1fb', '[\"*\"]', NULL, '2025-07-30 05:06:46', '2025-07-30 04:06:46', '2025-07-30 04:06:46'),
(375, 'App\\Models\\Accounts', 81, '81_account_token', '148256ea81404bfb627a23b3bbf096a876ba981883d053966d9112f9d3e8716b', '[\"*\"]', NULL, '2025-07-30 20:25:51', '2025-07-30 19:25:52', '2025-07-30 19:25:52'),
(376, 'App\\Models\\Accounts', 81, '81_account_token', '32b68fcb54e42269c8bbfe595e481c3a67e082f6bcdc8f79417b742548e7f554', '[\"*\"]', NULL, '2025-07-30 22:31:39', '2025-07-30 21:31:40', '2025-07-30 21:31:40'),
(377, 'App\\Models\\Accounts', 81, '81_account_token', '4bea9ce2232e861c5ec9c66b67e6d03b3a3485fdee9b3c30c69b460c348c578b', '[\"*\"]', NULL, '2025-07-31 00:51:59', '2025-07-30 23:51:59', '2025-07-30 23:51:59'),
(378, 'App\\Models\\Accounts', 81, '81_account_token', 'f625309c1d2095726216e45fc2dc6ce48c04484bc3a392da61ec5b769e685abd', '[\"*\"]', NULL, '2025-07-31 01:55:12', '2025-07-31 00:55:12', '2025-07-31 00:55:12'),
(379, 'App\\Models\\Accounts', 81, '81_account_token', '27c2edeb182171acc1dbbc17998bdf0e633222d9b67115844392ee41c9efdf2f', '[\"*\"]', NULL, '2025-07-31 03:34:05', '2025-07-31 02:34:05', '2025-07-31 02:34:05'),
(380, 'App\\Models\\Accounts', 81, '81_account_token', '2e2956d756a40c86ac127018e2c35cc1ba0ea9b2ef7959d8c2e299132c249d43', '[\"*\"]', NULL, '2025-07-31 04:00:14', '2025-07-31 03:00:14', '2025-07-31 03:00:14'),
(381, 'App\\Models\\Admin', 1, '1_admin_token', 'e00895eb478159af1915b2130678b60ec9bd53acb7401b504dfdee63ac05675e', '[\"*\"]', NULL, '2025-07-31 04:10:11', '2025-07-31 03:10:11', '2025-07-31 03:10:11'),
(382, 'App\\Models\\Accounts', 81, '81_account_token', '9242b62debed478c5cd738d7128a262384d6d655ee486b2d7c40168936a90929', '[\"*\"]', NULL, '2025-07-31 04:12:17', '2025-07-31 03:12:17', '2025-07-31 03:12:17'),
(383, 'App\\Models\\Admin', 1, '1_admin_token', '5b3f5590bbba23ba7ae211084a8d6596badf1aacf670b873b9ae6f85ced2bdd3', '[\"*\"]', NULL, '2025-07-31 04:16:17', '2025-07-31 03:16:17', '2025-07-31 03:16:17'),
(384, 'App\\Models\\Accounts', 81, '81_account_token', '5649880be5ae45bd12957aaeb6f0f94171d4b10c84b4a75bc584c2cc0e0f5182', '[\"*\"]', NULL, '2025-07-31 04:23:31', '2025-07-31 03:23:31', '2025-07-31 03:23:31'),
(385, 'App\\Models\\Admin', 1, '1_admin_token', '14cd0f89f3d8261ec518ad2243d280f9566c2de08e923ad033979cbb1259056a', '[\"*\"]', '2025-07-31 04:10:14', '2025-07-31 04:58:02', '2025-07-31 03:58:02', '2025-07-31 04:10:14'),
(386, 'App\\Models\\Accounts', 81, '81_account_token', '86038fad7f903090cd77a24f62a6d0f528aa1ca59316f32ca9c8066ea05495b4', '[\"*\"]', NULL, '2025-07-31 08:09:35', '2025-07-31 07:09:36', '2025-07-31 07:09:36'),
(387, 'App\\Models\\Accounts', 81, '81_account_token', '9c018c22a809d58b1b3722bc78364b0733fc3788d4f46345b03c4c2aa77aeca9', '[\"*\"]', NULL, '2025-07-31 19:13:15', '2025-07-31 18:13:15', '2025-07-31 18:13:15'),
(388, 'App\\Models\\Admin', 1, '1_admin_token', 'ba0c9b26595acf3d78257a3fe53050f185effb49ce1b0bdb74a3891aac6eb595', '[\"*\"]', NULL, '2025-07-31 19:13:32', '2025-07-31 18:13:33', '2025-07-31 18:13:33'),
(389, 'App\\Models\\Accounts', 81, '81_account_token', 'e441bc593a7537fea16c596fe8ffab0cab377ccef54323d98933cb083e2854b6', '[\"*\"]', NULL, '2025-08-02 00:17:52', '2025-08-01 23:17:52', '2025-08-01 23:17:52'),
(390, 'App\\Models\\Admin', 1, '1_admin_token', '73da6551b949a67dbdb980c392afa6e306fa642ae631794126a350417feeebfa', '[\"*\"]', '2025-08-01 23:35:50', '2025-08-02 00:27:52', '2025-08-01 23:27:52', '2025-08-01 23:35:50'),
(391, 'App\\Models\\Accounts', 81, '81_account_token', 'dfe5b1197422922bc8f509dc6f41f7a98dfa05c3a128a6ceef39b545cd3952fb', '[\"*\"]', NULL, '2025-08-02 21:57:28', '2025-08-02 20:57:28', '2025-08-02 20:57:28'),
(392, 'App\\Models\\Admin', 1, '1_admin_token', '45a9ecaf7334c067320740a08ba200b6e56b4712d711a4f20f064241b8ae8d93', '[\"*\"]', '2025-08-02 21:01:10', '2025-08-02 22:00:30', '2025-08-02 21:00:31', '2025-08-02 21:01:10'),
(393, 'App\\Models\\Accounts', 81, '81_account_token', '39eba0939753a71594e77d2389371805898f4a8f043b0145c0458de4e36508dc', '[\"*\"]', NULL, '2025-08-03 02:49:43', '2025-08-03 01:49:43', '2025-08-03 01:49:43'),
(394, 'App\\Models\\Admin', 1, '1_admin_token', '9b215741d579950b49a43616db521213ca4c81a5f6f7fbcbe08e3d549f753db0', '[\"*\"]', '2025-08-03 01:53:53', '2025-08-03 02:53:28', '2025-08-03 01:53:28', '2025-08-03 01:53:53'),
(395, 'App\\Models\\Accounts', 81, '81_account_token', '6af581995c50be7bee697a312e044be75ec494b6f264d1a0b195bc9b76116bff', '[\"*\"]', NULL, '2025-08-03 04:11:07', '2025-08-03 03:11:08', '2025-08-03 03:11:08'),
(396, 'App\\Models\\Admin', 1, '1_admin_token', 'dd88cdbe276bec7f88d96673a05ca42da9aef6c3ecd43e24ef81b6298061aff8', '[\"*\"]', '2025-08-03 03:17:57', '2025-08-03 04:16:51', '2025-08-03 03:16:51', '2025-08-03 03:17:57'),
(397, 'App\\Models\\Admin', 1, '1_admin_token', '723076d4d5b78f1a7d4a4448e29a85519b2757ac8a0a02b99dd6625a18b79879', '[\"*\"]', NULL, '2025-08-03 05:08:55', '2025-08-03 04:08:55', '2025-08-03 04:08:55'),
(398, 'App\\Models\\Admin', 1, '1_admin_token', '208e30782a2e5316f5c40a71217ef40e85c0bdbacb5ba6e50d2b8015afaf1ce2', '[\"*\"]', NULL, '2025-08-03 05:09:50', '2025-08-03 04:09:50', '2025-08-03 04:09:50'),
(399, 'App\\Models\\Accounts', 81, '81_account_token', '5daa436bec4b4c06a9568f6dbf09cb8a01379d92ee3303942439d9d3ad62b7e6', '[\"*\"]', NULL, '2025-08-03 05:40:22', '2025-08-03 04:40:22', '2025-08-03 04:40:22'),
(400, 'App\\Models\\Accounts', 81, '81_account_token', '54ab99b07399aab9d9ab0b2691d40789d322a065388abc8d80d5861f3e6831a6', '[\"*\"]', NULL, '2025-08-03 05:50:42', '2025-08-03 04:50:42', '2025-08-03 04:50:42'),
(401, 'App\\Models\\Accounts', 81, '81_account_token', '73104b88a0febf84952db0cb1e6de2cc691ac48389ca53b26c1c2a1fbfde7299', '[\"*\"]', NULL, '2025-08-03 06:22:20', '2025-08-03 05:22:21', '2025-08-03 05:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `price_overrides`
--

DROP TABLE IF EXISTS `price_overrides`;
CREATE TABLE IF NOT EXISTS `price_overrides` (
  `company_id` int(11) DEFAULT NULL,
  `turn_around_id` int(11) DEFAULT NULL,
  `price_override` float DEFAULT NULL,
  KEY `idx_company_id_priceoverrides` (`company_id`),
  KEY `idx_turn_around_id_priceoverrides` (`turn_around_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_overrides`
--

INSERT INTO `price_overrides` (`company_id`, `turn_around_id`, `price_override`) VALUES
(8, 19, 100),
(8, 20, 160),
(8, 21, 180),
(1, 13, 100),
(1, 25, 100),
(1, 26, 200);

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

DROP TABLE IF EXISTS `rentals`;
CREATE TABLE IF NOT EXISTS `rentals` (
  `rental_id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `rental_date` datetime NOT NULL DEFAULT current_timestamp(),
  `subtotal` float NOT NULL,
  `is_complete` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`rental_id`),
  KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`rental_id`, `transaction_id`, `rental_date`, `subtotal`, `is_complete`) VALUES
(8, 10, '2025-04-10 06:34:43', 50, 0),
(9, 11, '2025-04-10 06:50:05', 50, 0),
(10, 12, '2025-04-10 07:12:05', 50, 0),
(11, 13, '2025-04-10 18:46:33', 50, 0),
(12, 14, '2025-04-10 19:24:04', 50, 0),
(13, 15, '2025-04-10 20:07:00', 50, 0),
(14, 16, '2025-04-10 20:14:56', 50, 0),
(15, 17, '2025-04-11 19:47:36', 50, 0),
(16, 18, '2025-04-11 20:43:32', 50, 0),
(17, 19, '2025-04-12 20:45:41', 50, 0),
(18, 20, '2025-04-12 20:47:07', 50, 0),
(19, 21, '2025-04-12 21:26:27', 50, 0),
(20, 22, '2025-04-12 21:29:53', 150, 0),
(21, 23, '2025-04-12 21:42:24', 50, 0),
(22, 24, '2025-04-13 01:40:53', 50, 0),
(24, 26, '2025-04-12 16:00:00', 100, 0),
(26, 28, '2025-04-12 16:00:00', 100, 0),
(27, 29, '2025-04-13 02:20:19', 50, 0),
(28, 30, '2025-04-13 02:34:38', 50, 0),
(29, 31, '2025-04-13 02:39:37', 50, 0),
(30, 32, '2025-04-13 03:17:12', 50, 0),
(31, 33, '2025-04-13 03:42:00', 50, 0),
(32, 34, '2025-04-14 05:23:03', 50, 0),
(34, 36, '2025-04-14 05:49:53', 50, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rental_details`
--

DROP TABLE IF EXISTS `rental_details`;
CREATE TABLE IF NOT EXISTS `rental_details` (
  `rental_id` int(11) NOT NULL,
  `serial_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `equipment_condition` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  KEY `fk_rental_id` (`rental_id`) USING BTREE,
  KEY `serial_id` (`serial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental_details`
--

INSERT INTO `rental_details` (`rental_id`, `serial_id`, `start_date`, `end_date`, `return_date`, `quantity`, `is_active`, `equipment_condition`, `price`) VALUES
(8, 1, '2025-04-10 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(9, 2, '2025-04-11 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(10, 3, '2025-04-11 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(11, 4, '2025-04-11 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(12, 5, '2025-04-11 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(13, 6, '2025-04-11 00:00:00', '2025-04-12 00:00:00', NULL, 1, 1, 'good', 50.00),
(14, 7, '2025-04-11 00:00:00', '2025-04-19 00:00:00', NULL, 1, 1, 'good', 50.00),
(15, 8, '2025-04-12 00:00:00', '2025-04-13 00:00:00', NULL, 1, 1, 'good', 50.00),
(16, 9, '2025-04-12 00:00:00', '2025-04-13 00:00:00', NULL, 1, 1, 'good', 50.00),
(17, 10, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(18, 11, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(19, 12, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(20, 13, '2025-04-18 00:00:00', '2025-04-21 00:00:00', NULL, 1, 1, 'good', 50.00),
(21, 14, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(22, 15, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(24, 16, '2025-04-13 00:00:00', '2025-04-14 00:00:00', NULL, 1, 1, 'good', 50.00),
(26, 17, '2025-04-13 00:00:00', '2025-04-14 00:00:00', NULL, 1, 1, 'good', 50.00),
(27, 18, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(28, 19, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(29, 20, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(30, 21, '2025-04-15 00:00:00', '2025-04-16 00:00:00', NULL, 1, 1, 'good', 50.00),
(31, 22, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(32, 26, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00),
(34, 27, '2025-04-14 00:00:00', '2025-04-15 00:00:00', NULL, 1, 1, 'good', 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `synonyms`
--

DROP TABLE IF EXISTS `synonyms`;
CREATE TABLE IF NOT EXISTS `synonyms` (
  `synonym_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `synonym` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`synonym_id`),
  KEY `fk_category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `synonyms`
--

INSERT INTO `synonyms` (`synonym_id`, `category_id`, `synonym`) VALUES
(1, 12, 'Actinolite\r\n'),
(2, 12, 'Amosite\r\n'),
(3, 12, 'Anthophyllite\r\n'),
(4, 12, 'Chrysotile\r\n'),
(5, 12, 'Crocidolite\r\n'),
(6, 12, 'Tremolite\r\n'),
(8, 9, 'Pepsi'),
(9, 9, 'Test'),
(10, 12, 'Test Synonym'),
(11, 12, 'Test Synonym'),
(12, 14, 'Synonym to delete'),
(14, 17, 'Test Synonym'),
(15, 18, 'Test Synonym'),
(17, 12, 'Test Synonym'),
(19, 12, 'Test Synonym'),
(21, 12, 'Test Synonym');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gst` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `account_id`, `transaction_date`, `total_amount`, `subtotal`, `gst`, `status`, `is_active`) VALUES
(1, 1, '2025-04-07 03:34:39', 200.00, 200.00, 0.00, 'pending', 1),
(10, 55, '2025-04-10 06:34:49', 52.50, 50.00, 2.50, 'pending', 1),
(11, 56, '2025-04-10 06:50:09', 52.50, 50.00, 2.50, 'pending', 1),
(12, 57, '2025-04-10 07:12:11', 52.50, 50.00, 2.50, 'pending', 1),
(13, 58, '2025-04-10 18:46:39', 52.50, 50.00, 2.50, 'pending', 1),
(14, 59, '2025-04-10 19:24:10', 52.50, 50.00, 2.50, 'pending', 1),
(15, 60, '2025-04-10 20:07:07', 52.50, 50.00, 2.50, 'pending', 1),
(16, 61, '2025-04-10 20:15:03', 52.50, 50.00, 2.50, 'pending', 1),
(17, 62, '2025-04-11 19:47:45', 52.50, 50.00, 2.50, 'pending', 1),
(18, 63, '2025-04-11 20:43:44', 52.50, 50.00, 2.50, 'pending', 1),
(19, 64, '2025-04-12 20:45:47', 52.50, 50.00, 2.50, 'pending', 1),
(20, 65, '2025-04-12 20:47:12', 52.50, 50.00, 2.50, 'pending', 1),
(21, 66, '2025-04-12 21:26:31', 52.50, 50.00, 2.50, 'pending', 1),
(22, 67, '2025-04-12 21:29:56', 157.50, 150.00, 7.50, 'pending', 1),
(23, 68, '2025-04-12 21:42:28', 52.50, 50.00, 2.50, 'pending', 1),
(24, 69, '2025-04-13 01:40:59', 52.50, 50.00, 2.50, 'pending', 1),
(26, 71, '2025-04-13 01:54:20', 105.00, 100.00, 5.00, 'pending', 1),
(28, 73, '2025-04-13 01:57:41', 105.00, 100.00, 5.00, 'pending', 1),
(29, 74, '2025-04-13 02:20:24', 52.50, 50.00, 2.50, 'pending', 1),
(30, 75, '2025-04-13 02:34:45', 52.50, 50.00, 2.50, 'pending', 1),
(31, 76, '2025-04-13 02:39:45', 52.50, 50.00, 2.50, 'pending', 1),
(32, 77, '2025-04-13 03:17:23', 52.50, 50.00, 2.50, 'pending', 1),
(33, 78, '2025-04-13 03:42:13', 52.50, 50.00, 2.50, 'pending', 1),
(34, 6, '2025-04-14 05:23:07', 52.50, 50.00, 2.50, 'pending', 1),
(36, 80, '2025-04-14 05:50:00', 52.50, 50.00, 2.50, 'pending', 1),
(38, 83, '2025-07-27 03:43:12', 210.00, 200.00, 10.00, 'pending', 1),
(39, 84, '2025-07-27 03:49:37', 210.00, 200.00, 10.00, 'pending', 1),
(40, 85, '2025-07-27 03:52:52', 210.00, 200.00, 10.00, 'pending', 1),
(41, 86, '2025-07-27 04:17:03', 210.00, 200.00, 10.00, 'pending', 1),
(42, 87, '2025-07-27 04:20:26', 210.00, 200.00, 10.00, 'pending', 1),
(43, 88, '2025-07-27 04:34:30', 341.25, 325.00, 16.25, 'pending', 1),
(44, 89, '2025-07-27 04:39:02', 341.25, 325.00, 16.25, 'pending', 1),
(45, 90, '2025-07-27 04:41:38', 341.25, 325.00, 16.25, 'pending', 1),
(46, 91, '2025-07-27 04:44:08', 341.25, 325.00, 16.25, 'pending', 1),
(47, 92, '2025-07-27 04:49:23', 210.00, 200.00, 10.00, 'pending', 1),
(48, 93, '2025-07-27 04:55:14', 210.00, 200.00, 10.00, 'pending', 1),
(49, 94, '2025-07-27 04:56:28', 210.00, 200.00, 10.00, 'pending', 1),
(50, 95, '2025-07-27 04:58:53', 472.50, 450.00, 22.50, 'pending', 1),
(51, 96, '2025-07-27 05:06:08', 178.50, 170.00, 8.50, 'pending', 1),
(52, 97, '2025-07-27 05:10:04', 210.00, 200.00, 10.00, 'pending', 1),
(53, 98, '2025-07-27 05:15:52', 210.00, 200.00, 10.00, 'pending', 1),
(54, 99, '2025-07-27 05:22:01', 472.50, 450.00, 22.50, 'pending', 1),
(55, 100, '2025-07-27 05:27:45', 262.50, 250.00, 12.50, 'pending', 1),
(56, 101, '2025-07-27 06:02:18', 210.00, 200.00, 10.00, 'pending', 1),
(57, 102, '2025-07-27 06:15:07', 210.00, 200.00, 10.00, 'pending', 1),
(58, 103, '2025-07-28 01:03:19', 210.00, 200.00, 10.00, 'pending', 1),
(59, 104, '2025-07-28 16:19:50', 525.00, 500.00, 25.00, 'pending', 1),
(60, 105, '2025-07-28 16:32:46', 525.00, 500.00, 25.00, 'pending', 1),
(61, 106, '2025-07-28 16:34:19', 682.50, 650.00, 32.50, 'pending', 1),
(62, 107, '2025-07-28 16:39:00', 682.50, 650.00, 32.50, 'pending', 1),
(63, 108, '2025-07-28 16:45:45', 472.50, 450.00, 22.50, 'pending', 1),
(64, 109, '2025-07-28 16:51:00', 525.00, 500.00, 25.00, 'pending', 1),
(65, 110, '2025-07-28 17:22:10', 472.50, 450.00, 22.50, 'pending', 1),
(66, 111, '2025-07-28 17:27:47', 472.50, 450.00, 22.50, 'pending', 1),
(67, 112, '2025-07-28 23:59:27', 840.00, 800.00, 40.00, 'pending', 1),
(68, 113, '2025-07-29 18:44:45', 420.00, 400.00, 20.00, 'pending', 1),
(69, 114, '2025-07-29 20:56:29', 420.00, 400.00, 20.00, 'pending', 1),
(70, 115, '2025-07-29 21:02:26', 420.00, 400.00, 20.00, 'pending', 1),
(71, 116, '2025-07-29 21:05:33', 420.00, 400.00, 20.00, 'pending', 1),
(72, 117, '2025-07-29 21:08:11', 420.00, 400.00, 20.00, 'pending', 1),
(73, 118, '2025-07-29 21:13:33', 367.50, 350.00, 17.50, 'pending', 1),
(74, 119, '2025-07-29 21:27:34', 367.50, 350.00, 17.50, 'pending', 1),
(75, 120, '2025-07-29 21:29:45', 367.50, 350.00, 17.50, 'pending', 1),
(76, 121, '2025-07-29 21:34:43', 210.00, 200.00, 10.00, 'pending', 1),
(77, 122, '2025-07-29 21:37:56', 210.00, 200.00, 10.00, 'pending', 1),
(78, 123, '2025-07-29 22:47:54', 315.00, 300.00, 15.00, 'pending', 1),
(79, 124, '2025-07-30 03:39:42', 262.50, 250.00, 12.50, 'pending', 1),
(80, 125, '2025-07-30 03:49:10', 367.50, 350.00, 17.50, 'pending', 1),
(81, 126, '2025-07-30 03:59:57', 367.50, 350.00, 17.50, 'pending', 1),
(82, 127, '2025-07-30 04:07:56', 210.00, 200.00, 10.00, 'pending', 1),
(83, 128, '2025-07-30 04:17:50', 367.50, 350.00, 17.50, 'pending', 1),
(84, 129, '2025-07-30 04:27:52', 367.50, 350.00, 17.50, 'pending', 1),
(85, 130, '2025-07-30 19:26:52', 210.00, 200.00, 10.00, 'pending', 1),
(86, 131, '2025-07-30 21:32:48', 367.50, 350.00, 17.50, 'pending', 1),
(87, 132, '2025-07-30 21:33:56', 367.50, 350.00, 17.50, 'pending', 1),
(88, 133, '2025-07-30 21:48:13', 367.50, 350.00, 17.50, 'pending', 1),
(89, 134, '2025-07-30 21:53:45', 367.50, 350.00, 17.50, 'pending', 1),
(90, 135, '2025-07-30 22:01:23', 682.50, 650.00, 32.50, 'pending', 1),
(91, 136, '2025-07-30 22:08:00', 682.50, 650.00, 32.50, 'pending', 1),
(92, 137, '2025-07-30 22:16:54', 682.50, 650.00, 32.50, 'pending', 1),
(93, 138, '2025-07-30 22:25:35', 682.50, 650.00, 32.50, 'pending', 1),
(94, 139, '2025-07-30 22:30:42', 367.50, 350.00, 17.50, 'pending', 1),
(95, 140, '2025-07-30 22:35:36', 367.50, 350.00, 17.50, 'pending', 1),
(96, 141, '2025-07-30 22:43:53', 367.50, 350.00, 17.50, 'pending', 1),
(97, 142, '2025-07-30 22:49:50', 367.50, 350.00, 17.50, 'pending', 1),
(98, 143, '2025-07-30 22:57:20', 367.50, 350.00, 17.50, 'pending', 1),
(99, 144, '2025-07-30 23:01:22', 367.50, 350.00, 17.50, 'pending', 1),
(100, 145, '2025-07-30 23:06:52', 367.50, 350.00, 17.50, 'pending', 1),
(101, 146, '2025-07-30 23:23:45', 367.50, 350.00, 17.50, 'pending', 1),
(102, 147, '2025-07-30 23:27:12', 367.50, 350.00, 17.50, 'pending', 1),
(103, 148, '2025-07-30 23:29:06', 210.00, 200.00, 10.00, 'pending', 1),
(104, 149, '2025-07-30 23:52:50', 262.50, 250.00, 12.50, 'pending', 1),
(105, 150, '2025-07-31 00:00:58', 262.50, 250.00, 12.50, 'pending', 1),
(106, 151, '2025-07-31 00:04:06', 262.50, 250.00, 12.50, 'pending', 1),
(107, 152, '2025-07-31 00:05:23', 262.50, 250.00, 12.50, 'pending', 1),
(108, 153, '2025-07-31 00:20:37', 262.50, 250.00, 12.50, 'pending', 1),
(109, 154, '2025-07-31 00:25:05', 262.50, 250.00, 12.50, 'pending', 1),
(110, 155, '2025-07-31 00:29:13', 262.50, 250.00, 12.50, 'pending', 1),
(111, 156, '2025-07-31 00:40:39', 315.00, 300.00, 15.00, 'pending', 1),
(112, 157, '2025-07-31 00:48:25', 210.00, 200.00, 10.00, 'pending', 1),
(113, 158, '2025-07-31 00:55:46', 210.00, 200.00, 10.00, 'pending', 1),
(114, 159, '2025-07-31 02:35:50', 210.00, 200.00, 10.00, 'pending', 1),
(115, 160, '2025-07-31 02:38:26', 367.50, 350.00, 17.50, 'pending', 1),
(116, 161, '2025-07-31 02:48:13', 367.50, 350.00, 17.50, 'pending', 1),
(117, 162, '2025-07-31 02:52:00', 367.50, 350.00, 17.50, 'pending', 1),
(118, 163, '2025-07-31 02:56:42', 367.50, 350.00, 17.50, 'pending', 1),
(119, 164, '2025-07-31 03:01:35', 472.50, 450.00, 22.50, 'pending', 1),
(120, 165, '2025-07-31 03:04:31', 472.50, 450.00, 22.50, 'pending', 1),
(121, 166, '2025-07-31 03:13:45', 420.00, 400.00, 20.00, 'pending', 1),
(122, 167, '2025-07-31 03:24:26', 420.00, 400.00, 20.00, 'pending', 1),
(123, 168, '2025-07-31 03:32:08', 367.50, 350.00, 17.50, 'pending', 1),
(124, 169, '2025-07-31 03:48:30', 157.50, 150.00, 7.50, 'pending', 1),
(125, 170, '2025-07-31 03:54:55', 157.50, 150.00, 7.50, 'pending', 1),
(126, 171, '2025-07-31 04:10:29', 315.00, 300.00, 15.00, 'pending', 1),
(127, 172, '2025-07-31 07:11:47', 262.50, 250.00, 12.50, 'pending', 1),
(128, 173, '2025-08-01 23:19:11', 210.00, 200.00, 10.00, 'pending', 1),
(129, 174, '2025-08-02 20:58:30', 367.50, 350.00, 17.50, 'pending', 1),
(130, 175, '2025-08-03 01:50:42', 262.50, 250.00, 12.50, 'pending', 1),
(131, 176, '2025-08-03 03:15:02', 630.00, 600.00, 30.00, 'pending', 1);

-- --------------------------------------------------------

--
-- Table structure for table `turn_around_times`
--

DROP TABLE IF EXISTS `turn_around_times`;
CREATE TABLE IF NOT EXISTS `turn_around_times` (
  `turn_around_id` int(11) NOT NULL AUTO_INCREMENT,
  `method_id` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `turnaround_time` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_default_price` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`turn_around_id`),
  KEY `idx_method_id_turnaroundtimes` (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turn_around_times`
--

INSERT INTO `turn_around_times` (`turn_around_id`, `method_id`, `price`, `turnaround_time`, `is_active`, `is_default_price`) VALUES
(13, 13, 200, '7 Days', 1, 1),
(14, 13, 250, '5 Days', 0, 0),
(15, 13, 300, '3 Days', 0, 0),
(16, 13, 350, '48 Hours', 0, 0),
(17, 13, 400, '24 Hours', 0, 0),
(18, 13, 600, 'Same Day', 0, 0),
(19, 23, 125, '7 Days', 1, 1),
(20, 23, 170, '5 Days', 1, 0),
(21, 23, 190, '3 Days', 1, 0),
(22, 23, 220, '48 Hours', 0, 0),
(23, 23, 250, '24 Hours', 0, 0),
(24, 23, 375, 'Same Day', 0, 0),
(25, 22, 200, '7 Days', 1, 1),
(26, 22, 250, '5 Days', 1, 0),
(27, 22, 300, '3 Days', 1, 0),
(28, 22, 350, '48 Hours', 1, 0),
(29, 22, 400, '24 Hours', 1, 0),
(30, 22, 600, 'Same Day', 1, 0),
(32, 13, NULL, NULL, 1, NULL),
(33, 13, NULL, NULL, 1, NULL),
(34, 13, NULL, NULL, 1, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`analyte_id`) REFERENCES `analytes` (`analyte_id`);

--
-- Constraints for table `equipment_attributes`
--
ALTER TABLE `equipment_attributes`
  ADD CONSTRAINT `fk_equipment_type_id` FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_types` (`equipment_type_id`);

--
-- Constraints for table `equipment_details`
--
ALTER TABLE `equipment_details`
  ADD CONSTRAINT `equipment_details_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`);

--
-- Constraints for table `equipment_values`
--
ALTER TABLE `equipment_values`
  ADD CONSTRAINT `equipment_values_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  ADD CONSTRAINT `fk_attribute_id` FOREIGN KEY (`attribute_id`) REFERENCES `equipment_attributes` (`attribute_id`);

--
-- Constraints for table `methods`
--
ALTER TABLE `methods`
  ADD CONSTRAINT `methods_ibfk_1` FOREIGN KEY (`analyte_id`) REFERENCES `analytes` (`analyte_id`);

--
-- Constraints for table `order_equipment`
--
ALTER TABLE `order_equipment`
  ADD CONSTRAINT `order_equipment_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Constraints for table `price_overrides`
--
ALTER TABLE `price_overrides`
  ADD CONSTRAINT `price_overrides_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  ADD CONSTRAINT `price_overrides_ibfk_2` FOREIGN KEY (`turn_around_id`) REFERENCES `turn_around_times` (`turn_around_id`);

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Constraints for table `rental_details`
--
ALTER TABLE `rental_details`
  ADD CONSTRAINT `rental_details_ibfk_1` FOREIGN KEY (`serial_id`) REFERENCES `equipment_details` (`serial_id`),
  ADD CONSTRAINT `rental_details_ibfk_2` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`rental_id`);

--
-- Constraints for table `synonyms`
--
ALTER TABLE `synonyms`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `turn_around_times`
--
ALTER TABLE `turn_around_times`
  ADD CONSTRAINT `turn_around_times_ibfk_1` FOREIGN KEY (`method_id`) REFERENCES `methods` (`method_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
