module.exports = {
    "up": `
        CREATE TABLE users (
            id bigint(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
            code varchar(191) COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
            name varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            phone varchar(191) COLLATE utf8mb4_unicode_ci NULL,
            status int(11) NULL DEFAULT '1',
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL,
            deleted_at timestamp NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    "down": "DROP TABLE users"
}