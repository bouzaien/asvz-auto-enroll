# ASVZ Auto Enroll
This script is used to automatically enroll to ASVZ (https://www.asvz.ch/) events.

## Usage
```bat
node run.js arg1 [arg2 [arg3 [...]]]
```

## Events File
The `events.json` contains the list of events to be considered as well as the `cron` schedule expressions and the `baseID`. The `baseID` is calculated such that `baseID + week_number = eventID`.
```json
{
    "arg1": {
        "cron": "00 00 17 * * 0", // for “At 17:00:00 on Sunday.” 
        "baseID": 000000
    },

    "...":{

    },

    "arg_N": {
        "cron": "* * * * * *",
        "baseID": 123456
    }
  }
  ```

## `.env` File
This file is placed in the main directory and contains the ETH login credentials.

```
ETH_USR=<username>
ETH_PASS=<password>
```