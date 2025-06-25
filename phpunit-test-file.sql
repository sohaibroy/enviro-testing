-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Apr 24, 2024 at 08:23 PM
-- Server version: 10.9.8-MariaDB-1:10.9.8+maria~ubu2204
-- PHP Version: 8.2.8

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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`%` PROCEDURE `DeleteExpiredTokens` ()   BEGIN
    DELETE FROM personal_access_tokens WHERE expires_at < NOW();
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `TruncateAllTables` ()   BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tableName VARCHAR(255);

    -- Declare cursor for table names
    DECLARE cur CURSOR FOR
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'enviro_works'; -- Replace 'your_database_name' with your actual database name

    -- Cursor loop
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO tableName;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Generate and execute truncate statement
        SET @truncateStmt = CONCAT('TRUNCATE TABLE ', tableName);
        PREPARE stmt FROM @truncateStmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `company_id`, `first_name`, `last_name`, `password`, `email`, `phone_number`, `is_active`) VALUES
(6, 8, 'Ruan', 'Carvalho', '$2y$12$yvS5TKPNbLil5GReoSnadOr7CLj9LACEt9BS4MVSnDHerYH2be5hG', '1ruanscarvalho@gmail.com', '8253430302', 1),
(7, 8, 'Cole', 'McArthur', '$2y$12$omK1OAosKAAUaY6m8KipA.9Vym6gX7C0xAPEbspEZXvuwJoZnRNnq', 'crobertmcarthur@gmail.com', '(780) 223-2345', 1),
(8, 8, 'Brendan', 'Spencer', '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'bp.spence@hotmail.com', '(780) 221-2347', 1),
(9, 9, 'Jewelyn', 'Canada', '$2y$12$0k9nk6corif7VNc5jhdrtul1aeQrMcJ6XExNGxuyDZ4gpzmCIpXu.', 'jewelyn@gmail.com', '(780) 222-2222', 1),
(10, 9, 'Yiteng', 'Z.', '$2y$12$1wq7A0O6bskarO0dMQOvrus4Wcixx9y3dp3M0hjk/R2LbAI//BBci', 'yiteng@gmail.com', '(825) 111-1234', 1),
(11, 10, 'Nathan', 'Humphrey', '$2y$12$t0xoAgjUrOu4a5p7nOJHFuOwsDJ4HmTyRY4LLsxai0uVp74kkrRTG', 'nathan@gmail.com', '(780) 111-9876', 1),
(13, 1, 'Ruan', 'DangerField', '$2y$12$SZfqdlSi.nTzfEsBnTl9iuftUOm/kq.nz7o5iNgspAeALzbibnuhG', 'ruanscarvalho@gmail.com', '1-999-999-9999', 0),
(14, 1, 'Dan', 'DangerField', '$2y$12$0evOSW6456WTvwniSvrAPuKImJKO/2bIuWZv699sMIEtM1iZqgeRK', 'tanner@gmail.com', '1-999-999-9999', 0),
(15, 1, 'Keller', 'DangerField', '$2y$12$v42j2UbBfMX.Iw.REbKaI.lOoiHRy0eGBVyxNWDoQRX8PYWRegfH.', 'acb@gmail.com', '1-999-999-9999', 0),
(16, 1, 'Linda', 'DangerField', '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'b@gmail.com', '1-999-999-9999', 0),
(17, 1, 'Appel', 'DangerField', '$2y$12$/wjtFJJgbzPlbC2NA3dtG.FGU6s8Jml5S0ZR9ZAObOpJ3WbiHvELK', 'g@gmail.com', '1-999-999-9999', 0),
(18, 1, 'RuanG', 'DangerField', '$2y$12$YLvYwDRpj3tfkZaVbtZdpOhES5XVbdv6CCHoyV1X6FUga.Tp3xJEG', '1bp.spence@hotmail.com', '1-999-999-9999', 0),
(19, 12, 'Richard', 'Robert', '$2y$12$39B/Xdu.sxnTTLWIEjHbKuqGAvvlEFyXj1PgxyKU75gYOcETijone', 'r.robert@gmal.com', '1-222-222-2222', 1),
(22, 1, 'Walkin', 'Joe', '$2y$12$LDpUtKKkadbrJqJV3ygUnewF/Bne7pvkBx2UyrWOEglFeiN30o3Zi', 'J.walkin@a.com', '111-111-1111', 0),
(23, 1, 'Running', 'Dans', '$2y$12$U/34NPVowLN8GH.sf4eSsebQZcpqJzPYzB8b6.7nxF60uGYJDKzPG', 'Drunning@a.com', '111-111-1111', 0),
(24, 1, 'hacker', 'one', '$2y$12$DSG6Dh8IEAXXaGjbYjDA0.8lhC8U0aRtnwiOU0cn.QDka/uYU3V.K', 'admin@hacks.com', '1111111111', 0),
(25, 1, 'John', 'Doe', '$2y$12$LUQ5cUlbTqqSFHaPUvtp7e8SbXwVT.KiNSckCepXxvyN5q243DuSm', 'test860@example.com', NULL, 1),
(26, 1, 'Updated Jester', 'Updated Long', '$2y$12$jLwspj7DB8LsF7MCtbtV3uJlEeBoFJjLMwP9racGayoenB.yH0zie', 'test336@example.com', '234-234-2344', 1),
(27, NULL, NULL, NULL, '$2y$12$1aVFtauRmv1ym9WbEm6TNegaw.TTTWtY7ACFvYyk6DX5zoTQpXCKy', 'rfeest@example.com', NULL, NULL),
(28, 1, 'Walkin', 'Cust', '$2y$12$eTm3WSu8CnofmneoI28AjevBIXhT80m6jOzlrdd4TOzbqH254sCXa', 'w.cust@gmail.com', '111-111-1111', 0),
(29, 1, 'John', 'Doe', '$2y$12$TzoHMKMYaQdHGF0h.h0Ksu1mvQUtXJP9TsV0CQWi1fRFnB5ewQi6i', 'test433@example.com', NULL, 1),
(30, 1, 'Updated Jester', 'Updated Long', '$2y$12$DWfivRse4v7ZakgCEuQKHeshFUG8S.f90DYwwbEhbPO/3Q2ifiNNy', 'test641@example.com', '234-234-2344', 1),
(31, NULL, NULL, NULL, '$2y$12$vdQdcpTefTtYmgZcX0b4A.VMkYy.r8bF/XzkMvQZT9RZcEf.gZbHq', 'brandi46@example.net', NULL, NULL),
(32, NULL, NULL, NULL, '$2y$12$tDES1e/pXRdwBZlOC.epDeWWlClODw08H9D5VHH1V6hDxBRcg.ClC', 'sienna.waelchi@example.net', NULL, NULL),
(33, NULL, NULL, NULL, '$2y$12$Bom5MPpUrA2nCFmMHIWLceCX1ArM5WnvKRLIFzuw3b7/Tt4J/VuRm', 'tina.frami@example.org', NULL, NULL),
(34, NULL, NULL, NULL, '$2y$12$BToKjwOUy.S.vQ6wGXIXeuXzjJUxd6ReoDrF2EgONA7EhZpZqKbPu', 'claudia49@example.org', NULL, NULL),
(35, NULL, NULL, NULL, '$2y$12$1NPSk.IOQjlzNUt0BnzctOeXkDOEAvXyKOiDMGQak93dugsH0iGzu', 'holly.kuhn@example.net', NULL, NULL),
(36, NULL, NULL, NULL, '$2y$12$eXQhOBT29tYlpCbsVTEXkeB3J7iYLn6Y1kCqJAolKNwbxDVNsName', 'vpacocha@example.com', NULL, NULL),
(37, NULL, NULL, NULL, '$2y$12$EQmftVmgGGV8Y1jY0cBQEeFlxs3yQ9j78qpTIoyVrZCbgo0911RMG', 'ykuhn@example.com', NULL, NULL),
(38, NULL, NULL, NULL, '$2y$12$wF6y4r6KDcNNksl6Wl5Og.Lsj/gLLSRHpWKSctPnMw7.rd16O8XZi', 'dstoltenberg@example.org', NULL, NULL),
(39, NULL, NULL, NULL, '$2y$12$tF8eb0QbpUFb55EuZWn7tuBV57tmy73OciiSa.dKxROKNqKcsB8Pq', 'salvador50@example.org', NULL, NULL),
(40, 1, 'John', 'Doe', '$2y$12$sHCTrPP8Nm1gktTzT.zSxuFFAFPlY.kAV54SEakSe5SJ8fVlv7rfy', 'test650@example.com', NULL, 1),
(41, 1, 'Updated Jester', 'Updated Long', '$2y$12$wWnPCYMxC.MlpSXY4Foai.n/r0gwyPhGSbxuJFSrwRthzUPjrkYsO', 'test838@example.com', '234-234-2344', 1),
(42, NULL, NULL, NULL, '$2y$12$f2bH5hl/9g.Onxi5RfAznO1Gl5bzNDbRtH107Ax2CYf3FPuceX1/a', 'rebeka.rutherford@example.org', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `password`, `email`) VALUES
(1, '$2y$12$9A8zusuiJavdd9i7RegoY.wCwcu/3FPwYJgPLxVvDC4omm9cA8CcG', 'admin@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `analytes`
--

CREATE TABLE `analytes` (
  `analyte_id` int(11) NOT NULL,
  `analyte_name` varchar(100) DEFAULT NULL,
  `cas_number` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `analyte_id` int(11) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `technique` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `event_execution_log`
--

CREATE TABLE `event_execution_log` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `execution_time` datetime DEFAULT NULL,
  `rows_deleted` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(42, 'DeleteExpiredTokensEvent', '2024-04-03 15:47:31', 0);

-- --------------------------------------------------------

--
-- Table structure for table `methods`
--

CREATE TABLE `methods` (
  `method_id` int(11) NOT NULL,
  `analyte_id` int(11) DEFAULT NULL,
  `method_name` varchar(100) DEFAULT NULL,
  `matrix` varchar(100) DEFAULT NULL,
  `media` varchar(100) DEFAULT NULL,
  `measurement` varchar(100) DEFAULT NULL,
  `sample_rate` varchar(100) DEFAULT NULL,
  `limit_of_quantification` varchar(100) DEFAULT NULL,
  `general_comments` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `total_amount` float DEFAULT NULL,
  `subtotal` float DEFAULT NULL,
  `gst` float DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `account_id`, `order_date`, `total_amount`, `subtotal`, `gst`, `is_active`) VALUES
(1, 7, '2024-04-05 00:00:00', 210, 200, 10, 1),
(2, 7, '2024-04-05 00:00:00', 3150, 3000, 150, 1),
(3, 7, '2024-04-05 00:00:00', 840, 800, 40, 1),
(4, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(5, 7, '2024-04-09 00:00:00', 262.5, 250, 12.5, 1),
(6, 7, '2024-04-09 00:00:00', 472.5, 450, 22.5, 1),
(7, 7, '2024-04-09 00:00:00', 472.5, 450, 22.5, 1),
(8, 7, '2024-04-09 00:00:00', 472.5, 450, 22.5, 1),
(9, 7, '2024-04-09 00:00:00', 472.5, 450, 22.5, 1),
(10, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(11, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(13, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(14, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(15, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(16, 7, '2024-04-09 00:00:00', 262.5, 250, 12.5, 1),
(17, 7, '2024-04-09 00:00:00', 262.5, 250, 12.5, 1),
(18, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(19, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(20, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(21, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(22, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(23, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(24, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(25, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(26, 7, '2024-04-10 00:00:00', 420, 400, 20, 1),
(27, 7, '2024-04-10 00:00:00', 420, 400, 20, 1),
(28, 7, '2024-04-10 00:00:00', 420, 400, 20, 1),
(29, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(30, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(31, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(32, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(33, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(34, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(35, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(36, 7, '2024-04-09 00:00:00', 210, 200, 10, 1),
(37, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(38, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(39, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(40, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(41, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(42, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(43, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(44, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(45, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(46, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(47, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(48, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(49, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(50, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(51, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(52, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(53, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(54, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(55, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(56, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(57, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(58, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(59, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(60, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(61, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(62, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(63, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(64, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(65, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(66, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(67, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(68, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(69, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(70, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(71, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(72, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(73, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(74, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(75, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(76, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(77, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(78, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(79, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(80, 7, '2024-04-10 00:00:00', 210, 200, 10, 1),
(81, 7, '2024-04-10 00:00:00', 0, 0, 0, 1),
(82, 7, '2024-04-10 00:00:00', 0, 0, 0, 1),
(83, 18, '2024-04-09 00:00:00', 210, 200, 10, 1),
(84, 18, '2024-04-09 00:00:00', 210, 200, 10, 1),
(85, 18, '2024-04-09 00:00:00', 210, 200, 10, 1),
(86, 18, '2024-04-09 00:00:00', 210, 200, 10, 1),
(87, 18, '2024-04-10 00:00:00', 105, 100, 5, 1),
(88, 18, '2024-04-10 00:00:00', 105, 100, 5, 1),
(91, 22, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(96, 22, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(97, 22, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(98, 23, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(99, 23, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(102, 18, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(103, 18, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(104, 24, '2024-04-12 00:00:00', 840, 800, 40, 1),
(105, 8, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(106, 6, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(107, 28, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(108, 6, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(109, 28, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(110, 6, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(111, 28, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(112, 6, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1),
(113, 28, '2024-03-15 00:00:00', 100.5, 85, 15.5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `turn_around_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `quantity_pumps` int(11) DEFAULT NULL,
  `quantity_media` int(11) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`turn_around_id`, `order_id`, `price`, `quantity`, `quantity_pumps`, `quantity_media`, `comments`) VALUES
(13, 1, 200, 1, 0, 0, NULL),
(13, 2, 200, 6, 0, 0, NULL),
(13, 2, 200, 3, 0, 0, NULL),
(13, 2, 200, 5, 0, 0, NULL),
(13, 2, 200, 1, 3, 3, NULL),
(20, 3, 160, 5, 1, 1, NULL),
(13, 4, 200, 1, 0, 0, NULL),
(26, 5, 250, 1, 0, 0, NULL),
(26, 6, 250, 1, 0, 0, NULL),
(25, 6, 200, 1, 0, 0, NULL),
(26, 7, 250, 1, 0, 0, NULL),
(25, 7, 200, 1, 0, 0, NULL),
(26, 8, 250, 1, 0, 0, NULL),
(25, 8, 200, 1, 0, 0, NULL),
(26, 9, 250, 1, 0, 0, NULL),
(25, 9, 200, 1, 0, 0, NULL),
(25, 10, 200, 1, 0, 0, NULL),
(25, 11, 200, 1, 0, 0, NULL),
(25, 13, 200, 1, 0, 0, NULL),
(25, 14, 200, 1, 0, 0, NULL),
(25, 15, 200, 1, 0, 0, NULL),
(26, 16, 250, 1, 0, 0, NULL),
(26, 17, 250, 1, 0, 0, NULL),
(25, 18, 200, 1, 0, 0, NULL),
(25, 19, 200, 1, 0, 0, NULL),
(25, 20, 200, 1, 0, 0, NULL),
(25, 21, 200, 1, 0, 0, NULL),
(25, 22, 200, 1, 0, 0, NULL),
(25, 23, 200, 1, 0, 0, NULL),
(25, 24, 200, 1, 0, 0, NULL),
(25, 25, 200, 1, 0, 0, NULL),
(25, 26, 200, 1, 0, 0, NULL),
(13, 26, 200, 1, 0, 0, NULL),
(25, 27, 200, 1, 0, 0, NULL),
(13, 27, 200, 1, 0, 0, NULL),
(25, 28, 200, 1, 0, 0, NULL),
(13, 28, 200, 1, 0, 0, NULL),
(25, 29, 200, 1, 0, 0, NULL),
(25, 30, 200, 1, 0, 0, NULL),
(25, 31, 200, 1, 0, 0, NULL),
(25, 32, 200, 1, 0, 0, NULL),
(13, 33, 200, 1, 0, 0, NULL),
(13, 34, 200, 1, 0, 0, NULL),
(13, 35, 200, 1, 0, 0, NULL),
(25, 36, 200, 1, 0, 0, NULL),
(25, 37, 200, 1, 0, 0, NULL),
(25, 38, 200, 1, 0, 0, NULL),
(25, 39, 200, 1, 0, 0, NULL),
(25, 40, 200, 1, 0, 0, NULL),
(25, 41, 200, 1, 0, 0, NULL),
(25, 42, 200, 1, 0, 0, NULL),
(13, 43, 200, 1, 0, 0, NULL),
(25, 44, 200, 1, 0, 0, NULL),
(25, 45, 200, 1, 0, 0, NULL),
(25, 46, 200, 1, 0, 0, NULL),
(25, 47, 200, 1, 0, 0, NULL),
(25, 48, 200, 1, 0, 0, NULL),
(13, 49, 200, 1, 0, 0, NULL),
(13, 50, 200, 1, 0, 0, NULL),
(13, 51, 200, 1, 0, 0, NULL),
(25, 52, 200, 1, 0, 0, NULL),
(25, 53, 200, 1, 0, 0, NULL),
(25, 54, 200, 1, 0, 0, NULL),
(13, 55, 200, 1, 0, 0, NULL),
(13, 56, 200, 1, 0, 0, NULL),
(13, 57, 200, 1, 0, 0, NULL),
(13, 58, 200, 1, 0, 0, NULL),
(13, 59, 200, 1, 0, 0, NULL),
(13, 60, 200, 1, 0, 0, NULL),
(13, 61, 200, 1, 0, 0, NULL),
(13, 62, 200, 1, 0, 0, NULL),
(13, 63, 200, 1, 0, 0, NULL),
(13, 64, 200, 1, 0, 0, NULL),
(13, 65, 200, 1, 0, 0, NULL),
(13, 66, 200, 1, 0, 0, NULL),
(13, 67, 200, 1, 0, 0, NULL),
(13, 68, 200, 1, 0, 0, NULL),
(13, 69, 200, 1, 0, 0, NULL),
(13, 70, 200, 1, 0, 0, NULL),
(13, 71, 200, 1, 0, 0, NULL),
(13, 72, 200, 1, 0, 0, NULL),
(13, 73, 200, 1, 0, 0, NULL),
(13, 74, 200, 1, 0, 0, NULL),
(13, 75, 200, 1, 0, 0, NULL),
(13, 76, 200, 1, 0, 0, NULL),
(13, 77, 200, 1, 0, 0, NULL),
(13, 78, 200, 1, 0, 0, NULL),
(13, 79, 200, 1, 0, 0, NULL),
(13, 80, 200, 1, 0, 0, NULL),
(13, 81, 200, 1, 0, 0, NULL),
(13, 82, 200, 1, 0, 0, NULL),
(25, 83, 200, 1, 0, 0, NULL),
(25, 84, 200, 1, 0, 0, NULL),
(25, 85, 200, 1, 0, 0, NULL),
(25, 86, 200, 1, 0, 0, NULL),
(13, 87, 100, 1, 0, 0, NULL),
(13, 88, 100, 1, 0, 0, NULL),
(13, 91, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 96, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 97, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 98, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 99, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 102, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 103, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 104, 200, 1, 0, 0, NULL),
(13, 104, 200, 1, 0, 0, NULL),
(13, 104, 200, 1, 0, 0, NULL),
(13, 104, 200, 1, 0, 0, NULL),
(13, 105, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 106, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 107, 12.5, 1, 1, 1, 'test.'),
(13, 108, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 109, 12.5, 1, 1, 1, 'test.'),
(13, 110, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 111, 12.5, 1, 1, 1, 'test.'),
(13, 112, 12.5, 1, 1, 1, 'IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples'),
(13, 113, 12.5, 1, 1, 1, 'test.');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(18, 'App\\Models\\Accounts', 8, '8_account_token', '198af82c41144b3117afeaff8e61909e88dd893fe1f9010a829fa225d50cc808', '[\"*\"]', NULL, '2024-04-15 21:35:31', '2024-04-15 20:35:31', '2024-04-15 20:35:31'),
(19, 'App\\Models\\Accounts', 8, '8_account_token', '4034d6402b2ab65dd76d3002484354358ac3233697a8eb552dfd7940c33cca9f', '[\"*\"]', NULL, '2024-04-15 21:42:14', '2024-04-15 20:42:14', '2024-04-15 20:42:14'),
(20, 'App\\Models\\Accounts', 8, '8_account_token', 'bd52faa4d505a0e18bf5eb9048ba9ee5200b4fd27fbeba94c5282854658361fe', '[\"*\"]', NULL, '2024-04-15 22:06:04', '2024-04-15 21:06:04', '2024-04-15 21:06:04'),
(21, 'App\\Models\\Admin', 1, 'test-token', '6bb063568ed9eab59b9fb84f6ad890804c848766da80f5af1bdb82cb53140b30', '[\"*\"]', NULL, NULL, '2024-04-23 18:50:15', '2024-04-23 18:50:15'),
(22, 'App\\Models\\Admin', 1, 'test-token', '0ef5025473ceb0b6706fecee1c7cee00bf650f195046d6f4a382cbaf35029ae9', '[\"*\"]', NULL, NULL, '2024-04-23 18:51:30', '2024-04-23 18:51:30'),
(23, 'App\\Models\\Admin', 1, 'test-token', 'cbc6825378b3bf069f32710e79082daf6a14cd0efe190c2a7b26a8128fbeaa97', '[\"*\"]', '2024-04-23 18:53:07', NULL, '2024-04-23 18:53:07', '2024-04-23 18:53:07'),
(24, 'App\\Models\\Admin', 1, 'test-token', '6f1890aa5cbe8852f961b2939eb48d15c2acd68fe5c2da28bb80be77774ec34c', '[\"*\"]', '2024-04-23 18:53:49', NULL, '2024-04-23 18:53:48', '2024-04-23 18:53:49'),
(25, 'App\\Models\\Admin', 1, 'test-token', '6b0a40f6536a4ba3ccb3454bd8286a933fd4d69109f91703b8f72e618282722a', '[\"*\"]', '2024-04-23 18:54:09', NULL, '2024-04-23 18:54:08', '2024-04-23 18:54:09'),
(26, 'App\\Models\\Admin', 1, 'test-token', '495728c16a737485e43538693b0f3b6837d5afbde8e0a57654578691663d2646', '[\"*\"]', NULL, NULL, '2024-04-23 18:58:38', '2024-04-23 18:58:38'),
(27, 'App\\Models\\Admin', 1, 'test-token', '25acff5bb459feb8a6fb4e7eab451e0bea51808bc5d4132b57c85ac1f9fe241c', '[\"*\"]', NULL, NULL, '2024-04-23 18:59:29', '2024-04-23 18:59:29'),
(28, 'App\\Models\\Admin', 1, 'test-token', '081282441f8883d6c12b1ebceeefd77438beae91dc5b08b108b202e2a696538f', '[\"*\"]', NULL, NULL, '2024-04-23 18:59:29', '2024-04-23 18:59:29'),
(29, 'App\\Models\\Admin', 1, 'test-token', '3997fd036d8ba465bc39589273d75c7c6c1e6ce4480ca0aa5fe9285d7f915c26', '[\"*\"]', NULL, NULL, '2024-04-23 19:01:22', '2024-04-23 19:01:22'),
(30, 'App\\Models\\Admin', 1, 'test-token', 'a396da740bc06afbdc3df7a55ed69e32fc8bfaa187b8b34a3721f95a7c732f75', '[\"*\"]', NULL, NULL, '2024-04-23 19:05:48', '2024-04-23 19:05:48'),
(31, 'App\\Models\\Admin', 1, 'test-token', '5b00d32d46e375a5a9d4da72f5c1b8efd35aa4ddc98a177821a4d805770d7b82', '[\"*\"]', NULL, NULL, '2024-04-23 19:06:46', '2024-04-23 19:06:46'),
(32, 'App\\Models\\Admin', 1, 'test-token', '3d01af1d7fd70c63c8b75d03a7bf82ff8410e18063d78881d33005d767aacba0', '[\"*\"]', NULL, NULL, '2024-04-23 19:07:47', '2024-04-23 19:07:47'),
(33, 'App\\Models\\Admin', 1, 'test-token', '61002e68b156f37c06e288586dad0d437910b8625cc6399efa2dbc5d894ad512', '[\"*\"]', NULL, NULL, '2024-04-23 19:08:17', '2024-04-23 19:08:17'),
(34, 'App\\Models\\Admin', 1, 'test-token', '265570d74839d446e1a55bc3d5a8225830207087f74e7d609b6a370fd4bcdea8', '[\"*\"]', '2024-04-23 19:08:40', NULL, '2024-04-23 19:08:39', '2024-04-23 19:08:40'),
(35, 'App\\Models\\Admin', 1, 'test-token', '1b94c771ba2d6d94a1a79571284c73d9f19754f8d099c61a6f7c72af3115ff83', '[\"*\"]', NULL, NULL, '2024-04-23 19:15:38', '2024-04-23 19:15:38'),
(36, 'App\\Models\\Admin', 1, 'test-token', 'b0b32693d9fa848c379080bcfda82c7159063a3b3917a089f0883e78ffd5f5d3', '[\"*\"]', '2024-04-23 19:17:21', NULL, '2024-04-23 19:17:20', '2024-04-23 19:17:21'),
(37, 'App\\Models\\Admin', 1, 'test-token', 'f9e718187a8331dcd45503e083137b08bcf25a06611f1924d103b8dbb3973d85', '[\"*\"]', NULL, NULL, '2024-04-23 19:22:45', '2024-04-23 19:22:45'),
(38, 'App\\Models\\Admin', 1, 'test-token', '62ebcd473e6eac6a442db59a0912c625335700276bbb616d28a4408389510cdc', '[\"*\"]', '2024-04-23 19:23:06', NULL, '2024-04-23 19:23:05', '2024-04-23 19:23:06'),
(39, 'App\\Models\\Admin', 1, 'test-token', '730bffd64af14a91fd5e87e8d60610c2f567fcb7a26b8034bae7f999d2a96b0a', '[\"*\"]', '2024-04-23 19:23:37', NULL, '2024-04-23 19:23:37', '2024-04-23 19:23:37'),
(40, 'App\\Models\\Admin', 1, 'test-token', '6ba5fb01382e0bed192ffd78753091815502a24b17574bab62b654abf53d4671', '[\"*\"]', NULL, NULL, '2024-04-23 19:27:57', '2024-04-23 19:27:57'),
(41, 'App\\Models\\Admin', 1, 'test-token', '0143f2e5f92f22a5d77a6db9913a150d7743215ac90a3f40ffd4f6a2ce5a8251', '[\"*\"]', '2024-04-23 19:28:25', NULL, '2024-04-23 19:28:24', '2024-04-23 19:28:25'),
(42, 'App\\Models\\Admin', 1, 'test-token', 'a78a0b48db6ea07b6f461bc4cb26783ddc700b0315a4d6becfe5c539b3ab20f1', '[\"*\"]', '2024-04-23 19:28:46', NULL, '2024-04-23 19:28:45', '2024-04-23 19:28:46'),
(43, 'App\\Models\\Admin', 1, 'test-token', 'd2fa875663c32a8ec126f84381447ae124733c8b4723bbe2dd6df5c2252cd2fb', '[\"*\"]', NULL, NULL, '2024-04-23 19:32:08', '2024-04-23 19:32:08'),
(44, 'App\\Models\\Admin', 1, 'test-token', '342b213ab86f1df98d8c1482cee59b4fec0a49ee9f8f11958587745fe722e123', '[\"*\"]', '2024-04-23 19:32:29', NULL, '2024-04-23 19:32:29', '2024-04-23 19:32:29'),
(45, 'App\\Models\\Admin', 1, 'test-token', '5ddf95bb5116a3e06587d3ad57056bbb6667c02996a05d79dd52f7b40c9e666c', '[\"*\"]', '2024-04-23 19:33:14', NULL, '2024-04-23 19:33:14', '2024-04-23 19:33:14'),
(46, 'App\\Models\\Admin', 1, 'test-token', 'c57b349f456a34b538debee654f69d72f7a2c54ba36aa663d0cc1ba1b41214ea', '[\"*\"]', '2024-04-23 19:33:32', NULL, '2024-04-23 19:33:32', '2024-04-23 19:33:32'),
(47, 'App\\Models\\Admin', 1, 'test-token', 'bca4276db4e533c0734f34290136d2a644ae7ae2b573ccf705e84754fd36338c', '[\"*\"]', NULL, NULL, '2024-04-23 19:37:43', '2024-04-23 19:37:43'),
(48, 'App\\Models\\Admin', 1, 'test-token', '4ad13ac220b404e6931437678a85241adc9400016e4b9a21b96dc746b9669592', '[\"*\"]', '2024-04-23 19:38:29', NULL, '2024-04-23 19:38:29', '2024-04-23 19:38:29'),
(49, 'App\\Models\\Admin', 1, 'test-token', '1655c8b4684700db0a8563465b434c7c84b2e80b21bf41be430ef01d66160439', '[\"*\"]', '2024-04-23 19:39:45', NULL, '2024-04-23 19:39:44', '2024-04-23 19:39:45'),
(50, 'App\\Models\\Admin', 1, 'test-token', '018eefc61fb04c9a2cc5e9044c4f59c027037e89d579575598939a1bcf15b8e1', '[\"*\"]', NULL, NULL, '2024-04-23 19:46:23', '2024-04-23 19:46:23'),
(51, 'App\\Models\\Admin', 1, 'test-token', '7a7b0cffa3c7aa27a06f8b021216d7d7138e5f9e6a504332af5485ee465ee6cb', '[\"*\"]', '2024-04-23 19:47:16', NULL, '2024-04-23 19:47:15', '2024-04-23 19:47:16'),
(52, 'App\\Models\\Admin', 1, 'test-token', '5a0665c1fc8f939a8cf8bbc1b8f698e2217e4feece7d16f72452f051e3df378c', '[\"*\"]', '2024-04-23 19:47:53', NULL, '2024-04-23 19:47:53', '2024-04-23 19:47:53'),
(53, 'App\\Models\\Admin', 1, 'test-token', '9bb243a0296e28e2bf3bd8a9d64570e74ca4449309bfb72c2b84f9beaca16a1a', '[\"*\"]', NULL, NULL, '2024-04-23 19:49:35', '2024-04-23 19:49:35'),
(54, 'App\\Models\\Admin', 1, 'test-token', '9d0649bf874ab77e6b8ca59ba69ea7b68eb30fbc590afff9bc8db629cb4e1374', '[\"*\"]', '2024-04-23 19:49:57', NULL, '2024-04-23 19:49:57', '2024-04-23 19:49:57'),
(55, 'App\\Models\\Admin', 1, 'test-token', 'f70ac808a65380df592ed7ace4eb019a1f128357ca9fdab2150f9c6ef6711d0d', '[\"*\"]', '2024-04-23 19:53:35', NULL, '2024-04-23 19:53:34', '2024-04-23 19:53:35'),
(56, 'App\\Models\\Admin', 1, 'test-token', '0a3d5233c289eb6baed30ed28d43a15ba23491cd17b67b87f6a31623b90b3802', '[\"*\"]', NULL, NULL, '2024-04-23 19:56:59', '2024-04-23 19:56:59'),
(57, 'App\\Models\\Admin', 1, 'test-token', 'aaa60ed1bcd0f3c3c57195bb70620a33a05a2b4769a7acf8a2efb74f5d4ef7cf', '[\"*\"]', '2024-04-23 19:57:35', NULL, '2024-04-23 19:57:35', '2024-04-23 19:57:35'),
(58, 'App\\Models\\Admin', 1, 'test-token', '377d2e6eb679b94ac4dccd9d5a7a2b1052998f599c26804f420f0bf5c35ee5ad', '[\"*\"]', NULL, NULL, '2024-04-23 19:58:55', '2024-04-23 19:58:55'),
(59, 'App\\Models\\Admin', 1, 'test-token', '5aeeae121d0f430345aace0ad225d3a91a1c9afee57002a826c4a1ff34185eba', '[\"*\"]', '2024-04-23 19:59:47', NULL, '2024-04-23 19:59:46', '2024-04-23 19:59:47'),
(60, 'App\\Models\\Admin', 1, 'test-token', 'e6afe3fd9fcd61a026f1f9c37ec450b3d45c69a72660c6292cd0275dd44de44f', '[\"*\"]', '2024-04-23 20:03:39', NULL, '2024-04-23 20:03:39', '2024-04-23 20:03:39'),
(61, 'App\\Models\\Admin', 1, 'test-token', 'd3edd28621d79b497eb10856ac03a59bbfcef763e7dea2252890d436d168737b', '[\"*\"]', '2024-04-24 19:43:21', NULL, '2024-04-24 19:43:19', '2024-04-24 19:43:21'),
(62, 'App\\Models\\Admin', 1, 'test-token', '69c577c643e2ef6f416f7f0d5f777dd5eab5b4938512f2b27b8950693d1de55f', '[\"*\"]', '2024-04-24 19:43:25', NULL, '2024-04-24 19:43:24', '2024-04-24 19:43:25'),
(63, 'App\\Models\\Admin', 1, 'test-token', 'e6adf6316932475ba39323b3106ad3f2906d18b9be34a804206507263034bb77', '[\"*\"]', '2024-04-24 19:43:25', NULL, '2024-04-24 19:43:25', '2024-04-24 19:43:25'),
(64, 'App\\Models\\Admin', 1, 'test-token', '25930497f36603236c079e8202e1b4442a174353e00f7d78b200fdaa0c6c049a', '[\"*\"]', '2024-04-24 19:43:27', NULL, '2024-04-24 19:43:27', '2024-04-24 19:43:27'),
(65, 'App\\Models\\Admin', 1, 'test-token', '0e0389f0901caa0a5b52f67885502c80d6275429e91e1d4884e7fd352dd344a4', '[\"*\"]', '2024-04-24 19:43:27', NULL, '2024-04-24 19:43:27', '2024-04-24 19:43:27'),
(66, 'App\\Models\\Admin', 1, 'test-token', 'd375818b42d05f43eff669ec1825ca743050d39580f1b91a225dacfef0e3508e', '[\"*\"]', '2024-04-24 19:43:27', NULL, '2024-04-24 19:43:27', '2024-04-24 19:43:27'),
(67, 'App\\Models\\Admin', 1, 'test-token', '8c45e51401e228e63d86d330fc68f7cff58c5321b8609b253d78f1445b7b59c8', '[\"*\"]', '2024-04-24 19:43:27', NULL, '2024-04-24 19:43:27', '2024-04-24 19:43:27'),
(68, 'App\\Models\\Admin', 1, 'test-token', 'cd6d0c75157a626e8ea62e602a250e685e33072738646ce917471e00f2c95a59', '[\"*\"]', '2024-04-24 19:43:28', NULL, '2024-04-24 19:43:28', '2024-04-24 19:43:28'),
(69, 'App\\Models\\Admin', 1, 'test-token', 'a324dc5de0851c809758adb3ca54d5f62c485ed93084cbdab1d1a90fbfddcbe4', '[\"*\"]', '2024-04-24 19:43:28', NULL, '2024-04-24 19:43:28', '2024-04-24 19:43:28'),
(70, 'App\\Models\\Admin', 1, 'test-token', '7f12a6cc1bd4e41d3d2705a34c9d52b38d897a039b70f00668e38382b8b1a2f2', '[\"*\"]', '2024-04-24 19:43:28', NULL, '2024-04-24 19:43:28', '2024-04-24 19:43:28'),
(71, 'App\\Models\\Admin', 1, 'test-token', '2f58ea525d158b2b55d220df0ad76a4d5e0b19989bc6b293536675a279aba623', '[\"*\"]', '2024-04-24 19:43:29', NULL, '2024-04-24 19:43:29', '2024-04-24 19:43:29'),
(72, 'App\\Models\\Admin', 1, 'test-token', '3eba1f9b44c6cbe9abf9a9be36631369af938293109465b7933e52122787af80', '[\"*\"]', '2024-04-24 19:43:29', NULL, '2024-04-24 19:43:29', '2024-04-24 19:43:29'),
(73, 'App\\Models\\Admin', 1, 'test-token', 'e5b908373df33869d37120283f003da9d478c5f975bbc31d40eb7eb2a0e9d923', '[\"*\"]', '2024-04-24 19:43:29', NULL, '2024-04-24 19:43:29', '2024-04-24 19:43:29'),
(74, 'App\\Models\\Admin', 1, '1_admin_token', 'bef8e12be581407e5307269c443e4a0282c7849811113a0edde08e093cc7174d', '[\"*\"]', NULL, '2024-04-24 20:43:30', '2024-04-24 19:43:30', '2024-04-24 19:43:30'),
(76, 'App\\Models\\Admin', 1, 'test-token', 'ac316906f57c4d455fca505f91b6e082d3d2a4cc857fae2a5b12089ecb18dedd', '[\"*\"]', '2024-04-24 19:43:30', NULL, '2024-04-24 19:43:30', '2024-04-24 19:43:30'),
(77, 'App\\Models\\Admin', 1, 'test-token', '0afc865489be9271e1bddc0a8103554bd3bbd847f461b10b01dd11df94b358fb', '[\"*\"]', '2024-04-24 19:43:31', NULL, '2024-04-24 19:43:31', '2024-04-24 19:43:31'),
(78, 'App\\Models\\Admin', 1, 'test-token', 'f23f59a9eb7fad854c8519f61f9541c847d1aa7329bbf8028b5e44c64dd26f0f', '[\"*\"]', '2024-04-24 19:43:31', NULL, '2024-04-24 19:43:31', '2024-04-24 19:43:31'),
(79, 'App\\Models\\Admin', 1, 'test-token', '1a4ea6ee2d95ad206d5c46df358b4e4aeea873e84be4faf0ed15ec86aa6b26fd', '[\"*\"]', '2024-04-24 19:43:31', NULL, '2024-04-24 19:43:31', '2024-04-24 19:43:31'),
(80, 'App\\Models\\Admin', 1, 'test-token', 'ab20f6c3ed3b203e502aeb8c8547fd2482611b17ef39daa1312f89308d486d58', '[\"*\"]', '2024-04-24 19:43:31', NULL, '2024-04-24 19:43:31', '2024-04-24 19:43:31'),
(81, 'App\\Models\\Accounts', 6, 'test-token', 'd0b8e3164487cc9b5358a8c3d161bf56c22cd2e737d40934bf4f155c639048e1', '[\"*\"]', '2024-04-24 19:43:32', NULL, '2024-04-24 19:43:32', '2024-04-24 19:43:32'),
(82, 'App\\Models\\Admin', 1, 'test-token', '9ca6c1813cca12db96b7c9741052cd74c478a4451df7bd93f12ef20c079343c9', '[\"*\"]', '2024-04-24 19:43:32', NULL, '2024-04-24 19:43:32', '2024-04-24 19:43:32'),
(83, 'App\\Models\\Admin', 1, 'test-token', 'd36dddc30e369f8031f94e21da3be4ef224760e50ad674b060c1522fb63a6543', '[\"*\"]', '2024-04-24 19:43:32', NULL, '2024-04-24 19:43:32', '2024-04-24 19:43:32'),
(84, 'App\\Models\\Admin', 1, 'test-token', '2b03b8966e286bca49b980babbe3a65b2483c5f45d13561b3a2062237f7b60a1', '[\"*\"]', '2024-04-24 19:43:33', NULL, '2024-04-24 19:43:33', '2024-04-24 19:43:33'),
(85, 'App\\Models\\Admin', 1, 'test-token', 'f9a9f6cd8c1fce17f5fd1100d6084952405e2f06e53c5a71e7f1d4b069cb3ccb', '[\"*\"]', '2024-04-24 19:43:33', NULL, '2024-04-24 19:43:33', '2024-04-24 19:43:33'),
(86, 'App\\Models\\Admin', 1, 'test-token', '278eb37d5b16479a69b966422cc8751b28bb28261713efd1da2794c8edc21288', '[\"*\"]', '2024-04-24 19:43:33', NULL, '2024-04-24 19:43:33', '2024-04-24 19:43:33'),
(87, 'App\\Models\\Admin', 1, 'test-token', 'e3d262c247a336344ee1fd908201c0c67a5ecfd63a09eee510095b4158b9334f', '[\"*\"]', '2024-04-24 19:43:33', NULL, '2024-04-24 19:43:33', '2024-04-24 19:43:33'),
(88, 'App\\Models\\Admin', 1, 'test-token', 'ddaa4f1824d50fc59278f20a11363bbec631fcad9acaf5248246bfd4f0c52c07', '[\"*\"]', '2024-04-24 19:43:33', NULL, '2024-04-24 19:43:33', '2024-04-24 19:43:33'),
(89, 'App\\Models\\Admin', 1, 'test-token', 'b7322197dce6cd059aa6da3d510fbfd115842ec432954cda05295e710aab1e66', '[\"*\"]', '2024-04-24 19:43:34', NULL, '2024-04-24 19:43:34', '2024-04-24 19:43:34'),
(90, 'App\\Models\\Admin', 1, 'test-token', 'a8dc4759bc3d1f554827f0b9f9fd10e8bb639f1db7f033b73f7e0831ffefad6b', '[\"*\"]', '2024-04-24 19:43:34', NULL, '2024-04-24 19:43:34', '2024-04-24 19:43:34'),
(91, 'App\\Models\\Accounts', 6, 'test-token', 'a2cf77896c6dbc6ba67fed60672747968392393024b6425195d8fe64590e55a5', '[\"*\"]', '2024-04-24 19:44:39', NULL, '2024-04-24 19:44:38', '2024-04-24 19:44:39'),
(92, 'App\\Models\\Admin', 1, 'test-token', 'cdd0721ae815301f54d0ec5ddb133bc4d181e5925f359ad67b0d8c3d2b6c579c', '[\"*\"]', '2024-04-24 19:44:39', NULL, '2024-04-24 19:44:39', '2024-04-24 19:44:39'),
(93, 'App\\Models\\Admin', 1, 'test-token', 'c4e931f7a185aab9aca90765b4acee0ebb66cce756ab6ad7b4e64b52d8414c85', '[\"*\"]', '2024-04-24 19:44:39', NULL, '2024-04-24 19:44:39', '2024-04-24 19:44:39'),
(94, 'App\\Models\\Admin', 1, 'test-token', '69b048cd64d8dd80687683128bfe70701c11108ab526f723fd794b46eeab6d50', '[\"*\"]', '2024-04-24 20:06:00', NULL, '2024-04-24 20:05:59', '2024-04-24 20:06:00'),
(95, 'App\\Models\\Admin', 1, 'test-token', '70704aa54711af9da2eca9b89b10519830163806363d20564d603ac426ceb90f', '[\"*\"]', '2024-04-24 20:06:03', NULL, '2024-04-24 20:06:02', '2024-04-24 20:06:03'),
(96, 'App\\Models\\Admin', 1, 'test-token', '245191e764dd7a65a75521726b4b0e1240f6fcbafd49dbc09492d9db9a056ffb', '[\"*\"]', '2024-04-24 20:06:03', NULL, '2024-04-24 20:06:03', '2024-04-24 20:06:03'),
(97, 'App\\Models\\Admin', 1, 'test-token', '4d558f9e24da7b57e4d81c42799c5f7fb5f94753528d39865968f49bf7de9245', '[\"*\"]', '2024-04-24 20:06:05', NULL, '2024-04-24 20:06:05', '2024-04-24 20:06:05'),
(98, 'App\\Models\\Admin', 1, 'test-token', 'bf688f897a713fbe72315b7ed45ad15f4377461ec0c8ca2bc21cc3980923c4a0', '[\"*\"]', '2024-04-24 20:06:05', NULL, '2024-04-24 20:06:05', '2024-04-24 20:06:05'),
(99, 'App\\Models\\Admin', 1, 'test-token', '4c925c53cd0b71db2252d5c3ddc4f8cba3ebf16644f121e38f70dde7468ee636', '[\"*\"]', '2024-04-24 20:06:05', NULL, '2024-04-24 20:06:05', '2024-04-24 20:06:05'),
(100, 'App\\Models\\Admin', 1, 'test-token', 'd8d9f49f3bb52fd215c1a54b59732495e19f8939b83f4b9cd9a70e9d7ec3a1cd', '[\"*\"]', '2024-04-24 20:06:05', NULL, '2024-04-24 20:06:05', '2024-04-24 20:06:05'),
(101, 'App\\Models\\Admin', 1, 'test-token', '3ebb14a91b303afb1907bdaf3e94fd226b64b104b9e4ef7d0db20def742fc595', '[\"*\"]', '2024-04-24 20:06:05', NULL, '2024-04-24 20:06:05', '2024-04-24 20:06:05'),
(102, 'App\\Models\\Admin', 1, 'test-token', '349d522cc1a1cb21b1b05c791eea552ffd60ede68dcc100637f0f802515416ff', '[\"*\"]', '2024-04-24 20:06:06', NULL, '2024-04-24 20:06:06', '2024-04-24 20:06:06'),
(103, 'App\\Models\\Admin', 1, 'test-token', 'e9cf686c22f7cad47c1c4c543f098b0a112e35f7e508b8f4f20f2571c60aa18b', '[\"*\"]', '2024-04-24 20:06:06', NULL, '2024-04-24 20:06:06', '2024-04-24 20:06:06'),
(104, 'App\\Models\\Admin', 1, 'test-token', '4e41811cc7aac8cd444666a3d1347a19c1fa8bbf6b0e93e733373cc4b0db432c', '[\"*\"]', '2024-04-24 20:06:06', NULL, '2024-04-24 20:06:06', '2024-04-24 20:06:06'),
(105, 'App\\Models\\Admin', 1, 'test-token', '80f84de306cc3d71db566fb180a688f34797d0f2be961ade076cccf15e51e6c1', '[\"*\"]', '2024-04-24 20:06:06', NULL, '2024-04-24 20:06:06', '2024-04-24 20:06:06'),
(106, 'App\\Models\\Admin', 1, 'test-token', '05da0a9b71c46f7fdc6910308d3a40a0bb1a80fc36e194db7d4d63ed0520de3c', '[\"*\"]', '2024-04-24 20:06:06', NULL, '2024-04-24 20:06:06', '2024-04-24 20:06:06'),
(107, 'App\\Models\\Admin', 1, '1_admin_token', '31f619298950a6bb568533301793d0f91f36eff32a1091c9e884e1b7f3acff1d', '[\"*\"]', NULL, '2024-04-24 21:06:07', '2024-04-24 20:06:07', '2024-04-24 20:06:07'),
(109, 'App\\Models\\Admin', 1, 'test-token', '7b64a2e961c4d985dcaf51de2e2fa9d63558691fd8f43166b5f1f6e6ba6d41df', '[\"*\"]', '2024-04-24 20:06:08', NULL, '2024-04-24 20:06:08', '2024-04-24 20:06:08'),
(110, 'App\\Models\\Admin', 1, 'test-token', '1de9362e59bea69195c885e14bd4f58040209bb31c981b6dbf3ccc8b30b89b5a', '[\"*\"]', '2024-04-24 20:06:08', NULL, '2024-04-24 20:06:08', '2024-04-24 20:06:08'),
(111, 'App\\Models\\Admin', 1, 'test-token', 'b91899a738a46e7da7054fb95fe20546ce8ea2e66502a7b45ad0f1d0b7ae3c23', '[\"*\"]', '2024-04-24 20:06:08', NULL, '2024-04-24 20:06:08', '2024-04-24 20:06:08'),
(112, 'App\\Models\\Admin', 1, 'test-token', 'bfb7eeb3c9cb9397a46ace11a506b41f33df7ae490350ec0522381db67d73e90', '[\"*\"]', '2024-04-24 20:06:08', NULL, '2024-04-24 20:06:08', '2024-04-24 20:06:08'),
(113, 'App\\Models\\Admin', 1, 'test-token', '16ca8e47153a08913bc6ba37077a2b2994fb7e079acb5bf3f9fb710d38a40fac', '[\"*\"]', '2024-04-24 20:06:08', NULL, '2024-04-24 20:06:08', '2024-04-24 20:06:08'),
(114, 'App\\Models\\Accounts', 6, 'test-token', '70bd43bb98d3a234a9abf9bd03eb7029a42e1bcbcf3fcb1a847736cdb924fac7', '[\"*\"]', '2024-04-24 20:06:09', NULL, '2024-04-24 20:06:09', '2024-04-24 20:06:09'),
(115, 'App\\Models\\Admin', 1, 'test-token', '4230ca8e637575d3b52493bba7f6cb22d23b116e644eff420175bc4f80d97faf', '[\"*\"]', '2024-04-24 20:06:09', NULL, '2024-04-24 20:06:09', '2024-04-24 20:06:09'),
(116, 'App\\Models\\Admin', 1, 'test-token', 'c53ee92878c258cf6e584849c018eabc080243f4c31f710f56a51c7e9f9a2bd9', '[\"*\"]', '2024-04-24 20:06:09', NULL, '2024-04-24 20:06:09', '2024-04-24 20:06:09'),
(117, 'App\\Models\\Admin', 1, 'test-token', '02055920653d8484ba20c6f0a93404004218403f9eeb845cdb703a60522c36ca', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(118, 'App\\Models\\Admin', 1, 'test-token', '6e7e731ba4c8d44d02aeac4b303149984d90e37c6bbc985257c87a1a7e7ac272', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(119, 'App\\Models\\Admin', 1, 'test-token', 'b6e5d5f5a986244f7011bc91cde3d6ffa86fc2938a3096dc6dd62ba029d9bbc9', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(120, 'App\\Models\\Admin', 1, 'test-token', 'abd284a3d43573a8f2a6cad4f67baa3617e21230b315e1e063dcc75723d70595', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(121, 'App\\Models\\Admin', 1, 'test-token', '4c6eedd440f1ef2cdaf91c8439dc9dcbec40103b5e09d06aaea0aba07217e3f1', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(122, 'App\\Models\\Admin', 1, 'test-token', 'f11149f843f75d064c437f7c8cbbbb84aeeb1ffadaf8cabb3433f807fd6b6040', '[\"*\"]', '2024-04-24 20:06:10', NULL, '2024-04-24 20:06:10', '2024-04-24 20:06:10'),
(123, 'App\\Models\\Admin', 1, 'test-token', '8a436153244ea470b9efdb9dba46e8bd0ceb92a6a6048579ab785ff44a014d60', '[\"*\"]', '2024-04-24 20:06:11', NULL, '2024-04-24 20:06:11', '2024-04-24 20:06:11'),
(124, 'App\\Models\\Admin', 1, '1_admin_token', '5feee386812b22d47f4b2c554e538ec23cf76c1caa07316b479851a9bf5bb7b0', '[\"*\"]', NULL, '2024-04-24 21:07:37', '2024-04-24 20:07:37', '2024-04-24 20:07:37'),
(126, 'App\\Models\\Admin', 1, '1_admin_token', '769df00c74e4287a054b47049369dbd0a9d42cb59377ba46352a9945d00a29fd', '[\"*\"]', NULL, '2024-04-24 21:09:27', '2024-04-24 20:09:27', '2024-04-24 20:09:27'),
(128, 'App\\Models\\Accounts', 10, 'test-token', '0234dcac92a8da12d387225d34ec9b227df7c5484bdc137a648af980404a5709', '[\"*\"]', NULL, NULL, '2024-04-24 20:09:54', '2024-04-24 20:09:54'),
(129, 'App\\Models\\Admin', 1, '1_admin_token', '9186aede0099b0975db02db38a8ccf45479debc6688bc8fe4f75a7b45695dd08', '[\"*\"]', NULL, '2024-04-24 21:09:55', '2024-04-24 20:09:55', '2024-04-24 20:09:55'),
(131, 'App\\Models\\Accounts', 10, 'test-token', 'e9f77550a9fe3994b16eee38f11b7841b78ac8a98a0ed4801e0cf1647e7cb323', '[\"*\"]', NULL, NULL, '2024-04-24 20:11:05', '2024-04-24 20:11:05'),
(132, 'App\\Models\\Admin', 1, '1_admin_token', 'c93e5fe03cbad44d88e037ec1b8cb38d274f64b7720c0a54fb29148344df9a2c', '[\"*\"]', NULL, '2024-04-24 21:11:07', '2024-04-24 20:11:07', '2024-04-24 20:11:07'),
(134, 'App\\Models\\Admin', 1, '1_admin_token', '5051cd224dc28c5cd0253fe033fcdb04c8e9a23e6e150c3274ec3d8697a37877', '[\"*\"]', NULL, '2024-04-24 21:12:37', '2024-04-24 20:12:37', '2024-04-24 20:12:37'),
(136, 'App\\Models\\Admin', 1, '1_admin_token', 'bd80422f77c60127c19b3c4dace419841b1da1cd7bc15268c225b9049e931819', '[\"*\"]', NULL, '2024-04-24 21:13:10', '2024-04-24 20:13:10', '2024-04-24 20:13:10'),
(138, 'App\\Models\\Accounts', 10, 'test-token', '7b3764b8111801d56c6326338e3125db659a325ea78f932ae31f6cf2ddab64fc', '[\"*\"]', NULL, NULL, '2024-04-24 20:13:57', '2024-04-24 20:13:57'),
(139, 'App\\Models\\Accounts', 16, '16_account_token', '761c0950cadb13bc2ca3182250c76bd448b273d2dee165153199162bfd2a55d5', '[\"*\"]', NULL, '2024-04-24 21:13:57', '2024-04-24 20:13:57', '2024-04-24 20:13:57'),
(140, 'App\\Models\\Admin', 1, '1_admin_token', 'dc22ab871a07d523e15c88d809bdc3a9dc0fe28f0d1967472317eed31aa247a1', '[\"*\"]', NULL, '2024-04-24 21:13:58', '2024-04-24 20:13:58', '2024-04-24 20:13:58'),
(142, 'App\\Models\\Admin', 1, 'test-token', '96ba1560a0294ae248b45ebf58062f5242b78844dbb1edf7dcf2246602cf4175', '[\"*\"]', '2024-04-24 20:14:23', NULL, '2024-04-24 20:14:22', '2024-04-24 20:14:23'),
(143, 'App\\Models\\Admin', 1, 'test-token', '5c6dbdc4f94388e86552bde932edb0fda15ba2a54605e6705fb531f79d02b335', '[\"*\"]', '2024-04-24 20:14:24', NULL, '2024-04-24 20:14:23', '2024-04-24 20:14:24'),
(144, 'App\\Models\\Admin', 1, 'test-token', 'd203a88da58bc809d715a9d91a899c9e2ccc68473c322addcbf445866bf27450', '[\"*\"]', '2024-04-24 20:14:24', NULL, '2024-04-24 20:14:24', '2024-04-24 20:14:24'),
(145, 'App\\Models\\Admin', 1, 'test-token', 'e3d9b117e430980413e46cc39b8b0c3a08fcd7e58c0438876439e3441ba5485f', '[\"*\"]', '2024-04-24 20:14:24', NULL, '2024-04-24 20:14:24', '2024-04-24 20:14:24'),
(146, 'App\\Models\\Admin', 1, 'test-token', '62af52d1b23f9f0ea09fd7b243a3859876eb9866fc06f55a0d25dc7a1280dc61', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(147, 'App\\Models\\Admin', 1, 'test-token', '3e039b0d6649bff0cd95ad0c37a8030ca2dcfc51ef911fb0d4c44e8a0236e1f5', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(148, 'App\\Models\\Admin', 1, 'test-token', '4dedec4537507ad45606406c33347674d7eabb532b7f982814ad151accff5f3b', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(149, 'App\\Models\\Admin', 1, 'test-token', 'fab2ef9fbd643d0876a23ec3961ac71baf038e9e73e1e423f8d6b8086c44ebce', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(150, 'App\\Models\\Admin', 1, 'test-token', '8f2eb65f1fc2109107102279e245129a8fb6263b9d77d767b61c94f9b24c5fba', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(151, 'App\\Models\\Admin', 1, 'test-token', '0dbef955f5f951591defad8b1628c6fb9bdcd9f8f4d1a29c6f0c6bf171850c8d', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(152, 'App\\Models\\Admin', 1, 'test-token', 'a9400b5504f8bfbe1c1cf46001c45f7abc0f53bd77dae064e09e4c6dd90ade1a', '[\"*\"]', '2024-04-24 20:14:25', NULL, '2024-04-24 20:14:25', '2024-04-24 20:14:25'),
(153, 'App\\Models\\Admin', 1, 'test-token', '0cacbbc3ff0774eb5d42d59d4e6bf1febdd54e0ded2c9cc4a133ca2815ceeaaf', '[\"*\"]', '2024-04-24 20:14:26', NULL, '2024-04-24 20:14:26', '2024-04-24 20:14:26'),
(154, 'App\\Models\\Accounts', 10, 'test-token', '8efb296f84cd44485d805f009178a0bac4ed060e322672a3e42662e48b7a3f37', '[\"*\"]', NULL, NULL, '2024-04-24 20:14:26', '2024-04-24 20:14:26'),
(155, 'App\\Models\\Accounts', 16, '16_account_token', 'a0cc0515f1fa7d284a20094153883f80745ce4568f285bc352f9691e4401ccd5', '[\"*\"]', NULL, '2024-04-24 21:14:26', '2024-04-24 20:14:26', '2024-04-24 20:14:26'),
(156, 'App\\Models\\Admin', 1, '1_admin_token', '84b41418a45dffe75ff0128ac0e114059f58259b8fa137af30aa354ec6772259', '[\"*\"]', NULL, '2024-04-24 21:14:26', '2024-04-24 20:14:26', '2024-04-24 20:14:26'),
(158, 'App\\Models\\Admin', 1, 'test-token', '7d111446293d5653659f08fae72b50474d0927544449a451471ce3c59965b4f2', '[\"*\"]', '2024-04-24 20:14:27', NULL, '2024-04-24 20:14:27', '2024-04-24 20:14:27'),
(159, 'App\\Models\\Admin', 1, 'test-token', '15b84213f42ce292d4267c0d0031537ba63576a8f2799a1c6de010b179b8632a', '[\"*\"]', '2024-04-24 20:14:27', NULL, '2024-04-24 20:14:27', '2024-04-24 20:14:27'),
(160, 'App\\Models\\Admin', 1, 'test-token', '9f8e4ccc0e8c2b9fbdb91ee732b52c103a699737bb38f55481f796a5b96e07bd', '[\"*\"]', '2024-04-24 20:14:27', NULL, '2024-04-24 20:14:27', '2024-04-24 20:14:27'),
(161, 'App\\Models\\Admin', 1, 'test-token', '006cfab0507a28edd173c1cd53c73f1b1ea2b6d9e7b3e4cfef004e95c3cbf80b', '[\"*\"]', '2024-04-24 20:14:27', NULL, '2024-04-24 20:14:27', '2024-04-24 20:14:27'),
(162, 'App\\Models\\Admin', 1, 'test-token', '355ad235e6ed00e4eda7ad47098c5538d9ce5e0daf80e935c9ddefdbbfdde414', '[\"*\"]', '2024-04-24 20:14:27', NULL, '2024-04-24 20:14:27', '2024-04-24 20:14:27'),
(163, 'App\\Models\\Accounts', 6, 'test-token', '9266fe50abccd495a7f84c424b84163d8c9eb3131b50407781488dd5874a47ac', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(164, 'App\\Models\\Admin', 1, 'test-token', '7da27d41eabc6f5a5af381fb1550eef86ace7af1ca6666201efb82757de2d2dd', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(165, 'App\\Models\\Admin', 1, 'test-token', '318e9dbe358d3f02f91139d6f7ccafed7c38d0df11c7a5ae1b770f21a8b06f9c', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(166, 'App\\Models\\Admin', 1, 'test-token', 'b20ad2fadde96fc9cfe180b53ab48e1ab823ac894989a57c32f953cedd2816a0', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(167, 'App\\Models\\Admin', 1, 'test-token', '99639fa4af8c6bbcd179c7981df39b5afee113835f1ee3f60329f3f3d850183e', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(168, 'App\\Models\\Admin', 1, 'test-token', 'ddea6cccd29520a89b034b1f98b670731a8f347c471d854807f1a3b9fe526692', '[\"*\"]', '2024-04-24 20:14:28', NULL, '2024-04-24 20:14:28', '2024-04-24 20:14:28'),
(169, 'App\\Models\\Admin', 1, 'test-token', 'bcce034658304117b26e1308507af530dbe13bb28d29ac885544830bfaf2f601', '[\"*\"]', '2024-04-24 20:14:29', NULL, '2024-04-24 20:14:29', '2024-04-24 20:14:29'),
(170, 'App\\Models\\Admin', 1, 'test-token', '6abd2a4c65d52e75b8fe2c1f8433b62548b27771f8183d11ac1ab0caaf95d077', '[\"*\"]', '2024-04-24 20:14:29', NULL, '2024-04-24 20:14:29', '2024-04-24 20:14:29'),
(171, 'App\\Models\\Admin', 1, 'test-token', 'cd6a2d570c756f3fb667996b310b3298273a35776e231932be93610371c88b40', '[\"*\"]', '2024-04-24 20:14:29', NULL, '2024-04-24 20:14:29', '2024-04-24 20:14:29'),
(172, 'App\\Models\\Admin', 1, 'test-token', 'd9cb2b4279379797db5a164f4722bc6e2246e57aa448ab8ec2ea07103500342d', '[\"*\"]', '2024-04-24 20:14:29', NULL, '2024-04-24 20:14:29', '2024-04-24 20:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `price_overrides`
--

CREATE TABLE `price_overrides` (
  `company_id` int(11) DEFAULT NULL,
  `turn_around_id` int(11) DEFAULT NULL,
  `price_override` float DEFAULT NULL
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
-- Table structure for table `synonyms`
--

CREATE TABLE `synonyms` (
  `synonym_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `synonym` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `turn_around_times`
--

CREATE TABLE `turn_around_times` (
  `turn_around_id` int(11) NOT NULL,
  `method_id` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `turnaround_time` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_default_price` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `analytes`
--
ALTER TABLE `analytes`
  ADD PRIMARY KEY (`analyte_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `analyte_id` (`analyte_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `event_execution_log`
--
ALTER TABLE `event_execution_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `methods`
--
ALTER TABLE `methods`
  ADD PRIMARY KEY (`method_id`),
  ADD KEY `analyte_id` (`analyte_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD KEY `fk_turn_around_id` (`turn_around_id`),
  ADD KEY `fk_order_id` (`order_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `price_overrides`
--
ALTER TABLE `price_overrides`
  ADD KEY `idx_company_id_priceoverrides` (`company_id`),
  ADD KEY `idx_turn_around_id_priceoverrides` (`turn_around_id`);

--
-- Indexes for table `synonyms`
--
ALTER TABLE `synonyms`
  ADD PRIMARY KEY (`synonym_id`),
  ADD KEY `fk_category_id` (`category_id`);

--
-- Indexes for table `turn_around_times`
--
ALTER TABLE `turn_around_times`
  ADD PRIMARY KEY (`turn_around_id`),
  ADD KEY `idx_method_id_turnaroundtimes` (`method_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `analytes`
--
ALTER TABLE `analytes`
  MODIFY `analyte_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `event_execution_log`
--
ALTER TABLE `event_execution_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `methods`
--
ALTER TABLE `methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `synonyms`
--
ALTER TABLE `synonyms`
  MODIFY `synonym_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `turn_around_times`
--
ALTER TABLE `turn_around_times`
  MODIFY `turn_around_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
-- Constraints for table `methods`
--
ALTER TABLE `methods`
  ADD CONSTRAINT `methods_ibfk_1` FOREIGN KEY (`analyte_id`) REFERENCES `analytes` (`analyte_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_turn_around_id` FOREIGN KEY (`turn_around_id`) REFERENCES `turn_around_times` (`turn_around_id`);

--
-- Constraints for table `price_overrides`
--
ALTER TABLE `price_overrides`
  ADD CONSTRAINT `price_overrides_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  ADD CONSTRAINT `price_overrides_ibfk_2` FOREIGN KEY (`turn_around_id`) REFERENCES `turn_around_times` (`turn_around_id`);

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

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`%` EVENT `DeleteExpiredTokensEvent` ON SCHEDULE EVERY 1 DAY STARTS '2024-04-03 03:33:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    DECLARE num_rows_deleted INT;

    -- Call the procedure to delete expired tokens
    CALL DeleteExpiredTokens();

    -- Get the number of rows affected by the last statement (in this case, the DELETE operation)
    SELECT ROW_COUNT() INTO num_rows_deleted;

    -- Insert a record into the logging table with the number of rows deleted
    INSERT INTO event_execution_log (event_name, execution_time, rows_deleted)
    VALUES ('DeleteExpiredTokensEvent', NOW(), num_rows_deleted);
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
