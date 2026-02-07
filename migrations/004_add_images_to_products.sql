-- Add images field to products table (if not exists)
-- Check if column exists before adding it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'products' 
     AND COLUMN_NAME = 'images') = 0,
    'ALTER TABLE products ADD COLUMN images JSON',
    'SELECT "Column images already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

