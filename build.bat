:: Build script for shake-lang.github.io
@echo off



:: Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal


set SHAKE_REPOSITORY=https://github.com/shake-lang/shake

set START_DIR=%CD%

cd %0\..

:: Remember build base-dir
set BUILD_BASEDIR=%CD%


if "%1" == "build" goto build-run
if "%1" == "clean" goto build-clean
if "%1" == "help" goto help
if "%1" == "" (
  echo.
  echo Please specify subcommand
  echo Enter build help to get help!
  goto end
)
echo.
echo Invalid command "%0 %*"
echo Enter build help to get help!
goto end

:: Clean Task
:build-clean




:build-interpreter
:: Clean interpreter
cd %BUILD_BASEDIR%\interpreter
echo.
echo Starting clean...
echo.
echo.
echo.
echo.
echo ---------------------------- Clean Interpreter -----------------------------
echo.
echo ^> interpreter/gradlew clean
echo.
call gradlew clean
echo.
echo ------------------------ Clean Interpreter finished -------------------------
echo.
echo.
cd %BUILD_BUILDDIR%
echo.
echo.


:remove-build-folder
:: Remove build folder
echo Removing build folder...
if exist "%BUILD_BASEDIR%\build" rmdir %BUILD_BASEDIR%\build /s /q

echo clean finished!
goto end







:: Build Task
:build-run

echo.
echo Starting build...
echo.
echo.



:init-build-dir

:: Create build folder
if not exist "build" mkdir build
cd build

:: Remember build-dir
set BUILD_BUILDDIR=%CD%




:clone-shake

:: Clone Shake
if not exist "shake" (
  echo.
  echo Cloning shake repository ^(%SHAKE_REPOSITORY%^) into build/shake...
  echo.
  git clone %SHAKE_REPOSITORY% ./shake
  echo.
  echo.
)




:build-shake

:: Publish Shake
cd %BUILD_BUILDDIR%\Shake
echo.
echo.
echo ------------------------------- Build Shake -------------------------------
echo.
echo ^> build/shake/gradlew publishToMavenLocal
echo.
call gradlew publishToMavenLocal --quiet
echo --------------------------- Build Shake finished --------------------------




:build-interpreter
:: Build interpreter
cd %BUILD_BASEDIR%\interpreter
echo.
echo.
echo ---------------------------- Build Interpreter ----------------------------
echo.
echo ^> interpreter/gradlew build
echo.
call gradlew build
echo.
echo ------------------------ Build Interpreter finished ------------------------


:: Go back to build dir
cd %BUILD_BUILDDIR%

echo.
echo.
echo build finished successfully

goto end


:help
:: Print out help
echo Subcommands:
echo %0 build  -  Build the application
echo %0 clean  -  Clean the build
echo %0 help   -  Show this help-menu

goto end

:: End of the File, End script
:end
cd %START_DIR%