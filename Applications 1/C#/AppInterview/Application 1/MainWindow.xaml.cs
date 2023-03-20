using System;
using System.Windows;
using System.Windows.Threading;
using SocketIOClient;

namespace Application_1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly SocketIO Client = new SocketIO("http://127.0.0.1:3001");
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindowLoaded;
        }

        private async void MainWindowLoaded(object sender, RoutedEventArgs e)
        {
            Client.OnConnected += async (sender, e) =>
            {
                await Client.EmitAsync("follower", "C# - Application 1");

                Client.On("input", response =>
                {
                    var message = response.GetValue<string>();
                    DispatchToUiThread(new Action(() => UpdateOutputTextAction(message)));
                });

                Client.OnDisconnected += (sender, e) =>
                {
                    Console.WriteLine("Device Disconnected");
                };
            };
            await Client.ConnectAsync();
        }

        private void UpdateOutputTextAction(string newData)
        {
            textBoxOutput.Text += textBoxOutput.Text == string.Empty ? newData : "\n" + newData;
            textBoxOutput.ScrollToEnd();
        }

        private void DispatchToUiThread(Action action)
        {
            Application.Current.Dispatcher.BeginInvoke(
                DispatcherPriority.Background,
                action
            );
        }

        private void ButtonSendClick(object sender, RoutedEventArgs e)
        {
            var input = textBoxInput.Text;
            Client.EmitAsync("broadcastLeader", input).Wait();
            textBoxInput.Text = string.Empty;
        }

        private void ButtonClearClick(object sender, RoutedEventArgs e)
        {
            textBoxOutput.Text = string.Empty;
        }
    }
}
