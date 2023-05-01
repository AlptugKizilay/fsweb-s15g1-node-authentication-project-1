const mw = require("./auth-middleware");
const userModel = require("../users/users-model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */


  
  router.post("/register",mw.usernameBostami,mw.sifreGecerlimi,async (req,res,next)=>{
    try {
      let model = {
        username:req.body.username,
        password: bcrypt.hashSync(req.body.password) 
      }
      const inserted = await userModel.ekle(model);
      res.status(201).json(inserted)
    } catch (error) {
      next(error);
    }
  });
/*   router.post("/register", mw.usernameBostami, mw.sifreGecerlimi, (req, res, next) => {
    let model = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password)
    }
    userModel.ekle(model)
      .then((inserted) => {
        res.status(201).json(inserted);
      })
      .catch((error) => {
        next(error);
      });
  }); */
  

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post("/login", mw.usernameVarmi, async (req, res, next) => {
  try {
    req.session.user_id = req.currentUser.user_id;
    res.json({ message: `Hoşgeldin ${req.currentUser.username}` });
  } catch (error) {
    next(error);
  }
});

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */
router.get("/logout", (req, res, next) => {
  try {
    if (req.session.user_id > 0) {
      req.session.destroy((err) => {
        if (err) {
          res
            .status(500)
            .json({ message: "session destroy edilirken hata oluştu" });
        } else {
          res.json({ message: "Çıkış yapildi" });
        }
      });
    } else {
      res.status(400).json({ message: "Oturum bulunamadı!" }); //400 kullanıcıdan kaynaklı 
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
