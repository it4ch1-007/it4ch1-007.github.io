# THE UNKNOWN

 Now we have a file named 'unknown' and we will check if it is malicious or not .

 First of all we will check it at VirusTotal.com database using the Hashes of the malware exe file.

### Hashes


![Alt text](images/image.png)

### VirusTotal.com

![Alt text](images/image-1.png)

### Strings 

Nothing much could be found in the strings of the exe file.

![Alt text](images/image-2.png)


## Dynamic Analysis

### Activity

![Alt text](images/image-3.png)

In  the Procmon , the unknown.exe appears that it is starting a thread in the background and appear to have donw nothing really.

- When we are detonating the file then it is deleting itself automatically 
- The exe file deletes itself thus it will not be effective as soon as the device restarts or powers off. 
- The exe is dumping a file named 'passwrd.txt' at the path:
```
C:\\Users\Public\passwrd.txt
```
![Alt text](images/image-5.png)

- The exe is opening an image <b> 'cosmo.jpeg' </b> 

![Alt text](images/image-6.png)

- The exe is calculating the base64 of the contents of the image file and then encrypting using RC4 algorithm. 


- The exe uses the method <b> 'houdini' </b> as a function that deletes the exe file on the fulfillment of the above coinsitions.

![Alt text](images/image-7.png)

- The exe uses <b> 'Sikomode' </b> stored in the file <b>'passwrd.txt'</b> as the key for RC4 encryption.

![Alt text](images/image-4.png)

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
![Alt text](images/image-8.png)
in the binary .

- It appears empty as it is being written into the memory at runtime.






