--- 
  title: "Game Reversing: CH-1"
  date: 2024-04-09 00:00:00  +0800
  categories: Reverse Engineering
  tags: [ReverseEngineering]
---


# Game Reversing Series

## CH-1: Game Hacking Setup

Hey there, Welcome to My first blog of the series of Game Reversing . Here you not only understand the fundamentals of the various games like CS:GO, GTA Vice City as well as many Multiplayer games but also modify and cheat in them a little bit.

However this series is for the readers which have just basic knowledge of assembly and memory instructions inside games generally. Still if anyone have any doubt regarding any blog then he can reach out to me on my socials. Now let's `HACK A GAME :P`.


But first of all we will take a demo game that is easy to understand and does'nt have much security or anti-cheat mechanisms like modern Steam games.

- As we will need a demo game to test on, thus we will download `The Battle Of Wesnoth` game using `choco install wesnoth`. 

```
If you don't have choco installed into your system then refer: 
https://chocolatey.org/install
```

- Battle of Wesnoth is a simple game that requires many startegies like `Recruiting an Army`,`Training the soldiers` and many more strategies while attacking too.

- Everytime we buy or recruit a soldier then our gold decreases. You can try that by just recruiting a random soldier.


### CHEAT ENGINE

Cheat Engine is a very strong and inportant tool for game hacking and memopry reading. It helps us to read the memory of the game during runtime and find specific values. Also it helps us to set breakpoints at the specific addresses to be able to debug the game memory,

##### Increasing the Gold

![image-2](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/ea122296-b6d6-4f69-9f1f-88991d5932f1)


- Here you can see the gold we have initially in the game is `40`. What if we can change this gold value without even playing the game!!!!


- Let's first find where in the game memory the value of `Gold` is stored:
    

    ![image-4](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/a7776e5d-2243-4ff1-b0ab-8ab552c04c33)

    - We will scan the memory for the value `40`
    - But we have many possibilities for this value . Thus we will decrease the value of gold accordingly and scan again.

    - Now we will recruit a unit to decrease the gold value.

    ![image-3](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/89fc7cb9-a681-47e1-b7df-9051086e85a4)


    ![image-5](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/14c1ccbf-5464-4a9d-9446-eec045802167)


    - Now we will search the value `26` in the memory through the scanner.

    ![image-6](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/d8c80c7b-2671-424c-9cd7-7d628d26e755)


    - And here we go, We have only one possibility, thus we can say that at this address the Gold value is stored inside the memory.

    - Now we will try to change the value of the selected address and set `200` as the new value.

    ![image-7](https://github.com/it4ch1-007/it4ch1-007.github.io/assets/133276365/1b05fcfc-d50e-405e-ba3d-89349a933a68)




    - And the value changed in the game too . Giving us `200` gold from nowhere.

Thus it is evident that we can easily change the hardcoded global variables inside the game memory whose addresses can be found and also modify their values according to us.

Reference: Game Hacking Academy by attilathedud
