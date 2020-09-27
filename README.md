# ASVZ Auto Enroll
This script is used to automatically enroll to [ASVZ](https://www.asvz.ch/) events.

## Usage
```bat
node run.js event_1 [event_2 [event_3 [...]]]
```

## Events File
The `events.json` contains the list of events to be considered as well as the `cron` schedule expressions and the `baseID`. The `baseID` is calculated such that `baseID + week_number = eventID`. The `eventID` can be found in the event URL: `https://schalter.asvz.ch/tn/lessons/<eventID>`.
```json
{
    "event_1": {
        "cron": "00 00 17 * * 0",
        "//": "At 17:00:00 on Sunday.",
        "baseID": 000000
    },

    "...":{

    },

    "event_N": {
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