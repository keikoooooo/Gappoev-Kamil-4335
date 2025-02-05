//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace cherniy
//{
//    public class AuthService
//    {
//        private readonly AppDbContext _context;

//        private AuthService(AppDbContext context)
//        {
//            _context = context;
//        }

//        public string AuthenticateUser(string login, string password)
//        {
//            if (string.IsNullOrWhiteSpace(login))
//                return "Введите логин";

//            if (string.IsNullOrWhiteSpace(password))
//                return "Введите пароль";

//            var existingUser = _context.Users.FirstOrDefault(u => u.Email == login);
//            if (existingUser == null)
//                return "Не существует такого пользователя";

//            return existingUser._Password == password ? "Авторизован" : "Неверный логин или пароль";
//        }
//    }

//}
