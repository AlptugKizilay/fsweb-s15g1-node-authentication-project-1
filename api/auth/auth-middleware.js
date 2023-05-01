const userModel = require("../users/users-model");
const bcrypt = require("bcryptjs");
/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  try {
    if (req.session && req.session.user_id > 0) {
      //user
      next();
    } else {
      res.status(401).json({ message: "Geçemezsiniz!" });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  try {
    const isExist = await userModel.goreBul({ username: req.body.username });
    if (isExist && isExist.length > 0) {
      res.status(422).json({ message: "Username kullaniliyor" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  try {
    let { username, password } = req.body;
    const isExist = await userModel.goreBul({ username: username });

    if (
      isExist.length > 0 &&
      bcrypt.compareSync(password, isExist[0].password)
    ) {
      req.currentUser = isExist[0];
      next();
    } else {
      res.status(422).json({ message: "Geçersiz kriter" });
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  try {
    const validPassword = req.body.password && req.body.password.length > 3;
    if (!validPassword) {
      res.status(422).json({
        message: "Şifre 3 karakterden fazla olmalı",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  sifreGecerlimi,usernameBostami,usernameVarmi,sinirli
}
// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
