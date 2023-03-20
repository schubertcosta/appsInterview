using System.Windows;

namespace Application_1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly DataExchangeViewModel _dataExchangeViewModel;
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
            _dataExchangeViewModel = new DataExchangeViewModel();
            DataContext = _dataExchangeViewModel;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e) =>
            await _dataExchangeViewModel.StartSocketCommunication();

        private void Button_Send_Click(object sender, RoutedEventArgs e) => 
            _dataExchangeViewModel.SendData();

        private void Button_Clear_Click(object sender, RoutedEventArgs e) => 
            _dataExchangeViewModel.ClearOutput();
    }
}
