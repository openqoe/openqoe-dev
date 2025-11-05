/**
 * Logger utility
 */

import { LogLevel } from '../types';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

export class Logger {
  private level: LogLevel;
  private enabled: boolean;
  private prefix: string;

  constructor(enabled: boolean = false, level: LogLevel = 'warn') {
    this.enabled = enabled;
    this.level = level;
    this.prefix = '[OpenQoE]';
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.enabled) return;
    if (LOG_LEVELS[level] > LOG_LEVELS[this.level]) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `${this.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'error':
        console.error(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'debug':
        console.debug(formattedMessage, ...args);
        break;
    }
  }
}
