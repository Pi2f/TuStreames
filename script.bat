@echo off 
title TuStreames Application
mode con cols=80 lines=16
color 0F

cd %USERPROFILE%/Developpement/TuStreames/apps/app
start npm start

cd ../user
start npm start

cd ../playlist
start npm start

cd ../log
start npm start

pause