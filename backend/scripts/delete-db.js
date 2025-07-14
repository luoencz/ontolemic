#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'stats.db');
const walPath = dbPath + '-wal';
const shmPath = dbPath + '-shm';

console.log('🗑️  Deleting database files...');

try {
  // Delete main database file
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Deleted stats.db');
  } else {
    console.log('ℹ️  No database file found');
  }

  // Delete WAL file if exists
  if (fs.existsSync(walPath)) {
    fs.unlinkSync(walPath);
    console.log('✅ Deleted WAL file');
  }

  // Delete SHM file if exists  
  if (fs.existsSync(shmPath)) {
    fs.unlinkSync(shmPath);
    console.log('✅ Deleted SHM file');
  }

  console.log('\n✨ Database deleted successfully!');
  console.log('The backend will create a fresh database on next startup.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 