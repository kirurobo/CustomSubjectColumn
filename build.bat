@echo off

rem Remember the current directory
set CURDIR=%cd%

rem Move to the directory where this script is located
cd /d %~dp0

rem Move to the target directory
cd src

rem Copy the readme file temporarily
copy ..\README.md .\README.txt

rem Create a xpi file
7z a ..\custom-subject-column@kirurobo.com.xpi *
set ERRORCODE=%errorlevel%
rem remember the error code

rem Remove the readme file
del .\README.txt

rem Move back to the original directory
cd /d %CURDIR%


rem If the 7z command failed, print an error message and exit
if %ERRORCODE% neq 0 (
    echo Error: 7z command failed! ^(Error code: %ERRORCODE%^)
    pause
    exit /b %ERRORCODE%
)

rem Pause (Commented out)
rem pause