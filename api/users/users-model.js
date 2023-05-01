const db = require("../../data/db-config")
/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
  const allUsers = await db("users");
  const mappedUsers = allUsers.map((user)=>{
    return {user_id:user.user_id, username: user.username}
  })
  return mappedUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  const users = await db("users").where(filtre);
  return users;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  const user = await db("users").where("user_id",user_id).first();
  delete user.password;
  return user;
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  const [user_id] = await db("users").insert(user);
  return idyeGoreBul(user_id);
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {ekle,idyeGoreBul,bul,goreBul};
