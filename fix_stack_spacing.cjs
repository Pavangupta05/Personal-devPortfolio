const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Fix the top offset (push it down so it doesn't go too high)
css = css.replace(/top:\s*120px\s*!important;/g, 'top: 160px !important;');

// 2. Fix the massive empty space at the bottom
// Replace the 50vh padding I added
css = css.replace(/padding-bottom:\s*50vh\s*!important;/g, 'padding-bottom: 40px !important;');
// Replace the original 200px padding
css = css.replace(/padding-bottom:\s*200px;/g, 'padding-bottom: 40px;');

// 3. Adjust gap between cards slightly to make it tighter
css = css.replace(/margin-bottom:\s*80px\s*!important;/g, 'margin-bottom: 50px !important;');
css = css.replace(/margin-bottom:\s*60px;/g, 'margin-bottom: 50px;');

fs.writeFileSync('style.css', css);
console.log('Fixed sticky top offset and removed excessive bottom padding.');
