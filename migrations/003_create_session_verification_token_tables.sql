CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(255) PRIMARY KEY,
    sessionToken VARCHAR(255) UNIQUE NOT NULL,
    userId CHAR(100) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
);