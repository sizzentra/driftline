// Driftline Test: the director's testing app (director, 2026-11-17: "a fullscreen pc exclusive way to test it. Browser is NOT
// the proper way to test this, I should have a testing app"). The same kind of window as the Driftline desktop app, but it
// loads the PREVIEW build (/next/), starts in full screen on the main monitor, and keeps its own data folder, so it never
// touches the live game's save. F11 switches between full screen and a window, F5 reloads (to pick up a new preview build),
// F12 opens the developer tools. It runs from the folder it was unzipped to (no self-install: see Main).
using System;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

public class DriftlineTestApp : Application
{
    const string GameUrl = "https://sizzentra.github.io/driftline/next/";

    // Runs from the folder it was unzipped to: it no longer copies itself, makes shortcuts or restarts itself (2026-11-21:
    // that self-install pattern made Windows' download check call the file a Trojan). Its data folder
    // (%LOCALAPPDATA%\DriftlineTest\Data) stays the same wherever the program sits.
    [STAThread]
    public static void Main(string[] args)
    {
        var app = new DriftlineTestApp();
        app.Run(new TestWindow(GameUrl));
    }
}

public class TestWindow : Window
{
    readonly WebView2 view = new WebView2();
    readonly string url;
    bool full, pageFull;

    public TestWindow(string url)
    {
        this.url = url;
        Title = "Driftline Test (preview)";
        Width = 1280; Height = 800; MinWidth = 420; MinHeight = 520;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        Background = new SolidColorBrush(Color.FromRgb(10, 22, 29));
        try { Icon = BitmapFrame.Create(new Uri(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "driftline.ico"))); } catch { }
        view.DefaultBackgroundColor = System.Drawing.Color.FromArgb(10, 22, 29);
        view.CreationProperties = new CoreWebView2CreationProperties
        {
            UserDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "DriftlineTest", "Data")
        };
        Content = view;
        Loaded += OnLoaded;
        SourceInitialized += (s, e) => SetFull(true); // start full screen, like the game is played
        PreviewKeyDown += (s, e) =>
        {
            if (e.Key == Key.F11) { SetFull(!full); e.Handled = true; }
            else if (e.Key == Key.F5 && view.CoreWebView2 != null) { view.CoreWebView2.Reload(); e.Handled = true; }
            else if (e.Key == Key.F12 && view.CoreWebView2 != null) { view.CoreWebView2.OpenDevToolsWindow(); e.Handled = true; }
        };
    }

    async void OnLoaded(object sender, RoutedEventArgs e)
    {
        try { await view.EnsureCoreWebView2Async(); }
        catch (Exception ex)
        {
            MessageBox.Show("Driftline Test needs the Microsoft Edge WebView2 Runtime, which comes with Windows 10 and 11.\n\n" + ex.Message, "Driftline Test");
            Close(); return;
        }
        CoreWebView2 core = view.CoreWebView2;
        core.Settings.AreDevToolsEnabled = true;
        core.Settings.AreDefaultContextMenusEnabled = false;
        core.Settings.IsStatusBarEnabled = false;
        core.Settings.IsZoomControlEnabled = false;
        core.Settings.IsGeneralAutofillEnabled = false;
        await core.AddScriptToExecuteOnDocumentCreatedAsync("window.DL_DESKTOP = true; window.DL_TESTAPP = true;");
        core.DocumentTitleChanged += (s, a) => { Title = "Driftline Test (preview)"; };
        /* the game's Full screen button (2026-11-21, director: "even clicking full screen on pc doesn't work"): the app already starts full
           screen, so the game asks the app to switch by message; a page that goes full screen on its own is followed, and leaving it puts the
           window back the way it was */
        core.WebMessageReceived += (s, a) => { string m = null; try { m = a.TryGetWebMessageAsString(); } catch { } if (m == "dl-fullscreen") Dispatcher.Invoke(() => SetFull(!full)); };
        core.ContainsFullScreenElementChanged += (s, a) => { if (core.ContainsFullScreenElement) { pageFull = !full; SetFull(true); } else if (pageFull) { pageFull = false; SetFull(false); } };
        core.NewWindowRequested += (s, a) => { a.Handled = true; OpenExternal(a.Uri); };
        core.NavigationStarting += (s, a) =>
        {
            Uri u;
            if (Uri.TryCreate(a.Uri, UriKind.Absolute, out u) && u.Host != "sizzentra.github.io")
            { a.Cancel = true; OpenExternal(a.Uri); }
        };
        core.Navigate(url);
    }

    static void OpenExternal(string uri)
    {
        try { Process.Start(new ProcessStartInfo(uri) { UseShellExecute = true }); } catch { }
    }

    void SetFull(bool on)
    {
        if (on == full && IsLoaded) return;
        full = on;
        if (on) { WindowStyle = WindowStyle.None; ResizeMode = ResizeMode.NoResize; WindowState = WindowState.Normal; WindowState = WindowState.Maximized; Topmost = false; }
        else { WindowStyle = WindowStyle.SingleBorderWindow; ResizeMode = ResizeMode.CanResize; WindowState = WindowState.Normal; Width = 1280; Height = 800; WindowStartupLocation = WindowStartupLocation.CenterScreen; }
    }
}
