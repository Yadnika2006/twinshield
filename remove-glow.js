const fs = require('fs');
const glob = require('glob');

const files = glob.sync('{app,components}/**/*.{css,tsx}', { nodir: true });
console.log(`Found ${files.length} files to process.`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // reset global variables
  content = content.replace(/--glow-green:\s*0\s*0[^;]+;/g, '--glow-green: none;');
  content = content.replace(/--glow-blue:\s*0\s*0[^;]+;/g, '--glow-blue: none;');

  // Generic full line replaces for globals
  content = content.replace(/text-shadow:\s*var\(--glow-[^)]+\);/g, 'text-shadow: none;');
  content = content.replace(/box-shadow:\s*var\(--glow-[^)]+\);/g, 'box-shadow: none;');
  
  // High blur shadow
  content = content.replace(/box-shadow:\s*(inset\s*)?0\s*0\s*[0-9]+px\s*[^;]+;/g, 'box-shadow: none;');
  content = content.replace(/text-shadow:\s*0\s*0\s*[0-9]+px\s*[^;]+;/g, 'text-shadow: none;');
  
  // Double shadow (inset + outer glow)
  content = content.replace(/box-shadow:\s*0\s*0\s*[0-9]+px[^,]+,\s*inset\s*0\s*0\s*[0-9]+px\s*[^;]+;/g, 'box-shadow: none;');

  // JSX inline object syntax
  content = content.replace(/boxShadow:\s*(['"])0\s*0\s*[0-9]+px[^'"]+\1/g, 'boxShadow: $1none$1');
  content = content.replace(/textShadow:\s*(['"])0\s*0\s*[0-9]+px[^'"]+\1/g, 'textShadow: $1none$1');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
