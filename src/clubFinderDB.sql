-- MariaDB dump 10.19  Distrib 10.4.27-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: clubfinderdb
-- ------------------------------------------------------
-- Server version	10.4.27-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `clubfinderdb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `clubfinderdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `clubfinderdb`;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `announcements` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`announcement_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,3,'Change in venue for meet and greet event','IMPORTANT: Venue change!!!',1),(2,1,'Friday games night cancelled due to unforseen circumstances','IMPORTANT: Event canceled!!!',0),(3,2,'Find out some newly added events','Guides.',1),(4,3,'Join Us for a Night of Fun and Networking!','New Event!!!',0),(5,1,'Discover Your Passion: Club Membership Open Now!','Finding members',1),(6,2,'Calling All Enthusiastic Minds: Get Involved Today!','The call of duty.',0),(7,3,'Exciting Events Coming Up: Save the Dates!','Upcoming events.',1),(8,1,'Unlock Your Potential: Join Our Club and Grow!','Da konkaraa.',0),(9,2,'Be Part of a Vibrant Community: Join our Club!','We need you.',1),(10,4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Unleash Your Inner Astronaut: Join the Space Exploration Society!',1),(11,5,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Calling all Innovators: Join the Robotics and AI Club Today!',1),(12,4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Unleash Your Inner Astronaut: Join the Space Exploration Society!',1),(13,5,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Calling all Innovators: Join the Robotics and AI Club Today!',1);
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_categories`
--

DROP TABLE IF EXISTS `club_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club_categories` (
  `club_id` int(11) NOT NULL,
  `cate_id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`cate_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_categories_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_categories`
--

LOCK TABLES `club_categories` WRITE;
/*!40000 ALTER TABLE `club_categories` DISABLE KEYS */;
INSERT INTO `club_categories` VALUES (1,1,'academic'),(2,2,'hobbies'),(2,3,'campus-communities'),(3,4,'academic'),(4,5,'hobbies'),(4,6,'campus-communities'),(5,7,'academic'),(5,8,'hobbies');
/*!40000 ALTER TABLE `club_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_events`
--

DROP TABLE IF EXISTS `club_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club_events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `event_description` varchar(255) DEFAULT NULL,
  `date_of_event` date DEFAULT NULL,
  `place` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_events_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_events`
--

LOCK TABLES `club_events` WRITE;
/*!40000 ALTER TABLE `club_events` DISABLE KEYS */;
INSERT INTO `club_events` VALUES (1,1,'Meet and Greet','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-01','Braggs Lecture Theatre',0),(2,2,'Friday Games Night','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-08-08','IW Teaching Room',1),(3,2,'Capture the Flag','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-08-15','Computer Science Lab',0),(4,2,'Code Clash','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-08-02','Scotts Lecture Theatre',1),(5,1,'Byte Brawl','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-09','Bar Smith South Teaching Room',0),(6,1,'Hackathon Havoc','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-08-16','Info Tech Lab',1),(7,3,'TechTalks','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-03','Schulz Lecture Theatre',0),(8,3,'CodeFest 2023','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-09-10','Helen Mayo Teaching Room',1),(9,3,'IT Career Fair','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-17','Maths Lab',0),(10,4,'Beyond the Stars: Exploring the Mysteries of the Universe','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-24','Space Lab',0),(11,5,'TechBot Challenge: Showcasing the Future of Robotics and AI','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-31','Machine Learning Lab',0),(12,4,'Beyond the Stars: Exploring the Mysteries of the Universe','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-06-24','Space Lab',0),(13,5,'TechBot Challenge: Showcasing the Future of Robotics and AI','Lorem ipsum dolor sit amet, consectetur adipiscing elit.','2023-07-31','Machine Learning Lab',0);
/*!40000 ALTER TABLE `club_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clubs` (
  `club_id` int(11) NOT NULL AUTO_INCREMENT,
  `manager_usrn` varchar(255) DEFAULT NULL,
  `club_name` varchar(50) DEFAULT NULL,
  `club_objective` varchar(255) DEFAULT NULL,
  `img` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`club_id`),
  KEY `manager_usrn` (`manager_usrn`),
  CONSTRAINT `clubs_ibfk_1` FOREIGN KEY (`manager_usrn`) REFERENCES `users` (`username`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (1,'clubm1','Computer Science Club','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',NULL),(2,'clubm2','Competitve Programming Club','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',NULL),(3,'clubm3','Information Technology Club','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',NULL),(4,'clubm4','Space Exploration Society','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',NULL),(5,'clubm5','Robotics and Artificial Intelligence Club','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',NULL);
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join_request`
--

DROP TABLE IF EXISTS `join_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `join_request` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `status_` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `join_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `join_request_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join_request`
--

LOCK TABLES `join_request` WRITE;
/*!40000 ALTER TABLE `join_request` DISABLE KEYS */;
INSERT INTO `join_request` VALUES (1,15,1,NULL);
/*!40000 ALTER TABLE `join_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `membership` (
  `membership_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `user_id` (`user_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `membership_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership`
--

LOCK TABLES `membership` WRITE;
/*!40000 ALTER TABLE `membership` DISABLE KEYS */;
INSERT INTO `membership` VALUES (1,4,1),(2,4,2),(3,5,2),(4,5,3),(5,6,3),(6,6,1),(11,7,5),(12,8,4),(13,15,4),(14,15,5);
/*!40000 ALTER TABLE `membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rsvp`
--

DROP TABLE IF EXISTS `rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rsvp` (
  `rsvp_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `rep` int(11) DEFAULT NULL,
  PRIMARY KEY (`rsvp_id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `rsvp_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `club_events` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `rsvp_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvp`
--

LOCK TABLES `rsvp` WRITE;
/*!40000 ALTER TABLE `rsvp` DISABLE KEYS */;
INSERT INTO `rsvp` VALUES (1,1,4,0,NULL),(2,2,5,1,0),(3,3,6,1,1),(4,2,4,1,1),(5,3,5,1,0),(6,1,6,1,1);
/*!40000 ALTER TABLE `rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT 2,
  `display_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `clubs_ibfk_1` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,2,NULL,'cokezero','$argon2id$v=19$m=65536,t=3,p=4$Z8ltU2/aCF01AjMhhBY6Qw$X4au/L757sWiIXQJxM6vEXjoNC51iDkXgeFRQeTSx4A','Coke','Zero',20,'m','cokezero@life.com'),(5,2,NULL,'peachicetea','$argon2id$v=19$m=65536,t=3,p=4$iSWpbtR9aI6xFpPe681gzQ$gxxhQl+7C2rEynjmt9iQJQWFoBqTRR3l4+E5Mi+YMdA','Peach','Liptonist',25,'f','peachicetea@life.com'),(6,2,NULL,'dietcoke','$argon2id$v=19$m=65536,t=3,p=4$jrPRxK812gTqDNDalT0B0A$o9gzGUls8CzaQ87gYTcNM3Y7efioo17e6mmgaYptNGY','Diet','cucu',69,'f','dietcokie@life.com'),(7,2,NULL,'dakonkaraa','$argon2id$v=19$m=65536,t=3,p=4$92R+LlqH/DFbi0eEkVYrkw$HWKbxmi3iXXRZ5E4cnk4Dsv9z4bYMyu/XGrkjtDyfUo','Dang Hoan','Nguyen',20,'m','hoanshen1@gmail.com'),(8,1,NULL,'clubm1','$argon2id$v=19$m=65536,t=3,p=4$AAnfq26xCCf3Tp0tRRqdkw$6wwJakaAKlpcUxGVl14DWuqvwV0jj7cESg94TP+I9pM','clubm','1',20,'m','clbm1@gmail.com'),(9,1,NULL,'clubm2','$argon2id$v=19$m=65536,t=3,p=4$Qw4yYRUKZbMY2FKk8DRkvw$6rbCWqGC6B5nqswpeWNmsgsIYq4h8wPr/awqqzcP8Ys','clubm','2',20,'m','clubm2@gmail.com'),(10,1,NULL,'clubm3','$argon2id$v=19$m=65536,t=3,p=4$WFFRxmUC+GOnwAkyq60dBg$05hteFnXOCoeZp/9vQ9OwD7GQSNLeD2RXB+D/9+seQw','clubm','3',20,'m','clubm3@gmail.com'),(11,0,NULL,'admin00root','$argon2id$v=19$m=65536,t=3,p=4$I/gI/2GMuiUa+UBEgancsQ$SJYuBtGFP0HPJW6dVwdYOEgqgaGRkRc5UOe5tipIuPE','DangHoan','Nguyen',20,'m','hoanshen113@gmail.com'),(12,1,NULL,'clubm4','$argon2id$v=19$m=65536,t=3,p=4$MGYkmIFgUQH8Xo2sGZQG6Q$Ko7ZiBA0606NR05Uvoybr1iKOqIpAOJFmKcH2Suj1IE','clubm','4',20,'x','clubm4@gmail.com'),(13,1,NULL,'clubm5','$argon2id$v=19$m=65536,t=3,p=4$MBhlDu+ZWUlLX4ZmIOJB7w$OZHl2SbKQpOVrV3YQGstf7whyR1dvxHOD5CIXZyvk/Q','clubm','5',20,'x','clubm5@gmail.com'),(14,1,NULL,'clubm6','$argon2id$v=19$m=65536,t=3,p=4$uK6ut7pAx8j2+8mrCN8mSw$U0o8CyWzVSginrjY2+hiad7DBOLyCBG1qy7CT2eBTDc','clubm','6',20,'x','clubm6@gmail.com'),(15,2,NULL,'mangoit','$argon2id$v=19$m=65536,t=3,p=4$+ZvffbvE9AX5XA9NyEa3YQ$vCxlFU/KMoSa9HSafTRQjUjw4EgQvi2R8zZs1fpY4H0','Mango','DaLipt Onist',30,'m','mange@it.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-27 14:52:50
