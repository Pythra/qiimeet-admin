import { copyFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');
const twoHundredPath = join(distPath, '200.html');

try {
  copyFileSync(indexPath, twoHundredPath);
  console.log('✓ Created 200.html');
} catch (error) {
  console.error('✗ Failed to create 200.html:', error.message);
  process.exit(1);
}
