const fs = require('fs');

const file1 = 'lib/scenarios.ts';
let c1 = fs.readFileSync(file1, 'utf8');
c1 = c1.replace(/locked:\s*true/g, 'locked: false');
c1 = c1.replace(/unlocked:\s*false/g, 'unlocked: true');
fs.writeFileSync(file1, c1);
console.log('Processed ' + file1);
