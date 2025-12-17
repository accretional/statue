#!/bin/bash
set -e

echo "Running local statue-ssg package test..."

# Navigate to project root (two levels up from test/hermetic)
cd "$(dirname "$0")/../.."

# Step: Remove existing tar files if they exist
echo "Cleaning up existing .tgz files..."
rm -f *.tgz

# Step: Create npm package
echo "Creating npm package..."
npm pack

# Get the package filename
PACKAGE_FILE=$(ls *.tgz | head -n 1)
echo "Package created: $PACKAGE_FILE"

# Step: Run Docker container with mounted .tgz file
echo "Starting Docker container with mounted package..."
CONTAINER_ID=$(docker run -d -p 3000:3000 -v "$(pwd)/$PACKAGE_FILE:/package/$PACKAGE_FILE" statue-ssg)

echo "Container ID: $CONTAINER_ID"
echo "Waiting for preview server to start..."

# Step: Keep curling the container to see when npm run preview starts successfully
MAX_ATTEMPTS=30
ATTEMPT=0
SUCCESS=false
SERVER_URL="http://localhost:3000"

echo "Testing server availability at: $SERVER_URL"
echo "Maximum attempts: $MAX_ATTEMPTS"
echo "Container ID: $CONTAINER_ID"

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    echo "========================================="
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS - Testing server connectivity..."
    echo "Target URL: $SERVER_URL"
    echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Check container status first
    CONTAINER_STATUS=$(docker ps --filter "id=$CONTAINER_ID" --format "table {{.Status}}" | tail -n +2)
    if [ -n "$CONTAINER_STATUS" ]; then
        echo "Container status: $CONTAINER_STATUS"
    else
        echo "⚠️  Container is not running!"
        echo "Container logs (last 10 lines):"
        docker logs --tail 10 $CONTAINER_ID
        break
    fi
    
    # Test server connectivity with detailed output
    echo "🔍 Sending HTTP request to $SERVER_URL..."
    if curl -s -f --connect-timeout 5 --max-time 10 -w "HTTP Status: %{http_code}, Response Time: %{time_total}s, Size: %{size_download} bytes\n" $SERVER_URL > /dev/null 2>&1; then
        echo "✅ Server is responding successfully!"
        echo "🎉 Test PASSED - Server at $SERVER_URL is accessible"
        SUCCESS=true
        break
    else
        CURL_EXIT_CODE=$?
        echo "❌ Server not responding (curl exit code: $CURL_EXIT_CODE)"
        case $CURL_EXIT_CODE in
            7) echo "   Reason: Failed to connect to host" ;;
            22) echo "   Reason: HTTP error (4xx/5xx status code)" ;;
            28) echo "   Reason: Connection timeout" ;;
            *) echo "   Reason: Unknown curl error" ;;
        esac
        
        # Show recent container logs for debugging
        echo "📋 Recent container logs (last 3 lines):"
        docker logs --tail 3 $CONTAINER_ID | sed 's/^/   /'
    fi
    
    echo "⏳ Waiting 2 seconds before next attempt..."
    sleep 2
done

# Step: After a certain amount of time with no response, consider the test failed and stop the container
if [ "$SUCCESS" = false ]; then
    echo "========================================="
    echo "❌ Test FAILED - Server did not respond within expected time"
    echo "📊 Test Summary:"
    echo "   - Target URL: $SERVER_URL"
    echo "   - Total attempts: $ATTEMPT"
    echo "   - Duration: $((ATTEMPT * 2)) seconds"
    echo "   - Container ID: $CONTAINER_ID"
    echo ""
    echo "🔍 Full container logs for debugging:"
    echo "----------------------------------------"
    docker logs $CONTAINER_ID
    echo "----------------------------------------"
fi

# Step: Stop and remove container
echo "🛑 Stopping and cleaning up container..."
echo "Container ID: $CONTAINER_ID"
docker stop $CONTAINER_ID > /dev/null 2>&1
docker rm $CONTAINER_ID > /dev/null 2>&1
echo "✅ Container cleanup completed"

# Step: If the curl request succeeds before then, consider the test passed
if [ "$SUCCESS" = true ]; then
    echo "========================================="
    echo "🎉 statue-ssg package test completed successfully!"
    echo "📊 Test Summary:"
    echo "   - Target URL: $SERVER_URL"
    echo "   - Successful attempt: $ATTEMPT/$MAX_ATTEMPTS"
    echo "   - Total duration: $((ATTEMPT * 2)) seconds"
    exit 0
else
    echo "========================================="
    echo "💥 statue-ssg package test failed!"
    echo "❌ Server at $SERVER_URL was not accessible after $MAX_ATTEMPTS attempts"
    exit 1
fi 