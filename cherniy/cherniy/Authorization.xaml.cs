//using System.Data;
//using System.Text;
//using System.Windows;
//using System.Windows.Controls;
//using System.Windows.Data;
//using System.Windows.Documents;
//using System.Windows.Input;
//using System.Windows.Media;
//using System.Windows.Media.Imaging;
//using System.Windows.Navigation;
//using System.Windows.Shapes;

//namespace cherniy
//{
//    /// <summary>
//    /// Interaction logic for MainWindow.xaml
//    /// </summary>
//    public partial class AuthorizationWindow : Window
//    {
//        public AuthorizationWindow()
//        {
//            InitializeComponent();

//        }

//        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
//        {

//        }

//        private void Button_Click(object sender, RoutedEventArgs e)
//        {
//            RegistrationWindow window = new RegistrationWindow();
//            window.Show();
//            this.Close();
//        }

//        private void Button_Click_1(object sender, RoutedEventArgs e)
//        {
//            string enteredLogin = textBox_login.Text;
//            string enteredPassword = password.Password;
//            using (var context = new AppDbContext())
//            {
//                var existingUser = context.Users.FirstOrDefault(u => u.Email == enteredLogin);
//                if (existingUser != null)
//                {
//                    if (textBox_login.Text.Length > 0) // проверяем введён ли логин     
//                    {
//                        if (password.Password.Length > 0) // проверяем введён ли пароль         
//                        {             // ищем в базе данных пользователя с такими данными         
//                            if (enteredPassword == existingUser._Password)
//                            {
//                                MessageBox.Show("Авторизован");
//                            }
//                            else MessageBox.Show("Неверный логин или пароль"); // выводим ошибку    
//                        }
//                        else MessageBox.Show("Введите логин"); // выводим ошибку 
//                    }
//                    else MessageBox.Show("Введите пароль");
//                }
//                else MessageBox.Show("Не существует такого польщзователя");

//            }
//        }

//    }

//}