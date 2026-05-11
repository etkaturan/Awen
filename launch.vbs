Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

strDir = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Start Python backend completely hidden (0 = hidden window)
objShell.Run "cmd /c cd /d """ & strDir & "\backend"" && .venv\Scripts\activate && python main.py", 0, False

' Wait for backend to boot
WScript.Sleep 3000

' Launch app
Dim strExe
strExe = strDir & "\src-tauri\target\release\awen.exe"

If objFSO.FileExists(strExe) Then
    objShell.Run """" & strExe & """", 1, False
Else
    objShell.Run "cmd /c cd /d """ & strDir & """ && cargo tauri dev", 1, False
End If