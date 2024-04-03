export class Login { 
    username: string;
    password: string;
    
    constructor(
      data: Partial<Login> = {
    }
    )
      {
        this.username = "";
        this.password = "";
      }
  }

  