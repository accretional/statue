#!/bin/bash
# Yuxor Claude Code Setup Script for Linux/macOS
# Kopyalayıp terminal'e yapıştırın / Copy and paste into terminal

# Renkler / Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "\n${CYAN}=== Yuxor Claude Code Setup ===${NC}\n"

# API Key iste / Request API Key
read -p "Yuxor API Keyinizi Girin / Enter your Yuxor API Key: " apiKey

# API Key doğrula / Validate API Key
if [ -z "$apiKey" ] || [ ${#apiKey} -lt 10 ]; then
    echo -e "${RED}[ERROR] Geçersiz API key / Invalid API key${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] API key formatı geçerli / API key format valid${NC}"

# Claude dizini yolu / Claude directory path
claudeDir="$HOME/.claude"
settingsPath="$claudeDir/settings.json"

echo -e "${BLUE}[i] Claude dizini / Claude directory: $claudeDir${NC}"

# Dizini oluştur / Create directory
if [ ! -d "$claudeDir" ]; then
    echo -e "${BLUE}[i] .claude dizini oluşturuluyor / Creating .claude directory${NC}"
    mkdir -p "$claudeDir"
    echo -e "${GREEN}[OK] Dizin oluşturuldu / Directory created${NC}"
else
    echo -e "${BLUE}[i] Claude dizini mevcut / Claude directory exists${NC}"
fi

# Mevcut ayarları yedekle / Backup existing settings
if [ -f "$settingsPath" ]; then
    timestamp=$(date -u +"%Y-%m-%dT%H-%M-%S")
    backupPath="${settingsPath}.backup-${timestamp}"
    cp "$settingsPath" "$backupPath"
    echo -e "${GREEN}[OK] Yedek oluşturuldu / Backup created: $backupPath${NC}"
fi

# Yeni ayarları oluştur / Create new settings
if [ -f "$settingsPath" ]; then
    # Mevcut ayarları oku ve birleştir / Read and merge existing settings
    existingSettings=$(cat "$settingsPath" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$existingSettings" ]; then
        # Python veya jq ile JSON birleştirme / Merge JSON with Python or jq
        if command -v python3 &> /dev/null; then
            python3 << EOF
import json
import sys

try:
    with open('$settingsPath', 'r') as f:
        settings = json.load(f)
except:
    settings = {}

if 'env' not in settings:
    settings['env'] = {}

settings['env']['ANTHROPIC_AUTH_TOKEN'] = '$apiKey'
settings['env']['ANTHROPIC_BASE_URL'] = 'https://api2.yuxor.tech/'
settings['env']['API_TIMEOUT_MS'] = '3000000'
settings['env']['CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC'] = 1

with open('$settingsPath', 'w') as f:
    json.dump(settings, f, indent=2)
EOF
        elif command -v jq &> /dev/null; then
            jq --arg key "$apiKey" '.env.ANTHROPIC_AUTH_TOKEN = $key | .env.ANTHROPIC_BASE_URL = "https://api2.yuxor.tech/" | .env.API_TIMEOUT_MS = "3000000" | .env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1' "$settingsPath" > "${settingsPath}.tmp" && mv "${settingsPath}.tmp" "$settingsPath"
        else
            echo -e "${YELLOW}[!] Python3 veya jq bulunamadı, yeni ayarlar oluşturuluyor / Python3 or jq not found, creating new settings${NC}"
            cat > "$settingsPath" << EOF
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "https://api2.yuxor.tech/",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
EOF
        fi
    else
        cat > "$settingsPath" << EOF
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "https://api2.yuxor.tech/",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
EOF
    fi
else
    # Yeni dosya oluştur / Create new file
    cat > "$settingsPath" << EOF
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "https://api2.yuxor.tech/",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
EOF
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK] settings.json başarıyla oluşturuldu / settings.json created successfully${NC}"
else
    echo -e "${RED}[ERROR] settings.json yazılamadı / Failed to write settings.json${NC}"
    exit 1
fi

# Özet göster / Show summary
echo -e "\n${CYAN}=== Yapılandırma Özeti / Configuration Summary ===${NC}"
echo "Claude Dizini / Directory: $claudeDir"
echo "Ayar Dosyası / Settings File: $settingsPath"
echo "API Key: ${apiKey:0:10}...${apiKey: -10}"
echo "Base URL: https://api2.yuxor.tech/"
echo "Zaman Aşımı / Timeout: 3000000ms (50 dakika / minutes)"

# Talimatları göster / Show instructions
echo -e "\n${GREEN}=== Kurulum Tamamlandı! / Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Sonraki Adımlar / Next Steps:${NC}"
echo "1. Claude Code çalışıyorsa yeniden başlatın / Restart Claude Code if running"
echo "2. Terminal açıp çalıştırın / Open terminal and run: claude"
echo "3. Claude Code artık Yuxor proxy kullanacak / Will use Yuxor proxy"
echo ""
echo -e "${YELLOW}Kurulumu Test Edin / Test your setup:${NC}"
echo '  claude'
echo '  > "Merhaba, çalışıyor musun? / Hello, are you working?"'
echo ""

echo -e "${GREEN}[OK] Kurulum başarıyla tamamlandı! / Setup completed successfully!${NC}\n"