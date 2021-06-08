:: Build script for shake-lang.github.io
@echo off



:: Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal


set SHAKE_REPOSITORY=https://github.com/shake-lang/shake


:: Remember build base-dir
set BUILD_BASEDIR=%CD%




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
echo ^> build/shake/gradlew publishToMavenLocal --quiet
echo.
call gradlew publishToMavenLocal --quiet
echo --------------------------- Build Shake finished --------------------------




:build-interpreter
:: Publish Shake
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