class UserClass {
  firstName;
  lastName;
  googleId;
  email;
  avatar;
  createdAt;

  constructor(
    firstName,
    lastName,
    googleId,
    email,
    avatar,
    createdAt = new Date()
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.googleId = googleId;
    this.email = email;
    this.avatar = avatar;
    this.createdAt = createdAt;
  }


}

module.exports = UserClass;
