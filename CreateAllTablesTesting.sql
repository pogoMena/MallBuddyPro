DROP TABLE IF EXISTS subreviews;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS malls;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS questions;


CREATE TABLE malls (
mall_id INT AUTO_INCREMENT PRIMARY KEY,
mall_name VARCHAR(100) NOT NULL,
mall_lat DECIMAL(35,30) NOT NULL,
mall_lng DECIMAL(35,30) NOT NULL,
mall_address varchar(255) NOT NULL
);

CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
admin boolean,
mall_id INT,
FOREIGN KEY (mall_id) REFERENCES malls(mall_id)
);

CREATE TABLE stores (
store_id INT AUTO_INCREMENT PRIMARY KEY,
store_name varchar(255) NOT NULL
);

CREATE TABLE reviews (
review_id INT AUTO_INCREMENT PRIMARY KEY,
rating INT NOT NULL,
review TEXT,
user_id INT NOT NULL,
store_id INT NOT NULL,
mall_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
FOREIGN KEY (mall_id) REFERENCES malls(mall_id) ON DELETE CASCADE
);

CREATE TABLE subreviews (
subreview_id int AUTO_INCREMENT PRIMARY KEY,
subreview TEXT NOT NULL,
review_id INT NOT NULL,
user_id INT NOT NULL,
FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE questions (
question_id INT AUTO_INCREMENT PRIMARY KEY,
question varchar(255) NOT NULL,
answer_type INT NOT NULL,
display boolean NOT NULL
);

CREATE TABLE answers (
answer_id INT AUTO_INCREMENT PRIMARY KEY,
question_id INT NOT NULL,
review_id INT NOT NULL,
text_answer varchar(255),
radio_answer int,
boolean_answer boolean,
FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE
);

INSERT INTO questions (question, answer_type, display)
VALUES ("How was the store experience?", 1, true);

INSERT INTO questions (question, answer_type, display)
VALUES ("How were the products priced?", 1, true);

INSERT INTO questions (question, answer_type, display)
VALUES ("Did the staff make you feel comfortable?", 1, true);

INSERT INTO questions (question, answer_type, display)
VALUES ("What quality were the products?", 1, true);

INSERT INTO questions (question, answer_type, display)
VALUES ("Was the store easy to navigate?", 1, true);

INSERT INTO questions (question, answer_type, display)
VALUES ("Would you reccomend this store?", 2, true);



DELIMITER $$

CREATE TRIGGER after_user_insert

BEFORE INSERT
ON users FOR EACH ROW
BEGIN
    IF NEW.username = 'admin' THEN
		SET NEW.admin = true;
	ELSE
		SET NEW.admin = FALSE;
    END IF;
END$$

DELIMITER ;
