-- =============================================================
-- Papas Willow Admin System - MySQL Schema
-- Database: papas_admin_db
-- =============================================================

CREATE DATABASE IF NOT EXISTS papas_admin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE papas_admin_db;

-- ── Roles ────────────────────────────────────────────────────
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Users (admin + store users) ───────────────────────────────
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT,
  phone BIGINT,
  address VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ── User Sessions ─────────────────────────────────────────────
CREATE TABLE user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── User Addresses ────────────────────────────────────────────
CREATE TABLE user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Stores ────────────────────────────────────────────────────
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  priority INT DEFAULT 0,
  parent_store_id INT DEFAULT 0,
  type VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Brands ────────────────────────────────────────────────────
CREATE TABLE brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  brand_description LONGTEXT,
  brand_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Categories (hierarchical, n-levels) ──────────────────────
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT DEFAULT NULL,
  level INT DEFAULT 0,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ── Vendors ───────────────────────────────────────────────────
CREATE TABLE vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  email VARCHAR(255),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Products ──────────────────────────────────────────────────
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description LONGTEXT,
  category_id TEXT,
  brand_id INT,
  images VARCHAR(2000),
  sell_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

-- ── Product Variants ──────────────────────────────────────────
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  size VARCHAR(100),
  color VARCHAR(100),
  sku VARCHAR(255),
  actual_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Invoices ──────────────────────────────────────────────────
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(100),
  vendor_id INT,
  country_name VARCHAR(100),
  invoice_date DATE,
  delivery_note VARCHAR(255),
  our_order VARCHAR(100),
  goods_total DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  custom_duty DECIMAL(10,2) DEFAULT 0,
  custom_status ENUM('Entered','Pending') DEFAULT 'Pending',
  labor DECIMAL(10,2) DEFAULT 0,
  other_landing_charges DECIMAL(10,2) DEFAULT 0,
  charge_for_allocation DECIMAL(10,2) DEFAULT 0,
  vat DECIMAL(10,2) DEFAULT 0,
  invoice_total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- ── Purchase Lines ────────────────────────────────────────────
CREATE TABLE purchase_line (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT,
  item_date DATE,
  vendor_id INT,
  product_variant_id INT,
  description TEXT,
  qty_purchased INT DEFAULT 0,
  unit VARCHAR(50),
  base_unit_cost DECIMAL(10,2) DEFAULT 0,
  line_total DECIMAL(10,2) DEFAULT 0,
  landed_unit_cost DECIMAL(10,2) DEFAULT 0,
  recommended_sell_price DECIMAL(10,2) DEFAULT 0,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ── Inventory ─────────────────────────────────────────────────
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT,
  product_variation_id INT,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (product_variation_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- ── Product Sales ─────────────────────────────────────────────
CREATE TABLE product_sale (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  customer_id INT,
  clearance_sales BOOLEAN DEFAULT FALSE,
  payment_statu VARCHAR(50),
  order_status ENUM('pending','dispatched','shipped','delivered') DEFAULT 'pending',
  brand_id INT,
  product_variant_id INT,
  quantity INT,
  payment_mode VARCHAR(50),
  actual_price DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  tax_amount DECIMAL(10,2) DEFAULT 0,
  profit_amount DECIMAL(10,2) DEFAULT 0,
  date DATETIME,
  order_no VARCHAR(100),
  stripe_payment_intent VARCHAR(255),
  store_id INT,
  shipping_name VARCHAR(255),
  shipping_line1 VARCHAR(255),
  shipping_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(20),
  shipping_phone VARCHAR(30),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,
  INDEX idx_order_no (order_no),
  INDEX idx_store_id (store_id)
);

-- ── Product Service ───────────────────────────────────────────
CREATE TABLE product_service (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  status ENUM('Picked up','Repair not possible','Repair done','In store') DEFAULT 'Picked up',
  brand_id INT,
  product_variant_id INT,
  repair_reason VARCHAR(255),
  size VARCHAR(100),
  quantity INT DEFAULT 1,
  moeed_payment_status ENUM('pending','paid') DEFAULT 'pending',
  payment_mode VARCHAR(50),
  price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) DEFAULT 0,
  pending_amount DECIMAL(10,2) DEFAULT 0,
  profit_amount DECIMAL(10,2) DEFAULT 0,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- ── Services Catalog ──────────────────────────────────────────
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  product_variant_ids TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Profit & Loss ─────────────────────────────────────────────
CREATE TABLE profit_loss (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salary DECIMAL(10,2) DEFAULT 0,
  rent DECIMAL(10,2) DEFAULT 0,
  repairs_amount DECIMAL(10,2) DEFAULT 0,
  total_expense DECIMAL(10,2) DEFAULT 0,
  product_sales_profit_amount DECIMAL(10,2) DEFAULT 0,
  product_service_profit_amount DECIMAL(10,2) DEFAULT 0,
  total_profit_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  date DATE
);

-- ── Settings ──────────────────────────────────────────────────
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  margin DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Banners ───────────────────────────────────────────────────
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  image VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Mega Menu ─────────────────────────────────────────────────
CREATE TABLE mega_menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  data JSON,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Gift Cards ───────────────────────────────────────────────
CREATE TABLE gift_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(25) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  purchaser_name VARCHAR(255) DEFAULT '',
  purchaser_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) DEFAULT '',
  recipient_email VARCHAR(255) DEFAULT '',
  message TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATE
);

-- ── Newsletter Subscribers ────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1
);

-- ── Seed Data ─────────────────────────────────────────────────
INSERT INTO roles (name, description) VALUES
  ('admin', 'System Administrator'),
  ('store', 'Store User');

INSERT INTO settings (margin) VALUES (20.00);

-- Default admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, role_id, is_active)
VALUES ('Admin', 'admin@papas.com', '$2b$10$rKJ8T0NQZ6Y5mX3pL1VdUeHqRwI7sF4gA2C9bE6nO0dM5kP8vY1Ju', 1, TRUE);
