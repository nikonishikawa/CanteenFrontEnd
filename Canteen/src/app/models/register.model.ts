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
    
    constructor(data: Partial<Register> = {}) {
        this.username = data.username || "";
        this.password = data.password || "";
        this.info = {
            addressId: data.info?.addressId || 0,
            email: data.info?.email || "",
            contactNumber: data.info?.contactNumber || "",
            firstName: data.info?.firstName || "",
            middleName: data.info?.middleName || "",
            lastName: data.info?.lastName || ""
        };
    }
}
