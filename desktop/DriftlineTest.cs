// Driftline Test: the director's testing app (director, 2026-11-17: "a fullscreen pc exclusive way to test it. Browser is NOT
// the proper way to test this, I should have a testing app"). The same kind of window as the Driftline desktop app, but it
// loads the PREVIEW build (/next/), starts in full screen on the main monitor, and keeps its own data folder, so it never
// touches the live game's save. F11 switches between full screen and a window, F5 reloads (to pick up a new preview build),
// F12 opens the developer tools. Local tool only: it is not published on the site.
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;

public class DriftlineTestApp : Application
{
    const string GameUrl = "https://sizzentra.github.io/driftline/next/";
    static readonly string[] Files = { "DriftlineTest.exe", "Microsoft.Web.WebView2.Core.dll", "Microsoft.Web.WebView2.Wpf.dll", "WebView2Loader.dll", "driftline.ico" };

    [STAThread]
    public static void Main(string[] args)
    {
        string here = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
        string home = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "DriftlineTest");
        bool portable = Array.IndexOf(args, "--portable") >= 0, installOnly = Array.IndexOf(args, "--install-only") >= 0;
        if (!portable && !string.Equals(Path.GetFullPath(here), Path.GetFullPath(home), StringComparison.OrdinalIgnoreCase))
        {
            if (Install(here, home, !installOnly)) return;
        }
        var app = new DriftlineTestApp();
        app.Run(new TestWindow(GameUrl));
    }

    // copies the app to %LOCALAPPDATA%\Programs\DriftlineTest and adds a desktop + Start-menu shortcut "Driftline Test"
    static bool Install(string from, string to, bool launch)
    {
        try
        {
            Directory.CreateDirectory(to);
            foreach (string f in Files)
            {
                string src = Path.Combine(from, f);
                if (File.Exists(src)) File.Copy(src, Path.Combine(to, f), true);
            }
            string exe = Path.Combine(to, "DriftlineTest.exe"), ico = Path.Combine(to, "driftline.ico");
            MakeShortcut(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "Driftline Test.lnk"), exe, to, ico);
            MakeShortcut(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "Driftline Test.lnk"), exe, to, ico);
            if (launch) Process.Start(new ProcessStartInfo(exe) { WorkingDirectory = to, UseShellExecute = true });
            return true;
        }
        catch (Exception e)
        {
            MessageBox.Show("Driftline Test couldn't install itself, so it will run from this folder.\n\n" + e.Message, "Driftline Test");
            return false;
        }
    }

    static void MakeShortcut(string lnk, string target, string dir, string icon)
    {
        Type t = Type.GetTypeFromProgID("WScript.Shell");
        object shell = Activator.CreateInstance(t);
        object sc = t.InvokeMember("CreateShortcut", BindingFlags.InvokeMethod, null, shell, new object[] { lnk });
        Type st = sc.GetType();
        st.InvokeMember("TargetPath", BindingFlags.SetProperty, null, sc, new object[] { target });
        st.InvokeMember("WorkingDirectory", BindingFlags.SetProperty, null, sc, new object[] { dir });
        st.InvokeMember("IconLocation", BindingFlags.SetProperty, null, sc, new object[] { icon });
        st.InvokeMember("Description", BindingFlags.SetProperty, null, sc, new object[] { "Driftline Test: the preview build, full screen" });
        st.InvokeMember("Save", BindingFlags.InvokeMethod, null, sc, null);
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
