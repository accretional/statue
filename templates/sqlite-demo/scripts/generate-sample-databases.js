#!/usr/bin/env node

/**
 * Generate sample SQLite databases for the sqlite-demo template.
 * Creates products.db and promotions.db with realistic sample data.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateRoot = path.join(__dirname, '..');
const staticDir = path.join(templateRoot, 'static');

/**
 * Sample product data
 */
const products = [
  { id: 1, name: 'Wireless Headphones', description: 'Premium noise-canceling headphones', price: 149.99, featured: 1 },
  { id: 2, name: 'Smart Watch', description: 'Fitness tracking with heart rate monitor', price: 299.99, featured: 1 },
  { id: 3, name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', price: 79.99, featured: 0 },
  { id: 4, name: 'USB-C Hub', description: '7-in-1 multiport adapter', price: 49.99, featured: 1 },
  { id: 5, name: 'Laptop Stand', description: 'Ergonomic aluminum stand', price: 39.99, featured: 0 },
  { id: 6, name: 'Wireless Mouse', description: 'Ergonomic design with silent clicks', price: 29.99, featured: 0 },
  { id: 7, name: 'Mechanical Keyboard', description: 'RGB backlit with blue switches', price: 119.99, featured: 1 },
  { id: 8, name: 'Webcam 4K', description: 'Ultra HD webcam with auto-focus', price: 89.99, featured: 0 }
];

/**
 * Sample promotion data
 */
const promotions = [
  { id: 1, product_id: 1, discount: 0.20, badge: '20% OFF', active: 1 },
  { id: 2, product_id: 2, discount: 0.15, badge: 'SALE', active: 1 },
  { id: 3, product_id: 4, discount: 0.10, badge: 'NEW', active: 1 },
  { id: 4, product_id: 6, discount: 0.25, badge: 'CLEARANCE', active: 0 }, // Inactive
  { id: 5, product_id: 7, discount: 0.30, badge: 'HOT DEAL', active: 1 }
];

/**
 * Create products database
 */
async function createProductsDatabase() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table
  db.run(`
    CREATE TABLE items (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      featured INTEGER DEFAULT 0
    )
  `);

  // Insert products
  const stmt = db.prepare(`
    INSERT INTO items (id, name, description, price, featured)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const product of products) {
    stmt.run([
      product.id,
      product.name,
      product.description,
      product.price,
      product.featured
    ]);
  }

  stmt.free();

  // Export to file
  const data = db.export();
  const outputPath = path.join(staticDir, 'products.db');
  await fs.writeFile(outputPath, data);

  db.close();

  return outputPath;
}

/**
 * Create promotions database
 */
async function createPromotionsDatabase() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Create table
  db.run(`
    CREATE TABLE deals (
      id INTEGER PRIMARY KEY,
      product_id INTEGER NOT NULL,
      discount REAL NOT NULL,
      badge TEXT,
      active INTEGER DEFAULT 1
    )
  `);

  // Insert promotions
  const stmt = db.prepare(`
    INSERT INTO deals (id, product_id, discount, badge, active)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const promo of promotions) {
    stmt.run([
      promo.id,
      promo.product_id,
      promo.discount,
      promo.badge,
      promo.active
    ]);
  }

  stmt.free();

  // Export to file
  const data = db.export();
  const outputPath = path.join(staticDir, 'promotions.db');
  await fs.writeFile(outputPath, data);

  db.close();

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔨 Generating sample databases...');

  // Ensure static directory exists
  await fs.mkdir(staticDir, { recursive: true });

  // Create databases
  const productsPath = await createProductsDatabase();
  console.log(`✅ Created ${path.relative(templateRoot, productsPath)}`);
  console.log(`   • ${products.length} products`);
  console.log(`   • ${products.filter(p => p.featured).length} featured`);

  const promotionsPath = await createPromotionsDatabase();
  console.log(`✅ Created ${path.relative(templateRoot, promotionsPath)}`);
  console.log(`   • ${promotions.length} promotions`);
  console.log(`   • ${promotions.filter(p => p.active).length} active`);

  console.log('\n💡 These databases demonstrate:');
  console.log('   • Single database queries');
  console.log('   • Multi-database LEFT JOIN (all products + promotions if available)');
  console.log('   • Multi-database INNER JOIN (only promoted products)');
}

main().catch(error => {
  console.error('Error generating sample databases:', error);
  process.exit(1);
});
