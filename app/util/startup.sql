CREATE DATABASE IF NOT EXISTS open_source_chat;
USE open_source_chat;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Chat;

CREATE TABLE Users (
	id INT AUTO_INCREMENT,
    user_name varchar(30) NOT NULL,
    userKey varchar(100),
    PRIMARY KEY(id)
);

CREATE TABLE Chat (
	id INT auto_increment,
    clientUserID int,
    serviceUserID int,
    message_history JSON,
    PRIMARY KEY (id)
);
    