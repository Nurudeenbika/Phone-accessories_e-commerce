CREATE TABLE IF NOT EXISTS favorites (
  id CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  productId CHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY unique_user_product (userId, productId),
  INDEX idx_user (userId),
  INDEX idx_product (productId),

  CONSTRAINT fk_favorites_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_favorites_product
    FOREIGN KEY (productId) REFERENCES products(id)
    ON DELETE CASCADE
);
