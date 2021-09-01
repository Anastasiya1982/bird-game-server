module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(model) {
        ({email: this.email, _id: this.id, isActivated: this.isActivated} = model);
    }
}

