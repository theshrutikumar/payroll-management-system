-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.42 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for payroll_db
CREATE DATABASE IF NOT EXISTS `payroll_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `payroll_db`;

-- Dumping structure for table payroll_db.attendance
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `status` enum('Present','Absent','Half-Day','Late','Remote') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_attendance_employees` (`emp_id`),
  CONSTRAINT `FK_attendance_employees` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table payroll_db.attendance: ~0 rows (approximately)

-- Dumping structure for table payroll_db.employees
DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `dob` date NOT NULL,
  `dept` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `desig` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `salary` float NOT NULL DEFAULT (0),
  `joining_date` date NOT NULL DEFAULT (curdate()),
  `created_by` int NOT NULL DEFAULT (0),
  PRIMARY KEY (`emp_id`),
  KEY `FK_employees_users` (`created_by`),
  CONSTRAINT `FK_employees_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table payroll_db.employees: ~0 rows (approximately)

-- Dumping structure for table payroll_db.leaves
DROP TABLE IF EXISTS `leaves`;
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL DEFAULT '0',
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `leave_type` enum('Casual','Sick','Earned') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `FK_leaves_employees` (`emp_id`),
  CONSTRAINT `FK_leaves_employees` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table payroll_db.leaves: ~0 rows (approximately)

-- Dumping structure for table payroll_db.payroll
DROP TABLE IF EXISTS `payroll`;
CREATE TABLE IF NOT EXISTS `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `month_year` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `basic` float NOT NULL,
  `hra` float NOT NULL,
  `da` float NOT NULL,
  `overtime` float NOT NULL,
  `unpaid_leaves` int DEFAULT NULL,
  `deductions` float DEFAULT NULL,
  `net_salary` float NOT NULL,
  `pf` float NOT NULL DEFAULT '0',
  `esi` float NOT NULL DEFAULT '0',
  `tds` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_payroll_employees` (`emp_id`),
  CONSTRAINT `FK_payroll_employees` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table payroll_db.payroll: ~0 rows (approximately)

-- Dumping structure for table payroll_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `password_hash` varchar(225) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `role` enum('Admin','HR','Employee') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table payroll_db.users: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
