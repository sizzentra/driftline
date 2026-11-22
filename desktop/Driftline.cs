// Driftline desktop app: a standalone Windows window for the game (no browser needed).
// It loads the live game, so it always has the newest version, keeps progress in its own data folder and works offline
// after the first run. It runs from the folder it was unzipped to (no self-install: see Main).
using System;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

public class DriftlineApp : Application
{
    const string GameUrl = "https://sizzentra.github.io/driftline/";

    // Runs from the folder it was unzipped to: it no longer copies itself, makes shortcuts or restarts itself (2026-11-21:
    // that self-install pattern made Windows' download check call the file a Trojan). Progress lives in its own data folder
    // (%LOCALAPPDATA%\Driftline\Data) wherever the program sits, so moving the folder loses nothing.
    [STAThread]
    public static void Main(string[] args)
    {
        var app = new DriftlineApp();
        app.Run(new GameWindow(GameUrl));
    }
}

public class GameWindow : Window
{
    readonly WebView2 view = new WebView2();
    readonly string url;
    bool triedOffline, full;
    WindowState prevState; WindowStyle prevStyle;

    public GameWindow(string url)
    {
        this.url = url;
        Title = "Driftline";
        Width = 1280; Height = 880; MinWidth = 420; MinHeight = 520;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        Background = new SolidColorBrush(Color.FromRgb(10, 22, 29));
        try { Icon = BitmapFrame.Create(new Uri(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "driftline.ico"))); } catch { }
        view.DefaultBackgroundColor = System.Drawing.Color.FromArgb(10, 22, 29);
        view.CreationProperties = new CoreWebView2CreationProperties
        {
            UserDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Driftline", "Data")
        };
        Content = view;
        Loaded += OnLoaded;
        PreviewKeyDown += (s, e) => { if (e.Key == Key.F11) { SetFull(!full); e.Handled = true; } };
    }

    async void OnLoaded(object sender, RoutedEventArgs e)
    {
        try { await view.EnsureCoreWebView2Async(); }
        catch (Exception ex)
        {
            MessageBox.Show("Driftline needs the Microsoft Edge WebView2 Runtime, which comes with Windows 10 and 11.\nGet it from https://go.microsoft.com/fwlink/p/?LinkId=2124703\n\n" + ex.Message, "Driftline");
            Close(); return;
        }
        CoreWebView2 core = view.CoreWebView2;
        core.Settings.AreDevToolsEnabled = false;
        core.Settings.AreDefaultContextMenusEnabled = false;
        core.Settings.IsStatusBarEnabled = false;
        core.Settings.IsZoomControlEnabled = false;
        core.Settings.AreBrowserAcceleratorKeysEnabled = false;
        core.Settings.IsGeneralAutofillEnabled = false;
        await core.AddScriptToExecuteOnDocumentCreatedAsync("window.DL_DESKTOP = true;");
        string offline = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "offline");
        if (Directory.Exists(offline)) core.SetVirtualHostNameToFolderMapping("driftline.offline", offline, CoreWebView2HostResourceAccessKind.Allow);
        core.DocumentTitleChanged += (s, a) => { Title = "Driftline"; };
        core.ContainsFullScreenElementChanged += (s, a) => SetFull(core.ContainsFullScreenElement);
        core.NewWindowRequested += (s, a) => { a.Handled = true; OpenExternal(a.Uri); };
        core.NavigationStarting += (s, a) =>
        {
            Uri u;
            if (Uri.TryCreate(a.Uri, UriKind.Absolute, out u) && u.Host != "sizzentra.github.io" && u.Host != "driftline.offline")
            { a.Cancel = true; OpenExternal(a.Uri); }
        };
        core.NavigationCompleted += (s, a) =>
        {
            if (!a.IsSuccess && !triedOffline && Directory.Exists(offline))
            { triedOffline = true; core.Navigate("https://driftline.offline/index.html"); }
        };
        core.Navigate(url);
    }

    static void OpenExternal(string uri)
    {
        try { Process.Start(new ProcessStartInfo(uri) { UseShellExecute = true }); } catch { }
    }

    void SetFull(bool on)
    {
        if (on == full) return;
        full = on;
        if (on) { prevState = WindowState; prevStyle = WindowStyle; WindowStyle = WindowStyle.None; WindowState = WindowState.Normal; WindowState = WindowState.Maximized; }
        else { WindowStyle = prevStyle; WindowState = prevState; }
    }
}
