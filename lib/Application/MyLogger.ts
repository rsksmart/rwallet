export interface Logger {
    debug(...args: any[]): void;

    info(...args: any[]): void;

    warn(...args: any[]): void;

    error(...args: any[]): void;
}

class EmptyLogger implements Logger {
    debug(...args: any[]): void {}

    info(...args: any[]): void {}

    warn(...args: any[]): void {}

    error(...args: any[]): void {}
}

class LoggerImpl implements Logger {
    private _logger: Logger = new EmptyLogger();

    // eslint-disable-next-line no-unused-vars
    debug(...args: any[]): void {
        this._logger.debug(...args);
    }

    info(...args: any[]): void {
        this._logger.info(...args);
    }

    warn(...args: any[]): void {
        this._logger.warn(...args);
    }

    error(...args: any[]): void {
        this._logger.error(...args);
    }

    setLogger(l: Logger) {
        this._logger = l;
    }
}

export const MyLogger = new LoggerImpl();
