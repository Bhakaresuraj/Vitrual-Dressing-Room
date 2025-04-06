# PowerShell script to download sample clothing images

# Create images directory if it doesn't exist
$imagesDir = ".\images"
if (!(Test-Path -Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
}

# Define image URLs and their local filenames
$imageUrls = @{
    "https://i.imgur.com/uPQxKui.jpg" = "black-suit.jpg"
    "https://i.imgur.com/T1zVFDP.jpg" = "blue-jeans.jpg"
    "https://i.imgur.com/iJXv8LG.jpg" = "red-dress.jpg"
    "https://i.imgur.com/KczVq1I.jpg" = "green-shirt.jpg"
    "https://i.imgur.com/YJwTRkZ.jpg" = "white-shirt.jpg"
    "https://i.imgur.com/7TOjbCo.jpg" = "blue-blazer.jpg"
    "https://i.imgur.com/QmqSpSJ.jpg" = "hero-image.jpg"
    "https://i.imgur.com/OFP23SV.gif" = "demo-animation.gif"
}

# Download each image
foreach ($url in $imageUrls.Keys) {
    $localPath = Join-Path -Path $imagesDir -ChildPath $imageUrls[$url]
    Write-Host "Downloading $($imageUrls[$url]) from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $localPath
        Write-Host "Downloaded to $localPath" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $($imageUrls[$url]): $_" -ForegroundColor Red
    }
}

Write-Host "Image download completed!" -ForegroundColor Green 