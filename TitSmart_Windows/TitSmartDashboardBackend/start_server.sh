#!/bin/bash
echo "Starting MediaMTX..."
./mediamtx &
MEDIAMTX_PID=$!

echo "Starting Node Backend..."
npm start

kill $MEDIAMTX_PID
