--- 
title: "Decompetition.io Writeups"
date: 2024-01-11 00:00:00  +0800
categories: Decompetition_Writeups
tags: [decompetition.io]
---

# Baby-C

Today we are going to decompile the assembly given in the challenge baby-C of Decompetitionv2.0 :

**First of All we are given blocks that have assembly language so we start form the (main:) block**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/18f3254c-30c5-4311-9872-fd33a2c78fdf)

->  Here we can easily see that the program is pushing RBP(base pointer register) and RSP(Stack pointer Register) into the Stack for the program to be able to use it.

**Now we move onto (block 1) as (main:) block was not doing much for us**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/98fba478-2930-4d3e-8849-bb46bc42eacd)



->Here we observe that RAX(Accumulator Register) is made to take the input from the user.

->Then we give it as an argument of the function "getc()" and then store it at an address 0x14 below the base pointer

->Then we are comparing the input with -1 and if that happens we will jump to the (block7) of the program

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/639dd5b5-04c0-467d-a265-74764241ccfc)


![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/22c0eb84-e229-409d-b4d2-7b38705c7305)



	
->We have made two variables flag and b as we can see that the assembly is making space on the stack and marking one as stdin variable thus two variables are declared and b is input from the user.

->Here we have added the break statement inside the if condition (b==-1) because of the statements of (block 7:) as if the value is -1 for the variable b then it will jump to (block 7).

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/bad25a26-6808-4805-bb86-c7f3c56dcc42)



->The (block 7) basically exits or returns the program by popping RBP and RSP out of the Stack.

->So we can assume that whichever block enters the (block 7) will break a loop or return the program

**Now we assume that we donot have value of b equal to -1 then we will move to (block 2):**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/86eafd99-8600-4c5d-9f85-f8b399cd0fc3)



->In this block we are calling the function '__ctype_b_loc@plt.sec' and basically checking the condition:

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/a22e500e-6966-4cca-b384-81f33a9d4027)



->This statement is equivalent to (isalpha==0) or it checks if the given argument character is an alphabet or not . And if the given argument is an alphabet then it will jump to (block 4)

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/35340909-8650-4d00-aa58-a01d4cb8b996)



**Now let us assume that the address (rbp-0x15) or our input variable does'nt store the value 0 . Then it will goto (block 5), then next block:**

->In this block we can easily see that the 'toupper()' function is being called with the argument as our input varaible and then putc is called to print it . Thus :

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/68528e40-d925-4941-a877-badd15279c8c)



->Here if statement will check for flag=1 or not and then flag variable is set to 0 

->But the last statement of the block tells us to go back to (block1) again so we can assume that a loop is going on for our whole program.

->So we are going to add a while loop in our program :

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/8f5a2e70-a6a9-43a1-86f7-90cb52195eed)



**Now we assume that our flag variable was 0 when we decided to compare it in (block 4) then we will jump to (block 6):**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/9fd6139b-527c-437c-a9aa-82cd483d0a7a)


->This is also similar to the (block 5) while it is calling 'tolower()' with the argument given in the (EDI) register (the 32 bit version of RDI).

->This also ends at block 1 again so this will also come in the block of our while loop

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/b9ad4a8a-5f65-4a01-914c-b31a94ed4372)



**Here we backtrace the assembly and observe that if the character is not an alphabet then flag variable is as it is while it is set to 1 if the 'b' variable is an alphabet.**

**Thus at last our decompiled code becomes:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/eeda3d26-978e-44a2-9ca5-b37a3156d2d2)



**And here we receive 100% score  😊**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/810b6403-ee8d-4f62-99e4-8262e05d5011)


# **baby-CPP**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/7311c80c-a73a-40a2-8399-fbca9f6d9e10)



- Above is the first block of the assembly program given that is accessing the Command-line Arguments and storing them in (rbp-0x14) and (rbp-0x20).

- We should know that when we put Command-line Arguments then we have to input a vector having its first argument as the name of the executable file and then all the arguments we want to give.

**This gives us our first statement:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/c92ab3d5-db6c-4d48-a9be-be3ef7873f61)


**Now we shall see the (block 1) of the assembly:**

- We compare the first argument of the Command-Line Vector := argc to 2 or we simply check if there are 2 arguments given to the command line.

- If the arguments are not 2 then ->

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/7941ed41-64aa-445b-9943-c730c4e6da65)



- The first two statements describes that "USAGE: ./grade n" has to be printed as an error output statement.

- Also the exit() function is called with EDI equal to 2.

**Thus our code becomes:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/b688c5e2-fdd1-4e1d-8761-82da2b79e741)



- If the argument count is not 2 then we will jump to block 2 :

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/6db60386-8290-4676-b148-dd9a24e8b3f9)



- Here we can easily observe that the program is converting 1st index argument of the vector (argv) to an integer using 'atoi()' function and storing it inside a variable on the stack.

- Then another variable on the stack is set to 1, at the 7th line of the block.

- Also here we compare the converted number variable (num) to 0 and if it is less or equal to 0, then we move onto the next block (block 3).

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/bd76f626-3b07-4c17-9e46-e716eeaa5ab4)



- This block prints the string "Don't be so negative." as an error output. Also it uses endl after that.

- Then it exits the program using the argument 2 in the RDI register.

**Thus our code becomes:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/19d7dde3-3719-4266-9a14-0f6eb4470df6)



**Now we move onto the next block (block 4)**

- We will move here only if num variable is not equal to 0->

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/7ecf4715-ea85-4828-a8c3-af8492ecbaf4)



- In this block the program is using 'sqrt()' function to evaluate the sqaure root of the 'num' variable value and store it into the variable that I named cnt.

**Thus we got our statement to add:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/269cea6f-37d2-46e1-abd8-8d66cb9e4f12)



**Now the next block is:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/d03bcac3-6822-4aa7-b25a-073330326922)



- This tells us that the program compares the value stored at (rbp-8) in  the stack or one of the variable with 1.

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/614501a1-b9ad-4585-9732-01399f7ffa96)



- Also we can infer that this above can be said a while loop until cnt variable is more than 1 as then only it will get oht of the loop and go to block9.

**Thus our code becomes:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/768e64e9-cc51-4ded-aa65-429ec667cde1)


- This happens because we will see in the next block sections(block6 and block7) we can transform the calculations into the given code.

- Now let us break out of the loop or simply say set 'cnt' variable to less than or equal to 1.

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/0f1d5c1c-9f33-49bf-b2d7-643783965b62)



- These instructions tell us that we will jump to block11 if 'num' variable is not equal to 1.

- If not then this block will execute:

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/9df06725-31c4-47db-a3b4-93306e288b5f)



**Making our code:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/09815c6d-e048-4065-a290-a9c3c3186297)



- The correct if statement if fulfilled then the block10 will be executed making our code giving us the if statement.

### **THUS OUR FINAL CODE IS:**

![image](https://github.com/it4ch1-007/decompetition.io-solutions/assets/133276365/5d1044f8-b425-4eb7-8723-6b90c0f13f52)



