//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Text;
//using System.Threading.Tasks;
//using System.Windows;
//using System.Windows.Controls;
//using System.Windows.Data;
//using System.Windows.Documents;
//using System.Windows.Input;
//using System.Windows.Media;
//using System.Windows.Media.Imaging;
//using System.Windows.Shapes;
//using System.Security.Cryptography;
//using System.Text.RegularExpressions;

//namespace cherniy
//{
//    /// <summary>
//    /// Логика взаимодействия для Window1.xaml
//    /// </summary>
//    public partial class RegistrationWindow : Window
//    {
//        public RegistrationWindow()
//        {
//            InitializeComponent();
//        }

//        private void Button_Click(object sender, RoutedEventArgs e)
//        {
//            AuthorizationWindow window = new AuthorizationWindow();
//            window.Show();
//            this.Close();

//        }

//        private void Button_Click_1(object sender, RoutedEventArgs e)
//        {   
//            string firstName = ((TextBox)this.FindName("name")).Text;
//            string secondName = ((TextBox)this.FindName("secondName")).Text;
//            string email = ((TextBox)this.FindName("email")).Text;
//            string password = ((TextBox)this.FindName("password")).Text;
//            string confirmPassword = ((TextBox)this.FindName("passconfirm")).Text;
//            if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(secondName) ||
//                string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
//            {
//                MessageBox.Show("Все поля должны быть заполнены.", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
//                return;
//            }
//            if (!IsValidEmail(email))
//            {
//                MessageBox.Show("неверный формат почты", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
//                return;
//            }

//            // Проверка, совпадают ли пароли
//            if (password != confirmPassword)
//            {
//                MessageBox.Show("Пароли не совпадают.", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
//                return;
//            }
//            string hashedPassword = HashPassword(password);
//            using (var context = new AppDbContext())
//            {
//                var existingUser = context.Users.FirstOrDefault(u => u.Email == email);
//                if (existingUser != null)
//                {
//                    MessageBox.Show("Пользователь с такой почтой уже существует.", "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
//                    return;
//                }
//                var newUser = new Cities
//                {
//                    FirstName = firstName,
//                    SecondName = secondName,
//                    Email = email,
//                    _Password = password
//                };
//                context.Users.Add(newUser);
//                context.SaveChanges();
//                MessageBox.Show("Регистрация успешно завершена!", "Успех", MessageBoxButton.OK, MessageBoxImage.Information);
//            }
//        }
//        private string HashPassword(string password)
//        {
//            using (SHA256 sha256 = SHA256.Create())
//            {
//                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
//                StringBuilder builder = new StringBuilder();
//                foreach (byte b in bytes)
//                {
//                    builder.Append(b.ToString("x2"));
//                }
//                return builder.ToString();
//            }
//        }
//        private bool IsValidEmail(string email)
//        {
//            // Регулярное выражение для проверки формата email
//            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
//            return Regex.IsMatch(email, emailPattern);
//        } 

//    }
//}
