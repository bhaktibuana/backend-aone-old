-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: local_aone
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `File` (
  `id` int NOT NULL AUTO_INCREMENT,
  `repository` varchar(100) NOT NULL,
  `category` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `ipAddress` varchar(100) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `device` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `File_FK` (`repository`),
  CONSTRAINT `File_FK` FOREIGN KEY (`repository`) REFERENCES `UserRepo` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File`
--

LOCK TABLES `File` WRITE;
/*!40000 ALTER TABLE `File` DISABLE KEYS */;
/*!40000 ALTER TABLE `File` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `userRoleId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `inactive` tinyint(1) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_UN` (`username`),
  UNIQUE KEY `User_UN_1` (`email`),
  KEY `User_FK` (`userRoleId`),
  CONSTRAINT `User_FK` FOREIGN KEY (`userRoleId`) REFERENCES `UserRole` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (3,'adminaone','admin@aone.bhaktibuana.com','3d854aaf6ff182c4706e7ead9a7ecf235fbd2f65593e93b2edfd342cdc961ab6','Admin Aone','',1,'2023-07-22 07:42:48','2023-07-22 08:26:39',0,1),(4,'bhaktibuana','bhaktibuana19@gmail.com','3d854aaf6ff182c4706e7ead9a7ecf235fbd2f65593e93b2edfd342cdc961ab6','Bhakti','Mega Buana',2,'2023-07-22 09:40:39','2023-07-22 09:43:27',0,1);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserLogin`
--

DROP TABLE IF EXISTS `UserLogin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserLogin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `ipAddress` varchar(100) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `lastLoginAt` datetime DEFAULT NULL,
  `device` varchar(100) DEFAULT NULL,
  `otpToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserLogin_UN` (`userId`),
  CONSTRAINT `UserLogin_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserLogin`
--

LOCK TABLES `UserLogin` WRITE;
/*!40000 ALTER TABLE `UserLogin` DISABLE KEYS */;
INSERT INTO `UserLogin` VALUES (3,3,'::1','PostmanRuntime/7.32.3','2023-07-22 15:08:10','Postman Desktop',NULL),(4,4,'::1','PostmanRuntime/7.32.3','2023-07-23 07:32:55','Postman Desktop',NULL);
/*!40000 ALTER TABLE `UserLogin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserRepo`
--

DROP TABLE IF EXISTS `UserRepo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRepo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `uuid` varchar(100) NOT NULL,
  `apiKey` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserRepo_UN_1` (`uuid`),
  UNIQUE KEY `UserRepo_UN_2` (`apiKey`),
  UNIQUE KEY `UserRepo_UN` (`userId`),
  CONSTRAINT `UserRepo_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserRepo`
--

LOCK TABLES `UserRepo` WRITE;
/*!40000 ALTER TABLE `UserRepo` DISABLE KEYS */;
INSERT INTO `UserRepo` VALUES (2,3,'48096863-d49f-4aaa-81c6-a5c8dfa34663','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDgwOTY4NjMtZDQ5Zi00YWFhLTgxYzYtYTVjOGRmYTM0NjYzIiwiaWF0IjoxNjkwMDExNzY4fQ.Og9IfCDdSymoSBmdUHSQPo33i37LpqlAaATuIcJNngc'),(3,4,'b497ae36-a008-4ee0-bc1f-a5f84e991b1c','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYjQ5N2FlMzYtYTAwOC00ZWUwLWJjMWYtYTVmODRlOTkxYjFjIiwiaWF0IjoxNjkwMDE4ODM5fQ.lCbyl1G-dIyxjHGD7KyMtrZA2Ii-jv7EgM1RQXEq1cE');
/*!40000 ALTER TABLE `UserRepo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserRole`
--

DROP TABLE IF EXISTS `UserRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserRole_UN` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='STATIC DATA';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserRole`
--

LOCK TABLES `UserRole` WRITE;
/*!40000 ALTER TABLE `UserRole` DISABLE KEYS */;
INSERT INTO `UserRole` VALUES (1,'AD','Admin'),(2,'RG','Regular');
/*!40000 ALTER TABLE `UserRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'local_aone'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-23 16:51:44
