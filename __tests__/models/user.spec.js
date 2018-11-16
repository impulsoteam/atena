import User from "../../models/user";

describe("[Models] User", () => {
  it("should be invalid if name is empty", () => {
    let user = new User();
    user.validate(err => {
      expect(err.errors.name).toBeTruthy();
    });
    expect(user).toMatchSnapshot();
  });
});
