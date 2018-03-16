interface  SignupDetail {    
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;	
    confirmPassword? : string;
    accountType?:string;
}

interface  UpdatePassword {    
    
    currentPassword?: string;    
    newPassword? : string;
    confirmNewPassword? : string
   
}

interface LoginDetail {
    email: string;
    password: string;
}

interface ForgotPasswordDetail {
    email: string;
   
}

interface UserEmail {
    email: string
   
}
interface Address {
   
    address:string
}
interface ETHAddress{
	ETHtoken?:string;
	address?:string
}

interface TxHashAddress{
	TxHashAddress:string;
}


interface WithdrawDetail{
    userId?:any;
    fromAddress?:string;
    amount?:any;
    toAddress?:string;
    password?:string
}

interface ContactDetail{
    name?:any;
    subject?:string;
    email?:any;
    message?:string
  
}