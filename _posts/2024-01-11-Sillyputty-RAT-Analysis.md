---
  title: "RAT Analysis [SillyPutty.exe]"
  date: 2024-01-11 00:00:00 +0800
  categories: Malware Analysis
  tags: [Malware Analysis, RAT]
---

# SillyPutty.exe

**We are given a file named putty.exe that appers to be a legitimate application**

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/6a4841c7-cbe9-43f5-bbaf-e5ea44c13e7d)


- First of all we will compute the file hash to identify whether the file is malicious or not through VirusTotal.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/2931770c-9907-4d45-97fe-90e2a2e908c7)



Thus the SHA256 hash of the given file comes out to be :

**SHA256 -> 0C82E654C09C8FD9FDF4899718EFA37670974C9EEC5A8FC18A167F93CEA6EE83**

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/46b378cf-feb0-4002-b222-a84b39e41e86)



- On VirusTotal , we see that it is a malware , especially a Trojan virus.

- Thus we will now first Statically analyse the file.

## Static Analysis

In static analysis we will first of all see or compute the strings of the file in the powershell using Floss , that will give us all the strings in a systematic form:

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/58be5c0b-6fee-4773-aec4-7ebc81a830de)



![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/40275802-a0db-4354-be3d-c9007d8c446b)


- Here we can see a lot of strings are in the given executable that are in a random order but due to Floss it is slightly classified:

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/a123ed43-95bf-4a71-90f8-b545381380bd)


- Here we observe a suspicious string amidst of all the functions and APIs it is using , but as nothing further can be inferred : **We will store this string in our notepad and proceed to further analysis.**

- Now we will move to ProcessMonitor analysis to see the functions and imports or exports APIs it is using->

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/ef84f264-8af8-47bd-99b6-0a93073952a6)


- In the Process Monitor, we can easily see that the Entry Point address of the DLL is **0x083D8753**

As we have got the entry point address of the executable, we have now completed the static analysis of the malware. 

## Dynamic Analysis

So after taking a snapshot of the Sandbox Environment Machine we are using for Malware Analysis, the malware is fired up to see the actual activity it does ->

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/df02689b-5cd7-4532-80a0-9476cf2b6b77)


- A dialog box asking for an IP address and port depicting if it wants to establish a connection between the localhost and the port and server provided.

- I filled random IP address and Port inside the dialog box : **127.0.0.1** and **8000** and proceed with the program: 

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/924e122e-4b8c-4795-9868-f6b45d6731bf)


- The application always shows the Network error irrespective of the connection establishment.
 
- **Also I observed that when the application is run then the powershell opens for a fraction of second that i could'nt capture unfortunately**

**This is highly suspicious as it appears that our application is trying to run a program on the background**

### TaskManager

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/4824ca3f-cf14-4205-8903-b80a6e14282c)


- This tells us that an unknown SSH service is being run by the malware on its own.

### ProcMon Analysis

We will use ProcMon to track the activities on the background the application is running ->

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/fadf2bd7-430d-43ac-8127-a1e64bb0410a)


- I filtered the (Process Name)(containing)(putty) and got this ->

![Alt text](image-12.png)

- Through this we got the Parent PID of the process running on the background due to action of our malware.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/bbf5f84a-adc5-4c81-8bc3-efdf63077b0d)


**Parent PID (on my system) -> 4940**

**Process PID(on my system) -> 8008**

- Thus if we want to see the programs run by the malware on itself then that program will have the Process PID as Parent PID.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/4a4b1c3d-6b23-4927-b71f-45909ef880f8)


![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/2108de59-6e35-4212-8a69-3ed0209d69ca)

- And we got a malicious process that is odd one out from all other normal processes.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/1ea242ef-af22-4e1d-bcdc-39d9826f8801)


- I opened this process details and saw that it is only the process that is running the powershell on the background but probably disables its box appearance.

![Alt text](image-22.png)

- I got this in the process and started analysing it in the sublime text editor.

- The function was probably decoding the Base64 string given in it here in the marked function.


![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/c44078fe-3e83-4325-93d7-4c168c117e3d)


- I decrypted the Base64 string and stored it in the format of a file 

- The file resulted in a gzip format file that i decompressed to extract the files inside it.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/ca1a87e8-2677-4a1f-9d67-910815fb4bde)


![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/c6cfbda1-3c15-4f9d-b0fa-6b05cf367da5)


- Here inside the **mal.gz** zip file I got a VB Script :

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/1facb501-38ba-4267-8e26-6e075a478ee9)

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/e95d5528-726a-448f-a75a-5c31c1955dda)


![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/cf92ee61-8eb7-4fa7-987a-3e2c146052e8)


-Here we see that the malware is trying to access the port : **8443** using TCP listening ports.

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/67dd04eb-695d-4097-9752-3abc6d22a9e6)


- Rest of the script was irrelevant as we got the gist of the malicious code.

**Now we will try to capture the packets sent by the malware on the port: 8443**

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/c9f92d90-9c26-469e-a6e4-795f998625be)


- Here most of the DNS queries are made by the normal applications but the highlighted DNS query is odd one out and so we can infer that the application tries to make contact with:

  ![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/fb45d840-62b9-4f9e-b729-caf36be10ab7)


![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/e10c359d-6ae5-4d9f-be36-cd13b82672fe)


- Now we will use Fakenet to see what requests is the malware trying to make at this server on the port 8443

![image](https://github.com/it4ch1-007/Malware-Analysis/assets/133276365/f35fa44f-2e67-4e9b-abcb-64b0001085f1)


- Thus the Fakenet tool is sending the fake responses to the application and the application is trying to make connection to the server using TCP port .

## THUS WE CAN CONCLUDE THAT:

### 1-> The malware is a <U>REMOTE ACCESS TROJAN</U>

### 2-> SHA256 hash is <u>0C82E654C09C8FD9FDF4899718EFA37670974C9EEC5A8FC18A167F93CEA6EE83</u>

### 3-> ENTRY POINT: DLL entry at <u>0x083D8753</u>

### 4-> Malicious Activity : Runs a powershell on the background to run malicious commands and make connection to the 
### server -> <u>bonus2.corporatebonusapplication.local</u>
### port -> 8443(TCP)

### It tries to give a reverse shell to the hacker who is running the server mentioned.







