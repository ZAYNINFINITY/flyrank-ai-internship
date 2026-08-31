$ErrorActionPreference = "Stop"
try {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
        "Reminder: add the next Foyer case study - Collaborative Workspace (MERN + Socket.io).`n`n1) Open week-03/app/lib/mock-data/exhibits.ts`n2) Add a Project entry under the 'zayn' exhibit`n3) Write the three-beat story: problem -> what you did -> what came of it`n4) Optimize the image to WebP, commit via branch + PR",
        "Foyer - Add Next Case Study",
        "OK",
        "Information"
    )
}
catch {
    $Error | Out-File -FilePath "$env:TEMP\foyer-reminder-error.log" -Append
}
