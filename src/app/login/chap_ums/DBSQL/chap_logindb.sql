
-- Database: `chap_logindb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admintb`
--

DROP TABLE IF EXISTS `admintb`;
CREATE TABLE IF NOT EXISTS `admintb` (
  `id` int(5) NOT NULL,
  `adname` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `adsurname` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_turkish_ci NOT NULL,
  `status` varchar(15) COLLATE utf8_turkish_ci NOT NULL,
  `ip` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `reg_date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `admintb`
--

INSERT INTO `admintb` (`id`, `adname`, `adsurname`, `email`, `password`, `status`, `ip`, `reg_date_time`) VALUES
(1, 'Hasan', 'Tuncel', 'admin@chap.com', '123456789', 'Read Only', '::1', '2019-08-09 14:30:26'),
(2018, 'Hasan', 'Chap', 'chapadmin@chap.com', '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', 'Read & Write', '::1', '2019-08-11 00:24:03'),
(41, 'Delta', 'Test', 'delta@chapadmin.com', '123456789', 'Read & Write', '::1', '2019-08-12 13:31:49');

-- --------------------------------------------------------

--
-- Table structure for table `log_in`
--

DROP TABLE IF EXISTS `log_in`;
CREATE TABLE IF NOT EXISTS `log_in` (
  `login_id` int(6) NOT NULL AUTO_INCREMENT,
  `usrid` int(6) NOT NULL,
  `log_time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `type_of_browser` varchar(35) COLLATE utf8_turkish_ci NOT NULL,
  `opsystem` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `log_in`
--



--
-- Table structure for table `log_out`
--

DROP TABLE IF EXISTS `log_out`;
CREATE TABLE IF NOT EXISTS `log_out` (
  `logout` int(3) NOT NULL AUTO_INCREMENT,
  `usrid` int(5) NOT NULL,
  `logout_time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`logout`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `log_out`
--



-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `userid` int(6) NOT NULL AUTO_INCREMENT,
  `user_ip` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `usrname` varchar(12) COLLATE utf8_turkish_ci NOT NULL,
  `usrsurname` varchar(12) COLLATE utf8_turkish_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_turkish_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_turkish_ci NOT NULL,
  `country` varchar(12) CHARACTER SET utf32 COLLATE utf32_turkish_ci NOT NULL,
  `gender` varchar(6) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dumping data for table `user_info`
--


