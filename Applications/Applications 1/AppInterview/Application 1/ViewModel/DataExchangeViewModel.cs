using System;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using SocketIOClient;

namespace Application_1
{
    sealed class DataExchangeViewModel : INotifyPropertyChanged
    {
        private readonly SocketIO Client = new SocketIO("http://127.0.0.1:3001");
        private readonly DataExchange DataExchange;
        public event PropertyChangedEventHandler PropertyChanged;
        private readonly string Separator = "\n";

        public void OnPropertyChange(string propertyName) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

        public DataExchangeViewModel()
        {
            DataExchange = new DataExchange
            {
                InputData = string.Empty,
                OutputData = string.Empty,
                DeviceName = "Application 1"
            };
        }
               
        public async Task StartSocketCommunication()
        {
            Client.OnConnected += async (sender, e) =>
            {
                await Client.EmitAsync("follower", "C# - Application 1");

                Client.On("input", response =>
                {
                    var message = response.GetValue<string>();
                    var splittedOutput = DataExchange.OutputData.Split(Separator);

                    if (splittedOutput.Length > 10)
                        splittedOutput = splittedOutput.Skip(1).ToArray();

                    var outputData = string.Join(Separator, splittedOutput);

                    outputData += DataExchange.OutputData == string.Empty ? message : Separator + message;

                    DataExchange.OutputData = outputData;
                    OnPropertyChange("OutputData");

                });

                Client.On("deviceName", response =>
                {
                    DataExchange.DeviceName = response.GetValue<string>();
                    OnPropertyChange("DeviceName");

                });

                Client.OnDisconnected += (sender, e) =>
                {
                    Console.WriteLine("Device Disconnected");
                };
            };
            await Client.ConnectAsync();
        }

        public void SendData() =>
            Client.EmitAsync("broadcastLeader", DataExchange.InputData).Wait();

        public void ClearOutput()
        {
            DataExchange.OutputData = string.Empty;
            OnPropertyChange("OutputData");
        }

        public string InputData
        {
            get { return DataExchange.InputData; }
            set
            {
                if (DataExchange.InputData != value)
                {
                    DataExchange.InputData = value;
                    OnPropertyChange("InputData");
                }

            }
        }

        public string OutputData
        {
            get { return DataExchange.OutputData; }
        }
        public string DeviceName
        {
            get { return DataExchange.DeviceName; }
        }
    }
}
