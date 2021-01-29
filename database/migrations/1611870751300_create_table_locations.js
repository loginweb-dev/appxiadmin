module.exports = {
    "up":  `
        CREATE TABLE locations (
            id bigint(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
            user_id bigint(20) UNSIGNED DEFAULT NULL,
            name varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            description varchar(191) COLLATE utf8mb4_unicode_ci UNIQUE NULL,
            latitude varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            longitude varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL,
            deleted_at timestamp NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    "down": "DROP TABLE locations"
}