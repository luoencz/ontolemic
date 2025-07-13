const Database = require('better-sqlite3');
const path = require('path');
const { initializeDatabase } = require('../dist/db/init');

const dbPath = path.join(__dirname, '..', 'data', 'stats.db');
console.log('Verifying and resetting statistics database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  console.log('Step 1: Checking current schema...');
  
  // Check if all required tables exist
  const requiredTables = [
    'visits',
    'pages', 
    'sessions',
    'daily_stats',
    'external_links',
    'active_sessions',
    'page_engagement',
    'user_interactions'
  ];
  
  const existingTables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all().map(row => row.name);
  
  console.log('Existing tables:', existingTables);
  
  const missingTables = requiredTables.filter(t => !existingTables.includes(t));
  if (missingTables.length > 0) {
    console.log('Missing tables:', missingTables);
    console.log('Running database initialization to create missing tables...');
    db.close();
    
    // Re-initialize database schema
    initializeDatabase();
    
    // Re-open database
    const newDb = new Database(dbPath);
    console.log('Schema updated successfully!');
    newDb.close();
  }
  
  // Re-open for data reset
  const resetDb = new Database(dbPath);
  
  console.log('\nStep 2: Resetting data...');
  
  // Begin transaction for atomic operation
  resetDb.exec('BEGIN TRANSACTION');
  
  // Delete in correct order to respect foreign key constraints
  console.log('Clearing tables...');
  
  const tablesToClear = [
    'user_interactions',
    'page_engagement', 
    'active_sessions',
    'external_links',
    'daily_stats',
    'visits',
    'sessions',
    'pages'
  ];
  
  tablesToClear.forEach(table => {
    try {
      const result = resetDb.prepare(`DELETE FROM ${table}`).run();
      console.log(`  ${table}: ${result.changes} rows deleted`);
    } catch (err) {
      console.log(`  ${table}: Table might not exist, skipping...`);
    }
  });
  
  // Reset autoincrement counters
  console.log('\nResetting autoincrement counters...');
  try {
    resetDb.exec(`DELETE FROM sqlite_sequence WHERE name IN (
      'visits', 
      'active_sessions', 
      'page_engagement', 
      'user_interactions',
      'external_links'
    )`);
  } catch (err) {
    console.log('No autoincrement counters to reset');
  }
  
  // Commit transaction
  resetDb.exec('COMMIT');
  
  // Verify tables are empty
  console.log('\nVerifying tables are empty:');
  tablesToClear.forEach(table => {
    try {
      const count = resetDb.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      console.log(`  ${table}: ${count.count} rows`);
    } catch (err) {
      console.log(`  ${table}: Table does not exist`);
    }
  });
  
  // Test that stats queries work
  console.log('\nStep 3: Testing stats queries...');
  try {
    // Test overview stats
    const totalVisits = resetDb.prepare('SELECT COUNT(*) as count FROM visits').get();
    const totalPageViews = resetDb.prepare('SELECT SUM(page_count) as count FROM sessions').get();
    const totalActiveSessions = resetDb.prepare('SELECT COUNT(*) as count FROM active_sessions').get();
    
    console.log('Stats queries successful:');
    console.log(`  Total visits: ${totalVisits.count}`);
    console.log(`  Total page views: ${totalPageViews.count || 0}`);
    console.log(`  Active sessions: ${totalActiveSessions.count}`);
  } catch (err) {
    console.error('Error testing stats queries:', err);
  }
  
  resetDb.close();
  console.log('\nDatabase verification and reset complete!');
  
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
} 