@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo     Dice and Layers - Multi-Model QMK Build Script
echo =======================================================
echo.

:: ---------------------------------------------------------
:: Configuration Paths
:: ---------------------------------------------------------
set "QMK_MSYS_DIR=C:\QMK_MSYS"
set "QMK_FIRMWARE_DIR=C:\Users\Sathish\qmk_firmware"
set "REPO_ROOT=%~dp0..\"
set "SRC_DIR=%~dp0firmware"
set "DIST_DIR=%~dp0dist"

:: Check if QMK MSYS exists
if not exist "%QMK_MSYS_DIR%\mingw64\bin\qmk.exe" (
    echo [ERROR] QMK MSYS not found at %QMK_MSYS_DIR%
    echo Please verify the installation path.
    pause
    exit /b 1
)

:: Check if qmk_firmware exists
if not exist "%QMK_FIRMWARE_DIR%" (
    echo [ERROR] QMK Firmware not found at %QMK_FIRMWARE_DIR%
    pause
    exit /b 1
)

:: Create dist folder if it doesn't exist
if not exist "%DIST_DIR%" mkdir "%DIST_DIR%"

:: ---------------------------------------------------------
:: 1. Sync workspace files to qmk_firmware repository
:: ---------------------------------------------------------
echo [1/3] Syncing latest firmware sources to QMK repository...
echo       Source: "%SRC_DIR%"
echo       Target: "%QMK_FIRMWARE_DIR%\keyboards\dice_layers"
xcopy /E /I /Y "%SRC_DIR%" "%QMK_FIRMWARE_DIR%\keyboards\dice_layers" >nul
if %errorlevel% neq 0 (
    echo [WARNING] Some files failed to copy. Continuing...
) else (
    echo [OK] Files synchronized successfully.
)
echo.

:: ---------------------------------------------------------
:: 2. Configure QMK MSYS Environment
:: ---------------------------------------------------------
set "MSYSTEM=MINGW64"
set "MSYS2_PATH_TYPE=inherit"
set "SHELL=%QMK_MSYS_DIR%\usr\bin\bash.exe"
set "PATH=%QMK_MSYS_DIR%\mingw64\bin;%QMK_MSYS_DIR%\usr\bin;%PATH%"

cd /d "%QMK_FIRMWARE_DIR%"

:: ---------------------------------------------------------
:: 3. Compile all models
:: ---------------------------------------------------------
set "MODELS=1x3 3x3 3x3_pro 4x2 5x3 6x2_encoder"
set "SUCCESS_COUNT=0"
set "FAIL_COUNT=0"
set "FAILED_MODELS="

echo [2/3] Building firmware for models: %MODELS%
echo =======================================================

for %%M in (%MODELS%) do (
    echo.
    echo -------------------------------------------------------
    echo  Building model: %%M
    echo -------------------------------------------------------
    qmk compile -kb dice_layers/%%M -km default
    if !errorlevel! equ 0 (
        echo [OK] Successfully built %%M
        set /a SUCCESS_COUNT+=1
        
        :: Copy UF2 output to workspace dist folder
        if exist "%QMK_FIRMWARE_DIR%\.build\dice_layers_%%M_default.uf2" (
            copy /Y "%QMK_FIRMWARE_DIR%\.build\dice_layers_%%M_default.uf2" "%DIST_DIR%\" >nul
        ) else if exist "%QMK_FIRMWARE_DIR%\dice_layers_%%M_default.uf2" (
            copy /Y "%QMK_FIRMWARE_DIR%\dice_layers_%%M_default.uf2" "%DIST_DIR%\" >nul
        )
    ) else (
        echo [FAILED] Failed to build %%M
        set /a FAIL_COUNT+=1
        set "FAILED_MODELS=!FAILED_MODELS! %%M"
    )
)

:: ---------------------------------------------------------
:: Summary
:: ---------------------------------------------------------
echo.
echo =======================================================
echo                    BUILD SUMMARY
echo =======================================================
echo Total Models Attempted: 6
echo Succeeded: %SUCCESS_COUNT%
echo Failed:    %FAIL_COUNT%

if %FAIL_COUNT% gtr 0 (
    echo Failed Models:%FAILED_MODELS%
)

echo.
echo Compiled .uf2 binaries saved to:
echo   %DIST_DIR%
echo.

cd /d "%~dp0"
pause
