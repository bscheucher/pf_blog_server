import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "./database.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM blog_users WHERE username = $1",
        [username]
      );
      const user = result.rows[0];

      if (!user) return done(null, false, { message: "Incorrect username." });

      // Check password (you need bcrypt or similar here)
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch)
        return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM blog_users WHERE id = $1", [
      id,
    ]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
