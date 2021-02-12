module.exports = {
    "up":  `
        CREATE TABLE driver_locations (
            id bigint(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
            driver_code varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            latitude varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            longitude varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL,
            deleted_at timestamp NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    "down": "DROP TABLE driver_locations"
}