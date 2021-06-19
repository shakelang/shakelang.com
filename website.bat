@rem Build script for shake-lang.github.io
@echo off



@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal


set SHAKE_REPOSITORY=https://github.com/shake-lang/shake

set START_DIR=%CD%

cd %0\..

@rem Remember build base-dir
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

@rem Clean Task
:build-clean




:clean-interpreter
@rem Clean gradle
echo Starting clean...
if exist "%BUILD_BASEDIR%\build\shake" (
  cd %BUILD_BASEDIR%\build\shake
  echo.
  echo.
  echo ---------------------------- Clean Interpreter -----------------------------
  echo.
  echo ^> build/shake/gradlew clean
  echo.
  call gradlew clean --quiet
  echo.
  echo ------------------------ Clean Interpreter finished -------------------------
  echo.
  cd %BUILD_BASEDIR%
)

if exist "%BUILD_BASEDIR%\build" (

  echo.
  echo.
  echo ---------------------------- Clean Interpreter -----------------------------
  echo.
  echo ^> gradlew clean
  echo.
  call gradlew clean --quiet
  echo.
  echo ------------------------ Clean Interpreter finished -------------------------
  echo.
  echo.

)

:remove-build-folder
@rem Remove build folder
if exist "%BUILD_BASEDIR%\build" (
  echo Removing build folder...
  rmdir %BUILD_BASEDIR%\build /s /q
)

echo clean finished!
goto end







@rem Build Task
:build-run

echo.
echo Starting build...



:init-build-dir

@rem Create build folder
if not exist "build" mkdir build
cd build

@rem Remember build-dir
set BUILD_BUILDDIR=%CD%




:clone-shake

@rem Clone Shake
if not exist "shake" (
  echo.
  echo Cloning shake repository ^(%SHAKE_REPOSITORY%^) into build/shake...
  echo.
  git clone %SHAKE_REPOSITORY% ./shake
  echo.
  echo.
)




:build-shake

@rem Publish Shake
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
@rem Build interpreter
cd %BUILD_BASEDIR%
echo.
echo.
echo ---------------------------- Build Interpreter ----------------------------
echo.
echo ^> gradlew build
echo.
call gradlew build --quiet
echo.
echo ------------------------ Build Interpreter finished ------------------------



:build-interpreter
@rem Build web application
cd %BUILD_BASEDIR%

echo.
echo.
echo ------------------------------- Install npm -------------------------------
echo.
echo ^> npm i
echo.
call npm i
echo.
echo --------------------------- Install npm finished ---------------------------

echo.
echo.
echo ------------------------------ Build Website ------------------------------
echo.
echo ^> grunt build
echo.
call npx grunt build
echo.
echo -------------------------- Build Website finished --------------------------

echo.
echo.
echo build finished successfully

goto end


:help
@rem Print out help
echo Subcommands:
echo %0 build  -  Build the application
echo %0 clean  -  Clean the build
echo %0 help   -  Show this help-menu

goto end

@rem End of the File, End script
:end
cd %START_DIR%