

CREATE DATABASE IF NOT EXISTS `chap_logindb` DEFAULT CHARACTER SET utf8 COLLATE utf8_turkish_ci;
USE `chap_logindb`;



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


INSERT INTO `admintb` (`id`, `adname`, `adsurname`, `email`, `password`, `status`, `ip`, `reg_date_time`) VALUES
(1, 'Hasan', 'Tuncel', 'admin@chap.com', '123456789', 'Read Only', '::1', '2019-08-09 14:30:26'),
(2018, 'Hasan', 'Chap', 'chapadmin@chap.com', '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', 'Read & Write', '::1', '2019-08-11 00:24:03'),
(41, 'Delta', 'Test', 'delta@chapadmin.com', '123456789', 'Read & Write', '::1', '2019-08-12 13:31:49'),
(1996, 'Hasan', 'Passtest', 'passtest@chapadmin.com', '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', 'Read & Write', '::1', '2019-08-24 12:00:04');



DROP TABLE IF EXISTS `facebookapi`;
CREATE TABLE IF NOT EXISTS `facebookapi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facid` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `facgender` varchar(8) COLLATE utf8_turkish_ci NOT NULL,
  `name&surname` varchar(65) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) COLLATE utf8_turkish_ci NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)



DROP TABLE IF EXISTS `log_in`;
CREATE TABLE IF NOT EXISTS `log_in` (
  `login_id` int(6) NOT NULL AUTO_INCREMENT,
  `usrid` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `log_time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(64) COLLATE utf8_turkish_ci NOT NULL,
  `type_of_browser` varchar(35) COLLATE utf8_turkish_ci NOT NULL,
  `opsystem` varchar(20) COLLATE utf8_turkish_ci NOT NULL,
  PRIMARY KEY (`login_id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;



INSERT INTO `log_in` (`login_id`, `usrid`, `log_time_date`, `ip`, `type_of_browser`, `opsystem`) VALUES
(88, '', '2019-09-17 14:13:26', '::1', 'Google Chrome', 'Windows 10'),
(89, '2018', '2019-09-17 14:16:50', '::1', 'Google Chrome', 'Windows 10'),
(90, '', '2019-09-17 14:23:55', '::1', 'Google Chrome', 'Windows 10'),
(91, '', '2019-09-17 15:05:12', '::1', 'Google Chrome', 'Windows 10'),
(92, 'TAKE_FBID', '2019-09-17 15:35:02', '::1', 'Google Chrome', 'Windows 10'),
(93, '2350482888543383', '2019-09-17 15:40:04', '::1', 'Google Chrome', 'Windows 10');


DROP TABLE IF EXISTS `log_out`;
CREATE TABLE IF NOT EXISTS `log_out` (
  `logout` int(3) NOT NULL AUTO_INCREMENT,
  `usrid` int(5) NOT NULL,
  `logout_time_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`logout`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;







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
) 

CREATE DATABASE IF NOT EXISTS `dbtest` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dbtest`;


DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(30) NOT NULL,
  `userEmail` varchar(60) NOT NULL,
  `userPass` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userPass` (`userPass`)
)



INSERT INTO `users` (`userId`, `userName`, `userEmail`, `userPass`) VALUES
(1, 'hasan', 'hasantuncel@gmail.com', '8000e8c882a61a36d95d54d2c81b9c1e31ac34a0431b60a7903157b002a82f59');




DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) 

