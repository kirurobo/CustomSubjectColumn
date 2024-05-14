@echo off

rem Move to the directory where this script is located
cd /d %~dp0

rem Move to the target directory
cd src

rem Copy the readme file
copy ..\README.md .\README.txt

rem Create a xpi file
7z a ..\custom-subject-column@kirurobo.com.xpi *

rem pause