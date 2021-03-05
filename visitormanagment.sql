/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : visitormanagment

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 05/03/2021 23:32:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for consult_type
-- ----------------------------
DROP TABLE IF EXISTS `consult_type`;
CREATE TABLE `consult_type`  (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `consultType` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `请勿重复添加`(`consultType`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of consult_type
-- ----------------------------
INSERT INTO `consult_type` VALUES (1, '事业');
INSERT INTO `consult_type` VALUES (2, '健康');
INSERT INTO `consult_type` VALUES (3, '八字');
INSERT INTO `consult_type` VALUES (4, '学业');
INSERT INTO `consult_type` VALUES (5, '感情');
INSERT INTO `consult_type` VALUES (19, '择日');
INSERT INTO `consult_type` VALUES (6, '查仙缘');
INSERT INTO `consult_type` VALUES (7, '查堂口');
INSERT INTO `consult_type` VALUES (8, '财运');
INSERT INTO `consult_type` VALUES (9, '起名');
INSERT INTO `consult_type` VALUES (17, '运势');
INSERT INTO `consult_type` VALUES (10, '风水');

-- ----------------------------
-- Table structure for inquiry_detail
-- ----------------------------
DROP TABLE IF EXISTS `inquiry_detail`;
CREATE TABLE `inquiry_detail`  (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `consultType` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `price` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `photoPath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `result` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `solution` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `feedback` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `vid` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `inquiryDate` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of inquiry_detail
-- ----------------------------
INSERT INTO `inquiry_detail` VALUES ('25d2e770-7d95-11eb-a699-8353bbd7175b', '1231', '健康', '123123', '212312', 'public\\uploads\\2021035\\file-1614936510161.JPG', '12312', '123', '12312', '123', '0f2dd270-7983-11eb-b324-b5f94ab1ab16', NULL);
INSERT INTO `inquiry_detail` VALUES ('8087b250-7da3-11eb-8c13-c939249d1a09', 'qweqwe', '事业', 'qweqwe', ' qweqwe', 'public\\uploads\\2021035\\file-1614942675394.jpg', 'qweqwe', ' qweqwe', '', '', '0f2dd270-7983-11eb-b324-b5f94ab1ab16', NULL);

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test`  (
  `id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of test
-- ----------------------------
INSERT INTO `test` VALUES ('');

-- ----------------------------
-- Table structure for visitor
-- ----------------------------
DROP TABLE IF EXISTS `visitor`;
CREATE TABLE `visitor`  (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '男1，女0',
  `bornDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `visitDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `consultType` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `visitorSource` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `province` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `city` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visitor
-- ----------------------------
INSERT INTO `visitor` VALUES ('0f2dd270-7983-11eb-b324-b5f94ab1ab16', '谢泽华', '女', '2003-5-28 23:00:00', '2021-2-28 13:00:00', '八字', '介绍', '海南省', '三亚市');
INSERT INTO `visitor` VALUES ('75359ad0-791a-11eb-9dfc-d1bf90c401f9', '小娜', '女', '1994-11-23 4:00:00', '2020-8-21 11:00:00', '择日', '介绍', '北京', '北京');
INSERT INTO `visitor` VALUES ('7e552250-7a6b-11eb-9057-4f58f679604c', '1', '男', '2021-3-1 16:52:44', '2021-3-1 16:52:45', '', '', '', '');
INSERT INTO `visitor` VALUES ('926ff530-7aa7-11eb-9057-4f58f679604c', '陈天逸', '女', '1999-1-25 14:0:0', '2021-3-2 0:2:37', '八字', '介绍', '吉林省', '吉林市');
INSERT INTO `visitor` VALUES ('c52ca4c0-791a-11eb-9dfc-d1bf90c401f9', '小娜对象', '男', '1990-1-25 22:00:00', '2020-8-21 11:00:00', '择日', '介绍', '天津', '天津');
INSERT INTO `visitor` VALUES ('fe851fe0-791a-11eb-9dfc-d1bf90c401f9', '王雨欣', '女', '2002-8-5 11:00:00', '2021-2-2 13:00:00', '起名', '介绍', '新疆', NULL);

-- ----------------------------
-- Table structure for visitor_source
-- ----------------------------
DROP TABLE IF EXISTS `visitor_source`;
CREATE TABLE `visitor_source`  (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `visitorSource` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `请勿重复添加`(`visitorSource`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visitor_source
-- ----------------------------
INSERT INTO `visitor_source` VALUES (11, 'b站');
INSERT INTO `visitor_source` VALUES (1, '介绍');
INSERT INTO `visitor_source` VALUES (10, '其他');
INSERT INTO `visitor_source` VALUES (5, '小红书');
INSERT INTO `visitor_source` VALUES (2, '微博');
INSERT INTO `visitor_source` VALUES (4, '知乎');
INSERT INTO `visitor_source` VALUES (6, '豆瓣');
INSERT INTO `visitor_source` VALUES (3, '闲鱼');

SET FOREIGN_KEY_CHECKS = 1;
