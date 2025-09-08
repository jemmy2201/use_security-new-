import path from 'path';
import fs from 'fs';
import { getEnvironmentConfig, logger } from './config';

/**
 * Utility functions for handling file operations across different environments
 */

/**
 * Gets the appropriate base path for file operations based on environment
 */
export function getBasePath(): string {
  const config = getEnvironmentConfig();
  return config.file.basePath;
}

/**
 * Gets the invoice folder path for the current environment
 */
export function getInvoiceFolderPath(): string {
  const basePath = getBasePath();
  return path.join(basePath, 'public', 'userdocs', 'img_users', 'invoice');
}

/**
 * Creates a directory with error handling and logging
 */
export function createDirectorySync(dirPath: string): void {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.verbose('FILE_UTILS', `Directory created/verified: ${dirPath}`);
  } catch (error: any) {
    logger.error(`Failed to create directory: ${dirPath}`, error);
    throw new Error(`Failed to create directory: ${error.message}`);
  }
}

/**
 * Writes a file with error handling and logging
 */
export function writeFileSync(filePath: string, data: Uint8Array): void {
  try {
    fs.writeFileSync(filePath, data);
    logger.verbose('FILE_UTILS', `File written successfully: ${filePath}`);
    
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      logger.verbose('FILE_UTILS', `File verified, size: ${stats.size} bytes`);
    } else {
      throw new Error('File was not created despite no error');
    }
  } catch (error: any) {
    logger.error(`Failed to write file: ${filePath}`, error);
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

/**
 * Checks if required assets (logo, font) exist and are accessible
 */
export function validateAssets(): { logo: string; font: string } {
  const basePath = getBasePath();
  const logoPath = path.resolve(basePath, 'public', 'images', 'logo_pdf.png');
  const fontPath = path.resolve(basePath, 'public', 'font', 'Roboto-Regular.ttf');
  
  logger.verbose('FILE_UTILS', `Validating assets from base path: ${basePath}`);
  logger.verbose('FILE_UTILS', `Logo path: ${logoPath}`);
  logger.verbose('FILE_UTILS', `Font path: ${fontPath}`);
  
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found: ${logoPath}`);
  }
  
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font file not found: ${fontPath}`);
  }
  
  logger.verbose('FILE_UTILS', `Assets validation passed`);
  return { logo: logoPath, font: fontPath };
}

/**
 * Generates a safe filename for invoices
 */
export function generateInvoiceFileName(passId: string | null, scheduleId: number): string {
  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}${month}${day}`;
  };

  return 'T_' +
    (passId ? passId : '') +
    '_' +
    formatDateToDDMMYYYY(new Date()) +
    scheduleId.toString().slice(-5) +
    '.pdf';
}
