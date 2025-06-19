#!/bin/bash

# Install function dependencies
echo "Installing function dependencies..."
cd functions
npm install
cd ..

# Install frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd frontend
npm install
ng build --configuration production 