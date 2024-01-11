---
  title: "Unknown.exe Analysis"
  categories: Malware Analysis
  tags: [Malware Analysis]
  date: 2024-01-11 00:00:00 +0800
---

# THE UNKNOWN

 Now we have a file named 'unknown' and we will check if it is malicious or not .

 First of all we will check it at VirusTotal.com database using the Hashes of the malware exe file.

### Hashes


![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/2ec97056-4056-4494-9df7-046c0b69fac5)

### VirusTotal.com

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/4ce23603-2572-4175-a6d8-5d6b266d550d)


### Strings 

Nothing much could be found in the strings of the exe file.

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/74fdaefd-6867-4209-b00a-650ba19ef3c9)



## Dynamic Analysis

### Activity

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/c2453adc-0adf-4027-ba0c-30282d93cd36)


In  the Procmon , the unknown.exe appears that it is starting a thread in the background and appear to have donw nothing really.

- When we are detonating the file then it is deleting itself automatically 
- The exe file deletes itself thus it will not be effective as soon as the device restarts or powers off. 
- The exe is dumping a file named 'passwrd.txt' at the path:
```
C:\\Users\Public\passwrd.txt
```
![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/31052234-67af-4bb5-b078-47ba33bac9ba)


- The exe is opening an image <b> 'cosmo.jpeg' </b> 

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/34c0917d-0bae-4619-b38e-bef44c0f0f39)


- The exe is calculating the base64 of the contents of the image file and then encrypting using RC4 algorithm. 


- The exe uses the method <b> 'houdini' </b> as a function that deletes the exe file on the fulfillment of the above coinsitions.

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/316a9455-e61f-4b09-8166-933bc41c6eee)


- The exe uses <b> 'Sikomode' </b> stored in the file <b>'passwrd.txt'</b> as the key for RC4 encryption.

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/e3e299ca-5470-4297-a329-f62d6bd3cb64)


- This can be said that if there is an image named <b>cosmo.jpeg</b> inside the specified path then the exe file will open it and encrypt it using base64 and RC4 encryption algorithm with the key <b> Sikomode </b>

- Then the exe will give a reverse shell to the domain mentioned to execute commands on the victim's system.


### URLs

The exe file is acessing the url:

```
 http://update.ec12-4-109-278-3-ubuntu20-04.local
```
- If this URL could not be accessed by the exe then the exe deletes itself 

- It also will delete itself when it has done establishing the shell execution process on the victim system.

- A URL is used to provide the reverse shell of the system 

```
http://cdn.altimiter.local/feed?post=[data]
```
### KillSwitch

The exe will check for the kill_switch first before detonation and thus it will try to connect to a URL , if that exists then the exe will delete itself then and there only and will not function anymore. 

- The URL is checked by a buffer located at :

![image](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/2789bfd2-ed2a-4d31-bff3-d0acef986a27)

in the binary .

- It appears empty as it is being written into the memory at runtime.






