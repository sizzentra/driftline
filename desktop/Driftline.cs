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
        // one window at a time (proposal 4, director 2026-11-22): two windows share one save and could overwrite each other's progress,
        // so opening the app again brings the open window forward instead
        bool first; var one = new System.Threading.Mutex(true, @"Local\Driftline.one", out first);
        var show = new System.Threading.EventWaitHandle(false, System.Threading.EventResetMode.AutoReset, @"Local\Driftline.show");
        if (!first) { show.Set(); return; }
        var app = new DriftlineApp();
        var win = new GameWindow(GameUrl);
        new System.Threading.Thread(() => { while (show.WaitOne()) win.Dispatcher.BeginInvoke(new Action(() => { if (win.WindowState == WindowState.Minimized) win.WindowState = WindowState.Normal; win.Activate(); win.Topmost = true; win.Topmost = false; win.Focus(); })); }) { IsBackground = true }.Start();
        app.Run(win);
        GC.KeepAlive(one);
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
            UserDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Driftline", "Data"),
            // proposal 3 (director, 2026-11-22): draw on the strong graphics card, and never slow the game down when another window is in front
            AdditionalBrowserArguments = "--force_high_performance_gpu --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows"
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
