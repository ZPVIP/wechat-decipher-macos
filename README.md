# WeChat Deciphers for macOS

This toolkit consists of three DTrace scripts for messing with WeChat.app on macOS.

1. `eavesdropper.d` logs the conversation in real time. This shows everything to be saved to the database.
2. `dbcracker.d` reveals locations of the encrypted SQLite3 databases and their credentials. Since it can only capture secrets when WeChat.app opens these files, you need to either login or trigger a backup while the script is running. Simply copy & paste the script output to invoke [SQLCipher](https://github.com/sqlcipher/sqlcipher) and supply the respective `PRAGMA`s.
3. `xlogger.d` prints the log messages going to `/Users/$USER/Library/Containers/com.tencent.xinWeChat/Data/Library/Caches/com.tencent.xinWeChat/2.0b4.0.9/log/*.xlog`. I made this script [destructive](http://dtrace.org/guide/chp-actsub.html#chp-actsub-4) so that I can overwrite the global log level variable `gs_level`. While the log messages may not be super helpful to end users, they can be handy for further reverse engineering (for example, the AES key used for backup encryption is logged in plaintext).

## Dependencies

Since `dtrace(1)` is pre-installed on macOS, no dependencies are required to run the scripts. However, you may need to [disable SIP](https://apple.stackexchange.com/questions/208762/now-that-el-capitan-is-rootless-is-there-any-way-to-get-dtrace-working) if you haven't done that yet. In addition, you'll need [SQLCipher](https://github.com/sqlcipher/sqlcipher) to inspect the databases discovered by `dbcracker.d`.

## Usage

Launch WeChat and run

```bash
sudo $DECIPHER_SCRIPT -p $(pgrep -f '^/Applications/WeChat.app/Contents/MacOS/WeChat$')
```

replace `$DECIPHER_SCRIPT` with `./dbcracker.d`, `./eavesdropper.d`, or `./xlogger.d`.

## Version Information

The production of these scripts involved an excess amount of guesswork and wishful thinking, but at least it works on my machine :)

```
Device Type: MacBookPro14,1
System Version: Version 10.14.6 (Build 18G7016)
System Language: en
WeChat Version: [2020-10-14 12:55:50] v2.5.0.16 (15731) #2fb3ec2537
WeChat Language: en
Historic Version: [2020-07-24 20:51:39] v2.4.2.16 (15067) #d2826975af
Network Status: Reachable via WiFi or Ethernet
Display: *(1440x900)/Retina
```

