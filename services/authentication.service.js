const MongoDB = require("./mongodb.service")
const {mongoConfig,tokenSecret} = require("../config")
const bcrypt = require("bcrypt")
const webToken = require("jsonwebtoken")

const userRegister = async (user) => {
    try{
        if(!user?.username || !user?.email || !user?.password)return{status:false,mesaage:"Please fill up all the fields"};
        const passwordHash = await bcrypt.hash(user?.password,10)
        let userObject = {
            username: user?.username,
            email: user?.email,
            password : passwordHash
        }
        let savedUser = await MongoDB.db.collection(mongoConfig.dbCollection.USERS).insertOne(userObject)
        if(savedUser?.acknowledged && savedUser?.insertedId){
            let token = webToken.sign({username: userObject?.username,email:userObject?.email},tokenSecret,{expiresIn:"24h"})
            return{
                status: true,
                message: "user registered successfully",
                data: token,
            }
        }else{
            return{
                status:false,
                message:"user registered failed"
            }
        }
    } catch(error){
        console.log(error)
        let errorMsg = "user registered failed"
        error?.code === 11000 && error?.keyPattern?.username ? (errorMsg = "Username already exist") : null;
        error?.code === 11000 && error?.keyPattern?.email ? (errorMsg = "Email already exist") : null;
        return{
            status:false,
            message:errorMsg,
            error:error?.toString()
        }
    }

};

const userLogin = async (user) =>{
    try{
        if(!user?.username ||!user?.password)return{status:false,mesaage:"Please fill up all the fields"};
        let connectUser = await MongoDB.db.collection(mongoConfig.dbCollection.USERS).findOne({username:user?.username})
        if (connectUser){
            let passwoordControl = await bcrypt.compare(user?.password,connectUser?.password)
            if(passwoordControl){
            let token = webToken.sign({username: connectUser?.username,email: connectUser?.email},tokenSecret,{expiresIn:"24h"})
            return{
                status: true,
                message: "use login successful",
                data: token,
            }
        }else{
            return{
                status:false,
                message:"Incorrect password"
            }
     }
    }else{
        return{
            status:false,
            message:"No user found"
        }
    }
}catch(error){
        console.log(error)
        return{
            status:false,
            message:"user login failed",
            error:error?.toString()
        }
    }
}

const userCheckExist = async (query) =>{
    let message ={
        email: "User already exist",
        username: "This username is taken",
    }
    try{
        let queryType = Object.keys(query)[0]
        let userObject = await MongoDB.db.collection(mongoConfig.dbCollection.USERS).findOne(query)
        console.log(userObject)
        return !userObject ? {status:true,message:`This ${queryType} is not taken`} :{status:false,message:message[queryType]} 
    }catch(error){}
}

const addOrderToUser = async (order) =>{
    try{
            
            let updateUser = await MongoDB.db.collection(mongoConfig.dbCollection.ORDERS).insertOne(order)
            if(updateUser?.result?.ok === 1){
                return{
                    status:true,
                    message:"Order added successfully",
                    data:orderArray
                }
            }else{
                return{
                    status:false,
                    message:"Order added failed"
                }
            }
    }catch(error){
        console.log(error)
        return{
            status:false,
            message:"Order added failed",
            error:error?.toString()
        }
    }

}

module.exports = {userRegister,userLogin,userCheckExist,addOrderToUser}