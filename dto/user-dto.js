module.exports = class UserDto {
    name;
    email;
    id;
    isActivated;
    password;

    constructor(model) {
        ({name:this.name,email: this.email, _id: this.id, isActivated: this.isActivated,password:this.password} = model);
    }
}

