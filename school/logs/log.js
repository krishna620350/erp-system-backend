import fs from "fs";
import chalk from "chalk";

const MAX_LOG_LINES = 100;

export class logFileCreate {
    constructor() {
        this.lineCount = 0;
        this.logFile = fs.createWriteStream("./logs/database_log1.log", { flags: "a" });
        this.log = console.log;
    }

    writeLog(message, color) {
        this.logFile.write(message + "\n");
        this.lineCount++;

        // Check if the line count exceeds the threshold
        if (this.lineCount >= MAX_LOG_LINES) {
            // Close the current log file and create a new one
            this.logFile.close();
            this.createNewLogFile();
        }
        this.log(chalk[color](message));
    }

    createNewLogFile() {
        this.lineCount = 0; // Reset line count
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const newLogFilePath = `./logs/database_log_${timestamp}.log`;

        // Create the new log file
        this.logFile = fs.createWriteStream(newLogFilePath, { flags: "a" });
    }

    close() {
        this.logFile.close();
    }
}
