# WeChat Deciphers for macOS

This toolkit consists of three DTrace scripts for messing with WeChat.app on macOS.

1. `eavesdropper.d` logs the conversation in realtime.
2. `dbcracker.d` reveals paths to the encrypted SQLite3 databases and their credentials. Since it can only capture secrets when WeChat.app opens these files, you need to either login or trigger a backup while the script is running. Simply copy & paste the script output to invoke [SQLCipher](https://github.com/sqlcipher/sqlcipher) and supply the respective `PRAGMA`s.
3. `xlogger.d` prints the log messages going to `/Users/$USER/Library/Containers/com.tencent.xinWeChat/Data/Library/Caches/com.tencent.xinWeChat/2.0b4.0.9/log/*.xlog`.

## Usage

Launch WeChat and run

```
sudo $DECIPHER_SCRIPT -p $(pgrep -a -f '^/Applications/WeChat.app/Contents/MacOS/WeChat$')
```

replace `$DECIPHER_SCRIPT` with `./dbcracker.d`, `./eavesdropper.d`, or `./xlogger.d`.

## Version Information

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

