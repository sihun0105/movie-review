import { AppDataSource } from "../models";
import local from "./localStrategy";
import { User } from "../models/user.entity";
import passport from "passport";
interface expressUser {
  id: number;
}
const passportConfig = () => {
  passport.serializeUser(function (user: expressUser, done) {
    done(null, user.id);
  });
  passport.initialize;
  passport.deserializeUser(async (id: number, done) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager
        .getRepository(User)
        .findOne({ where: { id } })
        .then((user) => done(null, user))
        .catch((err) => done(err));
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  });
  local();
};
export default passportConfig;
