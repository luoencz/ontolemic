const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'stats.db');
console.log('Resetting statistics database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Disable foreign keys temporarily for easier deletion
  db.pragma('foreign_keys = OFF');
  
  // Begin transaction for atomic operation
  db.exec('BEGIN TRANSACTION');
  
  // Delete in correct order to respect foreign key constraints
  console.log('Clearing tables...');
  
  const tables = [
    'user_interactions',
    'page_engagement', 
    'active_sessions',
    'external_links',
    'daily_stats',
    'visits',
    'sessions',
    'pages'
  ];
  
  tables.forEach(table => {
    try {
      const result = db.prepare(`DELETE FROM ${table}`).run();
      console.log(`  ${table}: ${result.changes} rows deleted`);
    } catch (error) {
      console.log(`  ${table}: Skipped (${error.message})`);
    }
  });
  
  // Reset autoincrement counters
  console.log('\nResetting autoincrement counters...');
  try {
    db.exec(`DELETE FROM sqlite_sequence WHERE name IN (
      'visits', 
      'active_sessions', 
      'page_engagement', 
      'user_interactions',
      'external_links'
    )`);
  } catch (error) {
    console.log('  No sequences to reset');
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  // Re-enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Verify tables are empty
  console.log('\nVerifying tables are empty:');
  tables.forEach(table => {
    try {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      console.log(`  ${table}: ${count.count} rows`);
    } catch (error) {
      console.log(`  ${table}: Not found`);
    }
  });
  
  db.close();
  console.log('\nDatabase reset complete!');
  
} catch (error) {
  console.error('Error resetting database:', error);
  process.exit(1);
} 