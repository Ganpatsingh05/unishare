/**
 * Image Optimization Script
 * Converts PNG/JPEG images to WebP format for better performance
 * 
 * Usage:
 * 1. npm install sharp --save-dev
 * 2. node optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGE_DIR = path.join(__dirname, 'public', 'images');
const QUALITY = 85; // WebP quality (85 = great balance of quality/size)
const BACKUP_ORIGINALS = true; // Set to false to delete originals after conversion

// Supported formats
const FORMATS = ['.png', '.jpg', '.jpeg'];

// Files to skip (already optimized or special cases)
const SKIP_FILES = [
  'favicon.png', // Keep as PNG for compatibility
];

/**
 * Recursively get all image files
 */
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (FORMATS.includes(ext) && !SKIP_FILES.includes(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath) {
  const ext = path.extname(inputPath);
  const outputPath = inputPath.replace(ext, '.webp');

  // Skip if WebP already exists and is newer
  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath);
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtime > inputStat.mtime) {
      console.log(`⏭️  Skipping (already exists): ${path.basename(inputPath)}`);
      return { skipped: true };
    }
  }

  try {
    const inputSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputSize = fs.statSync(outputPath).size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   ${formatBytes(inputSize)} → ${formatBytes(outputSize)} (${savings}% smaller)\n`);

    return {
      success: true,
      inputSize,
      outputSize,
      savings: parseFloat(savings),
    };
  } catch (error) {
    console.error(`❌ Error converting ${path.basename(inputPath)}:`, error.message);
    return { error: true };
  }
}

/**
 * Generate responsive image sizes
 */
async function generateResponsiveSizes(inputPath, sizes = [640, 1080, 1920]) {
  const ext = path.extname(inputPath);
  const basePath = inputPath.replace(ext, '');
  const results = [];

  for (const width of sizes) {
    const outputPath = `${basePath}-${width}w.webp`;
    
    try {
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      results.push({
        size: width,
        path: outputPath,
      });
    } catch (error) {
      console.error(`❌ Error generating ${width}w size:`, error.message);
    }
  }

  return results;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`📁 Directory: ${IMAGE_DIR}`);
  console.log(`⚙️  Quality: ${QUALITY}%\n`);

  // Check if sharp is installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ Sharp not installed. Please run: npm install sharp --save-dev');
    process.exit(1);
  }

  // Check if images directory exists
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGE_DIR}`);
    process.exit(1);
  }

  // Get all images
  const images = getAllImages(IMAGE_DIR);
  console.log(`📸 Found ${images.length} images to process\n`);

  if (images.length === 0) {
    console.log('✅ No images to process!');
    return;
  }

  // Process images
  let totalInputSize = 0;
  let totalOutputSize = 0;
  let converted = 0;
  let skipped = 0;
  let errors = 0;

  for (const imagePath of images) {
    const result = await convertToWebP(imagePath);
    
    if (result.skipped) {
      skipped++;
    } else if (result.error) {
      errors++;
    } else if (result.success) {
      converted++;
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }

  // Generate responsive sizes for critical images (hero slider)
  console.log('\n📐 Generating responsive sizes for hero images...\n');
  const heroImages = images.filter(img => 
    img.includes('services/buysell') ||
    img.includes('services/house') ||
    img.includes('services/rideshare') ||
    img.includes('services/Lost') ||
    img.includes('services/ticket') ||
    img.includes('services/announcement')
  );

  for (const heroImage of heroImages) {
    console.log(`📏 Creating responsive sizes for ${path.basename(heroImage)}`);
    await generateResponsiveSizes(heroImage);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Converted: ${converted} images`);
  console.log(`⏭️  Skipped: ${skipped} images`);
  console.log(`❌ Errors: ${errors} images`);
  
  if (converted > 0) {
    const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);
    console.log(`\n💾 Total Input Size: ${formatBytes(totalInputSize)}`);
    console.log(`💾 Total Output Size: ${formatBytes(totalOutputSize)}`);
    console.log(`🎉 Total Savings: ${formatBytes(totalInputSize - totalOutputSize)} (${totalSavings}%)`);
  }

  console.log('\n✨ Optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update image imports in components (.png → .webp)');
  console.log('   2. Test images on mobile devices');
  console.log('   3. Delete original .png files once confirmed working');
  console.log('   4. Run: npm run build');
  console.log('='.repeat(60) + '\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
