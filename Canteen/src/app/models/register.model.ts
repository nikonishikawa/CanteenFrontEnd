export class Register { 
    username: string;
    password: string;
    info: {
        addressId: number;
        email: string;
        contactNumber: string;
        firstName: string;
        middleName: string;
        lastName: string;
    };
    
    constructor(data?: Register) {
        this.username =  "";
        this.password =  "";
        this.info = {
            addressId: 0,
            email: "",
            contactNumber: "",
            firstName: "",
            middleName:  "",
            lastName: ""
        };
    }
}
