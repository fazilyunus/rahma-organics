const { Pool } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testConnection(password) {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: String(password),
    port: 5432,
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Server time:', result.rows[0].now);
    await pool.end();
    return true;
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('=== PostgreSQL Connection Fixer ===\n');
  console.log('Let\'s find the correct password for your PostgreSQL database.\n');
  
  // Try common passwords first
  const commonPasswords = ['', 'postgres', 'admin', '123456', 'password'];
  
  console.log('Testing common passwords...\n');
  for (const pwd of commonPasswords) {
    console.log(`Trying: "${pwd || '(empty)'}"`);
    if (await testConnection(pwd)) {
      console.log(`\n✅ SUCCESS! Your password is: "${pwd}"`);
      console.log('\nUpdate your backend/.env file:');
      console.log(`DB_PASSWORD=${pwd}`);
      process.exit(0);
    }
  }
  
  console.log('\n❌ Common passwords didn\'t work.');
  console.log('\nPlease enter your PostgreSQL password manually:');
  
  rl.question('Password: ', async (password) => {
    if (await testConnection(password)) {
      console.log(`\n✅ SUCCESS! Your password is: "${password}"`);
      console.log('\nUpdate your backend/.env file:');
      console.log(`DB_PASSWORD=${password}`);
    } else {
      console.log('\n❌ That password didn\'t work either.');
      console.log('\nTo reset your PostgreSQL password:');
      console.log('1. Open pgAdmin or SQL Shell (psql)');
      console.log('2. Run: ALTER USER postgres PASSWORD \'your_new_password\';');
      console.log('3. Update backend/.env with the new password');
    }
    rl.close();
    process.exit(0);
  });
}

main();
