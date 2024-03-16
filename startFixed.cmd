@REM $env:REACT_NATIVE_PACKAGER_HOSTNAME=""
@REM set REACT_NATIVE_PACKAGER_HOSTNAME=

@echo off
FOR /F "tokens=4 delims= " %%i in ('route print ^| find " 0.0.0.0"') do set REACT_NATIVE_PACKAGER_HOSTNAME=%%i
npx expo start