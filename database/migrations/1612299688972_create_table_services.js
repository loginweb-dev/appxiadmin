module.exports = {
    "up": `
        CREATE TABLE services (
            id bigint(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
            location_id bigint(20) UNSIGNED DEFAULT NULL,
            driver_id bigint(20) UNSIGNED DEFAULT NULL,
            status int(11) NULL DEFAULT '1',
            rating int(11) NULL DEFAULT NULL,
            created_at timestamp NULL DEFAULT NULL,
            updated_at timestamp NULL DEFAULT NULL,
            deleted_at timestamp NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `,
    "down": "DROP TABLE services"
}