// Driftline desktop app: a standalone Windows window for the game (no browser needed).
// It loads the live game, so it always has the newest version, keeps progress in its own
// folder, works offline after the first run, and installs itself with Start-menu and desktop icons.
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

public class DriftlineApp : Application
{
    const string GameUrl = "https://sizzentra.github.io/driftline/";
    static readonly string[] Files = { "Driftline.exe", "Microsoft.Web.WebView2.Core.dll", "Microsoft.Web.WebView2.Wpf.dll", "WebView2Loader.dll", "driftline.ico" };

    [STAThread]
    public static void Main(string[] args)
    {
        string here = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
        string home = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "Driftline");
        bool portable = Array.IndexOf(args, "--portable") >= 0;
        if (!portable && !string.Equals(Path.GetFullPath(here), Path.GetFullPath(home), StringComparison.OrdinalIgnoreCase))
        {
            if (Install(here, home)) return;
        }
        var app = new DriftlineApp();
        app.Run(new GameWindow(GameUrl, home));
    }

    // copies the app to %LOCALAPPDATA%\Programs\Driftline and adds Start-menu + desktop shortcuts
    static bool Install(string from, string to)
    {
        try
        {
            Directory.CreateDirectory(to);
            foreach (string f in Files)
            {
                string src = Path.Combine(from, f);
                if (File.Exists(src)) File.Copy(src, Path.Combine(to, f), true);
            }
            string offSrc = Path.Combine(from, "offline"), offDst = Path.Combine(to, "offline");
            if (Directory.Exists(offSrc))
            {
                Directory.CreateDirectory(offDst);
                foreach (string f in Directory.GetFiles(offSrc)) File.Copy(f, Path.Combine(offDst, Path.GetFileName(f)), true);
            }
            string exe = Path.Combine(to, "Driftline.exe"), ico = Path.Combine(to, "driftline.ico");
            string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Programs), "Driftline.lnk");
            string desktop = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "Driftline.lnk");
            MakeShortcut(startMenu, exe, to, ico);
            MakeShortcut(desktop, exe, to, ico);
            Process.Start(new ProcessStartInfo(exe) { WorkingDirectory = to, UseShellExecute = true });
            return true;
        }
        catch (Exception e)
        {
            MessageBox.Show("Driftline couldn't install itself, so it will run from this folder.\n\n" + e.Message, "Driftline");
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
        st.InvokeMember("Description", BindingFlags.SetProperty, null, sc, new object[] { "Driftline, a cosy fishing game" });
        st.InvokeMember("Save", BindingFlags.InvokeMethod, null, sc, null);
    }
}

public class GameWindow : Window
{
    readonly WebView2 view = new WebView2();
    readonly string url, home;
    bool triedOffline, full;
    WindowState prevState; WindowStyle prevStyle;

    public GameWindow(string url, string home)
    {
        this.url = url; this.home = home;
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
