export type LogContext = Readonly<Record<string, string | number | boolean>>;

export const logLevels = {
  info: "info",
  warn: "warn",
  error: "error",
} as const;

type LogLevel = (typeof logLevels)[keyof typeof logLevels];

function writeLog(level: LogLevel, message: string, context?: LogContext) {
  const output = context ? [message, context] : [message];

  if (level === logLevels.info) {
    console.info(...output);
  } else if (level === logLevels.warn) {
    console.warn(...output);
  } else {
    console.error(...output);
  }
}

export const logger = {
  info(message: string, context?: LogContext) {
    writeLog(logLevels.info, message, context);
  },
  warn(message: string, context?: LogContext) {
    writeLog(logLevels.warn, message, context);
  },
  error(message: string, context?: LogContext) {
    writeLog(logLevels.error, message, context);
  },
};
