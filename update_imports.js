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
          if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replacements = [
  // Contexts & Hooks
  { from: /['"](?:.*\/)?lib\/contexts\/(.*)['"]/g, to: "'@contexts/$1'" },
  { from: /['"](?:.*\/)?lib\/hooks\/(.*)['"]/g, to: "'@hooks/$1'" },
  
  // Utils
  { from: /['"](?:.*\/)?lib\/utils\/(.*)['"]/g, to: "'@lib/utils/$1'" },
  
  // Specific feature APIs
  { from: /['"](?:.*\/)?lib\/api\/housing['"]/g, to: "'@features/housing/services/housing.service'" },
  { from: /['"](?:.*\/)?lib\/api\/marketplace['"]/g, to: "'@features/marketplace/services/marketplace.service'" },
  { from: /['"](?:.*\/)?lib\/api\/rideSharing['"]/g, to: "'@features/rides/services/rides.service'" },
  { from: /['"](?:.*\/)?lib\/api\/tickets['"]/g, to: "'@features/tickets/services/tickets.service'" },
  { from: /['"](?:.*\/)?lib\/api\/lostFound['"]/g, to: "'@features/lost-found/services/lostFound.service'" },
  { from: /['"](?:.*\/)?lib\/api\/admin['"]/g, to: "'@features/admin/services/admin.service'" },
  { from: /['"](?:.*\/)?lib\/api\/announcements['"]/g, to: "'@features/announcements/services/announcements.service'" },
  { from: /['"](?:.*\/)?lib\/api\/contacts['"]/g, to: "'@features/contacts/services/contacts.service'" },
  { from: /['"](?:.*\/)?lib\/api\/notice['"]/g, to: "'@features/notice/services/notice.service'" },
  { from: /['"](?:.*\/)?lib\/api\/resources['"]/g, to: "'@features/resources/services/resources.service'" },

  // General lib/api (including base.js and remaining files)
  { from: /['"](?:.*\/)?lib\/api\/(.*)['"]/g, to: "'@lib/api/$1'" },
  { from: /['"](?:.*\/)?lib\/api['"]/g, to: "'@lib/api/api'" }, // `api.js` import without extension

  // Components mapping
  { from: /['"](?:.*\/)?_components\/marketplace\/(.*)['"]/g, to: "'@features/marketplace/components/$1'" },
  { from: /['"]@components\/marketplace\/(.*)['"]/g, to: "'@features/marketplace/components/$1'" },
  
  // Specific housing components that were moved
  { from: /['"](?:.*\/)?_components\/(HousingCard|HousingFilters|HousingHero|HousingListings|HousingModes|MyPostsWidget|RoommateCard|CampusDiscoveryStrip|HousingEmptyState)['"]/g, to: "'@features/housing/components/$1'" },
  { from: /['"](?:.*\/)?CampusIllustrations['"]/g, to: "'@features/housing/components/CampusIllustrations'" },

  // General Components (ui, layout, forms)
  { from: /['"](?:.*\/)?_components\/ui\/(.*)['"]/g, to: "'@components/ui/$1'" },
  { from: /['"](?:.*\/)?_components\/layout\/(.*)['"]/g, to: "'@components/layout/$1'" },
  { from: /['"](?:.*\/)?_components\/forms\/(.*)['"]/g, to: "'@components/forms/$1'" },

  // Catch-all for @components to make sure they still work if they used the alias
  // Note: @components/ui/ is already correct, but let's make sure there's no leftover _components
];

walk('./src', (err, results) => {
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
