CREATE TABLE profiles
(
    id          CHAR(36) PRIMARY KEY,
    userId      CHAR(36)     NOT NULL UNIQUE,

    firstName   VARCHAR(100) NOT NULL,
    lastName    VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(50),
    address     TEXT,
    dateOfBirth DATE,
    gender      ENUM('male', 'female', 'other', 'prefer-not-to-say'),

    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_profiles_user
        FOREIGN KEY (userId) REFERENCES users (id)
            ON DELETE CASCADE
);
