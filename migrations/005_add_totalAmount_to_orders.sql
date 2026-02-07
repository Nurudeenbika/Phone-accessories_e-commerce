-- Add totalAmount column to orders table if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'orders' 
     AND COLUMN_NAME = 'totalAmount') = 0,
    'ALTER TABLE orders ADD COLUMN totalAmount DECIMAL(10, 2) DEFAULT 0.00 AFTER amount',
    'SELECT "Column totalAmount already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
