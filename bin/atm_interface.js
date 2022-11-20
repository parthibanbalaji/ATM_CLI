/**
 * THiS File will return ATM object with the interface functions
 */

const dataStorage = require("./DataStroage/dataStorage");
const {ERROR_MESSAGES} = require("./const");
const{utilToFormOweMessage, utilToFormTransferReturnMessage} = require('./util')

class ATM {
    userSession;
    constructor() {
    }

    login(userName) {
        if(this.userSession) {
            return [ERROR_MESSAGES.ANOTHER_SESSION_EXIST,undefined]
        } else {
            let user = dataStorage.getUser(userName)
            this.userSession = {userName:user.userName}
            let message = `Hello, ${user.userName}! \nYour balance is $${user.balance}`;
            message = utilToFormOweMessage(user, message)
            return [null,message]
        }
    }

    logout() {
        if(!this.userSession)  {
            return[ERROR_MESSAGES.LOGOUT_ERROR,null]
        }
        let loggedUser = this.userSession.userName;
        this.userSession = undefined
        return [null,`Goodbye, ${loggedUser}!`]
    }

    deposit(amount) {
        if(!this.userSession) {
            return [ERROR_MESSAGES.LOGIN_TO_CONTINUE,null];
        }
        if(isNaN(amount)) return [ERROR_MESSAGES.ENTER_CORRECT_NUMBER,null];
        amount = Number(amount);
        let [index,currentUserData] = dataStorage.findUserandIndex(this.userSession);
        let balance = currentUserData.balance + amount
        currentUserData.balance = balance
        dataStorage.updateData([currentUserData])
        if(currentUserData.owed_to.length > 0) {
            return this.clearOwes(currentUserData)
        }
        return [null,`Your balance is $${balance}`]
    }

    withdraw(amount) {
        if(!this.userSession) {
            return [ERROR_MESSAGES.LOGIN_TO_CONTINUE,null]
        }
        if(isNaN(amount)) return  [ERROR_MESSAGES.ENTER_CORRECT_NUMBER,null];
        amount = Number(amount);
        let [index,currentUserData] = dataStorage.findUserandIndex(this.userSession);
        let balance = currentUserData.balance - amount;
        if(balance < 0) return [ERROR_MESSAGES.INSUFFICIENT_BALANCE,null]
        currentUserData.balance = balance
        dataStorage.updateData([currentUserData])
        return [null,`Your balance is $${balance}`]
    }

    transfer(details) {
        let [toUser, amount] = details;
        if(!this.userSession) {
            return [ERROR_MESSAGES.LOGIN_TO_CONTINUE,null];
        }
        if(toUser) {
            let [index,toUserData] = dataStorage.findUserandIndex({userName:toUser});
            if(toUserData == undefined) {
                return [ERROR_MESSAGES.ENTER_VALID_USER,null];
            } else {
                toUser = toUserData
            }
        }
        if(isNaN(amount)) return [ERROR_MESSAGES.ENTER_CORRECT_NUMBER,null];
        amount = Number(amount);

        let [index,currentUser] = dataStorage.findUserandIndex(this.userSession)
        let currentUserBalance = currentUser.balance;

        

        // current user has already dept to the transfer user
        if(currentUser.owed_to.length > 0) {
            let isCurrentUserOwedtoToUser = currentUser.owed_to.findIndex((ele)=> {return ele.userName == toUser.userName});
            if(isCurrentUserOwedtoToUser != -1) {
                let owe = currentUser.owed_to[isCurrentUserOwedtoToUser];
                let totalAmountToTransfer = owe.amount + amount;
                let transferredAmount
                
                // set current UserBalance
                if(currentUser.balance >= totalAmountToTransfer) {
                    transferredAmount = totalAmountToTransfer;
                    currentUser.balance =  currentUser.balance - totalAmountToTransfer
                    currentUser.owed_to.splice(isCurrentUserOwedtoToUser,1)

                    toUser.balance = toUser.balance + totalAmountToTransfer;
                    let currentUserIntoUserIndex = toUser.owed_from.findIndex((ele)=> {return ele.userName == currentUser.userName});
                    toUser.owed_from.splice(currentUserIntoUserIndex,1)
                }
                else if(currentUser.balance < totalAmountToTransfer) {
                    currentUser.balance =  0;
                    currentUser.owed_to[isCurrentUserOwedtoToUser].amount = totalAmountToTransfer - currentUserBalance;
                    transferredAmount = currentUserBalance

                    toUser.balance = toUser.balance + currentUserBalance;
                    let currentUserIntoUserIndex = toUser.owed_from.findIndex((ele)=> {return ele.userName == currentUser.userName});
                    toUser.owed_from[currentUserIntoUserIndex].amount = currentUser.owed_to[isCurrentUserOwedtoToUser].amount
                }
                dataStorage.updateData([toUser,currentUser])
                return [null, utilToFormTransferReturnMessage(transferredAmount,toUser.userName,currentUser)]
            }
        } 

        // transfer user has dept to the current user
        if(currentUser.owed_from.length > 0) {
            let mainBalance
            let isCurrentUserOwedFromToUser = currentUser.owed_from.findIndex((ele)=> {return ele.userName == toUser.userName});
            let transferredAmount
            if(isCurrentUserOwedFromToUser != -1) {
                let owe = currentUser.owed_from[isCurrentUserOwedFromToUser];
                let owedAmount = owe.amount;
                if(owedAmount >= amount) {
                    transferredAmount = amount
                    currentUser.owed_from[isCurrentUserOwedFromToUser].amount =  owedAmount - amount;
                    let currentInToUserIndex = toUser.owed_to.findIndex((ele)=> {return ele.userName == currentUser.userName})
                    toUser.owed_to[currentInToUserIndex].amount = currentUser.owed_from[isCurrentUserOwedFromToUser].amount;
                    if(currentUser.owed_from[isCurrentUserOwedFromToUser].amount == 0) {
                        currentUser.owed_from.splice(isCurrentUserOwedFromToUser,1)
                        toUser.owed_to.splice(currentInToUserIndex,1)
                    }   
                } else {
                    currentUser.owed_from.splice(isCurrentUserOwedFromToUser,1)
                    currentUserBalance = currentUserBalance + owedAmount;
                    let currentInToUserIndex = toUser.owed_to.findIndex((ele)=> {return ele.userName == currentUser.userName})
                    toUser.owed_to.splice(currentInToUserIndex,1)
                    if(currentUserBalance >= amount) {
                        transferredAmount = amount
                        mainBalance = currentUserBalance - amount;
                        toUser.balance = toUser.balance+balance;
                        currentUser.balance = mainBalance
                    } else {
                        transferredAmount = currentUserBalance
                        currentUser.balance = 0
                        let diff = amount - currentUserBalance
                        let dataOwedToCurrentUser = currentUser.owed_to.findIndex((ele)=> {return ele.userName == toUser.userName});
                        let dataOwedFromCurrentUser =  toUser.owed_from.findIndex((ele)=> {return ele.userName == currentUser.userName})

                        if(dataOwedToCurrentUser != -1) {
                            currentUser.owed_to[dataOwedToCurrentUser].amount = currentUser.owed_to[dataOwedToCurrentUser].amount + diff;
                        }else {
                            currentUser.owed_to.push({userName:toUser.userName,amount:diff})
                        }
                        if(dataOwedFromCurrentUser != -1) {
                            toUser.owed_from[dataOwedFromCurrentUser].amount = toUser.owed_from[dataOwedFromCurrentUser].amount +diff;
                        } else {
                            toUser.owed_from.push({userName:currentUser.userName, amount:diff})
                        }
                       
                    }
                }
                dataStorage.updateData([toUser,currentUser])
                return [null, utilToFormTransferReturnMessage(transferredAmount,toUser.userName,currentUser)]
            }
        } 

        // No debts between two users
        let transferredAmount
        if(currentUserBalance >= amount) {
            transferredAmount = amount;
            currentUser.balance = currentUser.balance - amount
            toUser.balance = toUser.balance+amount;
        } else {
            currentUser.balance = 0;
            transferredAmount=currentUserBalance;
            toUser.balance = toUser.balance+currentUserBalance;
            let diff = amount - currentUserBalance
            currentUser.owed_to.push({userName:toUser.userName,amount:diff})
            toUser.owed_from.push({userName:currentUser.userName, amount:diff})
        }
       dataStorage.updateData([toUser,currentUser]);
       return [null, utilToFormTransferReturnMessage(transferredAmount,toUser.userName,currentUser)]
       
    }

    clearOwes(currentUserData) {
        for(let [index, owe] of currentUserData.owed_to.entries()) {
            return this.transfer([owe.userName,0])
        }
    }
}




const atm = new ATM();
module.exports = atm;