// Developed by Manjistha Bidkar
// Preprocess the image for better content extraction
import sharp from "sharp";

export async function preprocessImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .grayscale()
    .threshold(150)
    .toFile(outputPath);
}
