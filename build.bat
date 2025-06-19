@echo off

REM Install function dependencies
echo Installing function dependencies...
cd functions
call npm install
cd ..

REM Install frontend dependencies and build
echo Installing frontend dependencies and building...
cd frontend
call npm install
call ng build --configuration production 