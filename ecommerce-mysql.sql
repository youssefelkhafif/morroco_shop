SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `delivery_zones`;
DROP TABLE IF EXISTS `migrations`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `passkeys`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `product_colors`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `themes`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `cache` (`key` varchar(255) not null, `value` text not null, `expiration` integer not null, primary key (`key`));

CREATE TABLE `cache_locks` (`key` varchar(255) not null, `owner` varchar(255) not null, `expiration` integer not null, primary key (`key`));

CREATE TABLE `categories` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `name` varchar(255) not null, `slug` varchar(255) not null, `is_active` tinyint(1) not null default '1', `created_at` datetime, `updated_at` datetime);

CREATE TABLE `collections` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `title` varchar(255) not null, `subtitle` varchar(255) not null, `badge` varchar(255) not null, `sort_order` integer not null default '0', `is_active` tinyint(1) not null default '1', `created_at` datetime, `updated_at` datetime, `image_url` varchar(255));

CREATE TABLE `delivery_zones` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `city` varchar(255) not null, `delivery_fee_mad` decimal(20,2) not null, `estimated_delivery_days` integer, `is_active` tinyint(1) not null default '1', `created_at` datetime, `updated_at` datetime, `district` varchar(255) not null default 'All districts', `zone_name` varchar(255) not null default 'Standard');

CREATE TABLE `migrations` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `migration` varchar(255) not null, `batch` integer not null);

CREATE TABLE `notifications` (`id` varchar(255) not null, `type` varchar(255) not null, `notifiable_type` varchar(255) not null, `notifiable_id` integer not null, `data` text not null, `read_at` datetime, `created_at` datetime, `updated_at` datetime, primary key (`id`));

CREATE TABLE `order_items` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `order_id` integer not null, `product_id` integer, `product_name` varchar(255) not null, `product_slug` varchar(255) not null, `unit_price_mad` decimal(20,2) not null, `quantity` integer not null, `line_total_mad` decimal(20,2) not null, `created_at` datetime, `updated_at` datetime, `product_color_id` integer, `product_color_name` varchar(255), foreign key(`product_id`) references products(`id`) on delete set null on update no action, foreign key(`order_id`) references orders(`id`) on delete cascade on update no action, foreign key(`product_color_id`) references `product_colors`(`id`) on delete set null);

CREATE TABLE `orders` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `order_number` varchar(255) not null, `customer_id` integer, `delivery_zone_id` integer, `customer_name` varchar(255) not null, `customer_phone` varchar(255) not null, `customer_email` varchar(255), `delivery_city` varchar(255) not null, `delivery_district` varchar(255) not null, `delivery_zone_name` varchar(255) not null, `delivery_address` text not null, `customer_note` text, `payment_method` varchar(255) not null default 'cash_on_delivery', `status` varchar(255) not null default 'pending_whatsapp_confirmation', `subtotal_mad` decimal(20,2) not null, `delivery_fee_mad` decimal(20,2) not null, `total_mad` decimal(20,2) not null, `cod_amount_mad` decimal(20,2) not null, `stock_deducted_at` datetime, `carrier_name` varchar(255), `tracking_number` varchar(255), `confirmed_at` datetime, `shipped_at` datetime, `delivered_at` datetime, `cancelled_at` datetime, `no_answer_at` datetime, `refused_at_delivery_at` datetime, `returned_at` datetime, `created_at` datetime, `updated_at` datetime, `confirmed_by` integer, `preparing_at` datetime, `cancelled_by` integer, foreign key(`confirmed_by`) references users(`id`) on delete set null on update no action, foreign key(`customer_id`) references users(`id`) on delete set null on update no action, foreign key(`delivery_zone_id`) references delivery_zones(`id`) on delete set null on update no action, foreign key(`cancelled_by`) references `users`(`id`) on delete set null);

CREATE TABLE `passkeys` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `user_id` integer not null, `name` varchar(255) not null, `credential_id` varchar(255) not null, `credential` text not null, `last_used_at` datetime, `created_at` datetime, `updated_at` datetime, foreign key(`user_id`) references `users`(`id`) on delete cascade);

CREATE TABLE `password_reset_tokens` (`email` varchar(255) not null, `token` varchar(255) not null, `created_at` datetime, primary key (`email`));

CREATE TABLE `product_colors` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `product_id` integer not null, `name` varchar(255) not null, `hex_code` varchar(255), `sort_order` integer not null default '0', `created_at` datetime, `updated_at` datetime, foreign key(`product_id`) references `products`(`id`) on delete restrict);

CREATE TABLE `product_images` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `product_id` integer not null, `path` varchar(255) not null, `sort_order` integer not null default '0', `created_at` datetime, `updated_at` datetime, foreign key(`product_id`) references `products`(`id`) on delete cascade);

CREATE TABLE `products` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `category_id` integer not null, `name` varchar(255) not null, `slug` varchar(255) not null, `description` text, `price_mad` decimal(20,2) not null, `old_price_mad` decimal(20,2), `stock_quantity` integer not null default '0', `is_active` tinyint(1) not null default '1', `is_featured` tinyint(1) not null default '0', `created_at` datetime, `updated_at` datetime, `collection_id` integer, foreign key(`category_id`) references categories(`id`) on delete restrict on update no action, foreign key(`collection_id`) references `collections`(`id`) on delete set null);

CREATE TABLE `sessions` (`id` varchar(255) not null, `user_id` integer, `ip_address` varchar(255), `user_agent` text, `payload` text not null, `last_activity` integer not null, primary key (`id`));

CREATE TABLE `themes` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `title` varchar(255) not null, `description` text not null, `accent` varchar(255) not null default 'from-black to-zinc-700', `sort_order` integer not null default '0', `is_active` tinyint(1) not null default '1', `created_at` datetime, `updated_at` datetime, `image_url` varchar(255));

CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `name` varchar(255) not null, `email` varchar(255) not null, `email_verified_at` datetime, `password` varchar(255) not null, `two_factor_secret` text, `two_factor_recovery_codes` text, `two_factor_confirmed_at` datetime, `remember_token` varchar(255), `created_at` datetime, `updated_at` datetime, `is_admin` tinyint(1) not null default '0');

CREATE INDEX `cache_expiration_index` on `cache` (`expiration`);

CREATE INDEX `cache_locks_expiration_index` on `cache_locks` (`expiration`);

CREATE UNIQUE INDEX `categories_slug_unique` on `categories` (`slug`);

CREATE UNIQUE INDEX `delivery_zones_city_district_zone_name_unique` on `delivery_zones` (`city`, `district`, `zone_name`);

CREATE INDEX `notifications_notifiable_type_notifiable_id_index` on `notifications` (`notifiable_type`, `notifiable_id`);

CREATE UNIQUE INDEX `orders_order_number_unique` on `orders` (`order_number`);

CREATE INDEX `orders_status_created_at_index` on `orders` (`status`, `created_at`);

CREATE INDEX `orders_status_index` on `orders` (`status`);

CREATE UNIQUE INDEX `passkeys_credential_id_unique` on `passkeys` (`credential_id`);

CREATE INDEX `passkeys_user_id_index` on `passkeys` (`user_id`);

CREATE UNIQUE INDEX `products_slug_unique` on `products` (`slug`);

CREATE INDEX `sessions_last_activity_index` on `sessions` (`last_activity`);

CREATE INDEX `sessions_user_id_index` on `sessions` (`user_id`);

CREATE UNIQUE INDEX `users_email_unique` on `users` (`email`);

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('1','2026_07_01_000000_create_users_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('2','2026_07_01_212834_add_is_admin_to_users_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('3','2026_07_01_212834_create_categories_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('4','2026_07_01_212835_create_products_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('5','2026_07_01_212836_create_delivery_zones_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('6','2026_07_01_212837_create_product_images_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('7','2026_07_03_220620_create_cache_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('8','2026_07_03_231456_create_passkeys_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('9','2026_07_04_163824_add_district_and_zone_name_to_delivery_zones_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('10','2026_07_04_211010_create_orders_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('11','2026_07_04_211011_create_order_items_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('12','2026_07_13_222340_add_admin_fields_to_orders_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('13','2026_07_14_000000_add_preparing_at_to_orders_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('14','2026_07_14_000100_add_audit_fields_to_orders_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('15','2026_07_14_092000_create_notifications_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('16','2026_07_15_000200_create_product_colors_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('17','2026_07_15_000250_add_color_to_order_items_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('18','2026_07_16_220025_create_collections_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('19','2026_07_16_220025_create_themes_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('20','2026_07_16_220703_add_image_to_collections_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('21','2026_07_16_220703_add_image_to_themes_table','1');

INSERT INTO `migrations` (`id`,`migration`,`batch`) VALUES ('22','2026_07_17_000000_add_collection_id_to_products_table','1');

INSERT INTO `sessions` (`id`,`user_id`,`ip_address`,`user_agent`,`payload`,`last_activity`) VALUES ('xh2AjXxixEBUxM5oW3aiqD3QjJmVcG9KwGaiwemI',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiI3aWpLdjJIYUpaWUhhZkVtWDlQSXVTb3hWY3ZVUEw4cW9hZnZDWExFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=','1785373803');

SET FOREIGN_KEY_CHECKS = 1;
