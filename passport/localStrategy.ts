import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.entity";
import { AppDataSource } from "../models";
import { Strategy as LocalStrategy } from "passport-local";

const local = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const userRepository = AppDataSource.createQueryRunner();
        await userRepository.connect();
        await userRepository.startTransaction();
        try {
          const exUser = await userRepository.manager
            .getRepository(User)
            .findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
export default local;
