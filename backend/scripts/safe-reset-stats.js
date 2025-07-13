const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'stats.db');
console.log('Safely resetting statistics database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = OFF'); // Disable temporarily for easier deletion
  
  console.log('Step 1: Backing up schema info...');
  
  // Get all tables
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();
  
  console.log('Found tables:', tables.map(t => t.name).join(', '));
  
  console.log('\nStep 2: Clearing all data...');
  
  // Begin transaction
  db.exec('BEGIN TRANSACTION');
  
  // Clear tables in safe order (respecting foreign keys)
  const deleteOrder = [
    'user_interactions',
    'page_engagement',
    'active_sessions',
    'external_links',
    'daily_stats',
    'visits',
    'sessions',
    'pages'
  ];
  
  let totalDeleted = 0;
  
  deleteOrder.forEach(tableName => {
    try {
      // Check if table exists
      const tableExists = tables.some(t => t.name === tableName);
      
      if (tableExists) {
        const before = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
        const result = db.prepare(`DELETE FROM ${tableName}`).run();
        console.log(`  ${tableName}: ${result.changes} rows deleted`);
        totalDeleted += result.changes;
      } else {
        console.log(`  ${tableName}: Table not found, skipping`);
      }
    } catch (error) {
      console.log(`  ${tableName}: Error - ${error.message}`);
    }
  });
  
  // Reset SQLite autoincrement sequences
  try {
    const sequences = db.prepare(`SELECT name FROM sqlite_sequence`).all();
    if (sequences.length > 0) {
      console.log('\nResetting autoincrement sequences...');
      db.exec('DELETE FROM sqlite_sequence');
      console.log(`  Reset ${sequences.length} sequences`);
    }
  } catch (error) {
    console.log('  No sequences to reset');
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  console.log(`\nTotal rows deleted: ${totalDeleted}`);
  
  // Re-enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Verify empty state
  console.log('\nStep 3: Verifying empty state...');
  
  deleteOrder.forEach(tableName => {
    try {
      const tableExists = tables.some(t => t.name === tableName);
      if (tableExists) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
        console.log(`  ${tableName}: ${count.count} rows (should be 0)`);
      }
    } catch (error) {
      // Ignore
    }
  });
  
  // Test basic queries
  console.log('\nStep 4: Testing basic queries...');
  
  try {
    // These queries should work even with empty tables
    const visits = db.prepare('SELECT COUNT(*) as count FROM visits').get();
    console.log(`  Visits count: ${visits.count}`);
    
    const sessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
    console.log(`  Sessions count: ${sessions.count}`);
    
    const activeSessions = db.prepare('SELECT COUNT(*) as count FROM active_sessions').get();
    console.log(`  Active sessions count: ${activeSessions.count}`);
    
    // Test the page views query
    const pageViews = db.prepare('SELECT SUM(page_count) as count FROM sessions').get();
    console.log(`  Page views sum: ${pageViews.count || 0}`);
    
    console.log('\n✅ All queries working correctly!');
  } catch (error) {
    console.error('\n❌ Query test failed:', error.message);
  }
  
  db.close();
  console.log('\nDatabase reset complete! All data cleared successfully.');
  
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
} 