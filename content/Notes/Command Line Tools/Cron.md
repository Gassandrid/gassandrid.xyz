# Cron: Scheduling Tasks on Unix-like Systems

## Overview

`cron` is a time-based job scheduler in Unix-like operating systems. It allows users to schedule jobs (commands or scripts) to run periodically at fixed times, dates, or intervals.

## Crontab Syntax

The `crontab` file is a configuration file that specifies shell commands to run periodically on a given schedule. Each line of a `crontab` file represents a job, and follows this format:
```
- - - - - command_to_run
--
| | | | | | | | | +---- Day of the week (0 - 7) (Sunday is both 0 and 7) | | | +------ Month (1 - 12) | | +-------- Day of the month (1 - 31) | +---------- Hour (0 - 23) +------------ Minute (0 - 59)
```


### Special Strings

In addition to the standard format, `cron` also supports special strings:

- `@reboot` : Run once, at startup.
- `@yearly` : Run once a year, `0 0 1 1 *`.
- `@annually` : Same as `@yearly`.
- `@monthly` : Run once a month, `0 0 1 * *`.
- `@weekly` : Run once a week, `0 0 * * 0`.
- `@daily` : Run once a day, `0 0 * * *`.
- `@midnight` : Same as `@daily`.
- `@hourly` : Run once an hour, `0 * * * *`.

## Editing Crontab

To edit the `crontab` for the current user, use the command:

```sh
crontab -e
```

This opens the `crontab` file in the default text editor.

### Viewing Crontab

To view the `crontab` entries for the current user:

```bash
crontab -l
```

### Removing Crontab

To remove the `crontab` file for the current user: