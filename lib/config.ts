/**
 * Configuration utilities for different environments
 */

export type Environment = 'development' | 'uat' | 'production';

export interface EnvironmentConfig {
  database: {
    url: string;
  };
  app: {
    url: string;
    protocol: 'http' | 'https';
  };
  file: {
    basePath: string;
    assetsPath: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableVerbose: boolean;
  };
}

/**
 * Gets the current environment
 */
export function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV as string;
  if (env === 'uat' || env === 'production') {
    return env as Environment;
  }
  return 'development';
}

/**
 * Gets environment-specific configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  
  const configs: Record<Environment, EnvironmentConfig> = {
    development: {
      database: {
        url: process.env.DATABASE_URL || 'mysql://root:use-portal-pw@localhost:3306/security_employees'
      },
      app: {
        url: process.env.NEXT_PUBLIC_URL || 'http://localhost',
        protocol: 'http'
      },
      file: {
        basePath: process.cwd(),
        assetsPath: 'public'
      },
      logging: {
        level: 'debug',
        enableVerbose: true
      }
    },
    uat: {
      database: {
        url: process.env.DATABASE_URL || process.env.UAT_DATABASE_URL || ''
      },
      app: {
        url: process.env.NEXT_PUBLIC_URL || process.env.UAT_APP_URL || '',
        protocol: 'https'
      },
      file: {
        basePath: process.env.PHYSICAL_PATH || process.cwd(),
        assetsPath: 'public'
      },
      logging: {
        level: 'info',
        enableVerbose: true
      }
    },
    production: {
      database: {
        url: process.env.DATABASE_URL || process.env.PROD_DATABASE_URL || ''
      },
      app: {
        url: process.env.NEXT_PUBLIC_URL || process.env.PROD_APP_URL || '',
        protocol: 'https'
      },
      file: {
        basePath: process.env.PHYSICAL_PATH || process.cwd(),
        assetsPath: 'public'
      },
      logging: {
        level: 'warn',
        enableVerbose: false
      }
    }
  };

  return configs[env];
}

/**
 * Checks if current environment is production-like (UAT or Production)
 */
export function isProductionLike(): boolean {
  const env = getCurrentEnvironment();
  return env === 'uat' || env === 'production';
}

/**
 * Gets the appropriate database connection string for current environment
 */
export function getDatabaseUrl(): string {
  const config = getEnvironmentConfig();
  
  if (!config.database.url) {
    throw new Error(`Database URL not configured for environment: ${getCurrentEnvironment()}`);
  }
  
  return config.database.url;
}

/**
 * Environment-aware logger
 */
export class EnvLogger {
  private config = getEnvironmentConfig();
  
  debug(message: string, ...args: any[]): void {
    if (this.config.logging.level === 'debug') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
  
  info(message: string, ...args: any[]): void {
    if (['debug', 'info'].includes(this.config.logging.level)) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }
  
  warn(message: string, ...args: any[]): void {
    if (['debug', 'info', 'warn'].includes(this.config.logging.level)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }
  
  verbose(tag: string, message: string, ...args: any[]): void {
    if (this.config.logging.enableVerbose) {
      console.log(`[${tag}] ${message}`, ...args);
    }
  }
}

export const logger = new EnvLogger();
