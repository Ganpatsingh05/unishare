const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.join(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replacements = [
  { from: /['"](?:\.\.\/)+_components\/([^'"]+)['"]/g, to: "'@features/admin/components/$1'" },
  { from: /['"]\.\/_components\/([^'"]+)['"]/g, to: "'@features/admin/components/$1'" }
];

walk('./src/app/admin', (err, results) => {
  if (err) throw err;
  let changedFiles = 0;
  
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(rep => {
      content = content.replace(rep.from, rep.to);
    });
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
      changedFiles++;
    }
  });
  console.log(`Total files updated: ${changedFiles}`);
});
