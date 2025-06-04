import sharp from "sharp";

/**
 * Recieves image buffer along with width and height, and returns a promise resolving to the cropped image buffer
 * @param file
 * @param width
 * @param height
 */
export const resizeImage = async (
  file: Buffer,
  width: number,
  height: number
): Promise<Buffer> => {
  try {
    return await sharp(file).resize(width, height).toBuffer();
  } catch (error) {
    throw error;
  }
};
