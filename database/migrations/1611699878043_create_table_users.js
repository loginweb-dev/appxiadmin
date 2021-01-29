module.exports = {
    "up": `
        CREATE TABLE users (
            id bigint(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
            name varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
            email varchar(191) COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
            password varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
            avatar varchar(191) COLLATE utf8mb4_unicode_ci,
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL,
            deleted_at timestamp NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    "down": "DROP TABLE users"
}