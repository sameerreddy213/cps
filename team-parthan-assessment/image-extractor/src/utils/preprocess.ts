// Developed by Manjistha Bidkar
// Preprocess the image for better content extraction
export async function preprocessImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .grayscale()           // Convert to grayscale
    .normalize()           // Normalize lighting
    .sharpen()             // Sharpen edges for better recognition
    .threshold(140)        // Binarize image at a tuned threshold
    .toFile(outputPath);
}
