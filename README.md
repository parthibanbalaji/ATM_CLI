# Install Application
npm install -g   -> this will install the ATM CLI in global

# Run Application
ATM  -> ATM keyword in the bash will trigger the globally installed ATM cli
Eg: ATM
C:\Node_worksapce\Atm_CLI>> ATM
ATM :>login Alice
Hello, Alice! 
Your balance is $0

Ctrl+C or .exit -> To exit the CLI


# Implementation
Used custom REPL to make the cli interactive and iterative

# Strorage
Used local file (./DataStorate/data.txt) to store the Users data

# Modules
Following are the list of modules
repl -> to create repl cli
colors -> to color the console outputs
